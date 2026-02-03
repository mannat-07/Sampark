import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../lib/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check if user is admin
const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(500).json({ error: "Failed to verify admin status" });
  }
};

// Get dashboard statistics
router.get("/dashboard/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Get total grievances
    const totalGrievances = await prisma.grievance.count();

    // Get total users
    const totalUsers = await prisma.user.count({
      where: { role: 'USER' }
    });

    // Get grievances by status
    const statusBreakdown = await prisma.$queryRaw<Array<{ status: string; count: number }>>`
      SELECT 
        s.status,
        COUNT(DISTINCT s."grievanceId")::int as count
      FROM (
        SELECT DISTINCT ON ("grievanceId") 
          "grievanceId",
          status,
          "createdAt"
        FROM "GrievanceStatusHistory"
        ORDER BY "grievanceId", "createdAt" DESC
      ) s
      GROUP BY s.status
    `;

    // Calculate individual status counts
    const submitted = statusBreakdown.find((s: { status: string; count: number }) => s.status === 'SUBMITTED')?.count || 0;
    const underReview = statusBreakdown.find((s: { status: string; count: number }) => s.status === 'UNDER_REVIEW')?.count || 0;
    const inProgress = statusBreakdown.find((s: { status: string; count: number }) => s.status === 'IN_PROGRESS')?.count || 0;
    const resolved = statusBreakdown.find((s: { status: string; count: number }) => s.status === 'RESOLVED')?.count || 0;
    const rejected = statusBreakdown.find((s) => s.status === 'REJECTED')?.count || 0;

    // Calculate resolution rate
    const resolvedCount = resolved;
    const resolutionRate = totalGrievances > 0 
      ? ((resolvedCount / totalGrievances) * 100).toFixed(1)
      : "0.0";

    // Calculate average resolution time (in days) for resolved grievances
    const avgResolutionTime = await prisma.$queryRaw<Array<{ avg_days: number }>>`
      SELECT 
        COALESCE(
          AVG(
            EXTRACT(EPOCH FROM (resolved_status."createdAt" - g."createdAt")) / 86400
          )::numeric,
          0
        )::float as avg_days
      FROM "Grievance" g
      INNER JOIN (
        SELECT DISTINCT ON ("grievanceId") 
          "grievanceId",
          "createdAt"
        FROM "GrievanceStatusHistory"
        WHERE status = 'RESOLVED'
        ORDER BY "grievanceId", "createdAt" DESC
      ) resolved_status ON resolved_status."grievanceId" = g.id
    `;

    const averageResolutionDays = avgResolutionTime[0]?.avg_days || 0;

    // Get recent grievances (last 5)
    const recentGrievances = await prisma.grievance.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        statuses: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    // Get grievances by category
    const categoryBreakdown = await prisma.grievance.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });

    // Get monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await prisma.$queryRaw<Array<{ month: string; total: number; resolved: number }>>`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', g."createdAt"), 'Mon') as month,
        COUNT(*)::int as total,
        COUNT(CASE WHEN latest_status.status = 'RESOLVED' THEN 1 END)::int as resolved
      FROM "Grievance" g
      LEFT JOIN (
        SELECT DISTINCT ON ("grievanceId") 
          "grievanceId",
          status
        FROM "GrievanceStatusHistory"
        ORDER BY "grievanceId", "createdAt" DESC
      ) latest_status ON latest_status."grievanceId" = g.id
      WHERE g."createdAt" >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', g."createdAt")
      ORDER BY DATE_TRUNC('month', g."createdAt")
    `;

    res.json({
      success: true,
      stats: {
        total: totalGrievances,
        submitted,
        underReview,
        inProgress,
        resolved,
        rejected,
        totalUsers,
        resolutionRate,
        averageResolutionDays: parseFloat(averageResolutionDays.toFixed(1)),
        categoryBreakdown: categoryBreakdown.reduce((acc: Record<string, number>, item: { category: string; _count: { id: number } }) => {
          acc[item.category] = item._count.id;
          return acc;
        }, {} as Record<string, number>),
        monthlyTrend,
        recentGrievances: recentGrievances.map((g: any) => ({
          id: g.id,
          trackingId: g.trackingId,
          title: g.title,
          category: g.category,
          status: g.statuses[0]?.status || 'SUBMITTED',
          priority: g.priority,
          user: {
            name: g.user.name
          },
          createdAt: g.createdAt
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

// Get all grievances with pagination and filtering
router.get("/grievances", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      category,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { trackingId: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category && typeof category === 'string') {
      where.category = category.toUpperCase();
    }

    if (priority && typeof priority === 'string') {
      where.priority = priority.toUpperCase();
    }

    // Get total count
    const totalCount = await prisma.grievance.count({ where });

    // Get grievances
    const grievances = await prisma.grievance.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { [sortBy as string]: sortOrder },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        statuses: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Filter by status (from status history)
    let filteredGrievances = grievances;
    if (status && typeof status === 'string') {
      filteredGrievances = grievances.filter((g: any) => {
        const latestStatus = g.statuses[0]?.status;
        return latestStatus === status.toUpperCase();
      });
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      grievances: filteredGrievances.map((g: any) => ({
        ...g,
        currentStatus: g.statuses[0]?.status || 'SUBMITTED',
        statusHistory: g.statuses
      })),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasMore: pageNum < totalPages
      }
    });
  } catch (error) {
    console.error("Error fetching grievances:", error);
    res.status(500).json({ error: "Failed to fetch grievances" });
  }
});

// Update grievance status
router.patch("/grievances/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params as { id: string };
    const { status, comment } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // Validate status
    const validStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Check if grievance exists
    const grievance = await prisma.grievance.findUnique({
      where: { id },
      include: {
        statuses: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!grievance) {
      return res.status(404).json({ error: "Grievance not found" });
    }

    // Don't allow duplicate status
    if (grievance.statuses[0]?.status === status.toUpperCase()) {
      return res.status(400).json({ error: "Grievance already has this status" });
    }

    // Create new status history entry
    const statusUpdate = await prisma.grievanceStatusHistory.create({
      data: {
        grievanceId: id as string,
        status: status.toUpperCase(),
        comment: comment || null,
        createdBy: req.user?.id || ''
      }
    });

    // Update grievance updatedAt timestamp
    await prisma.grievance.update({
      where: { id: id as string },
      data: { updatedAt: new Date() }
    });

    // Get updated grievance with all statuses
    const updatedGrievance = await prisma.grievance.findUnique({
      where: { id: id as string },
      include: {
        statuses: {
          orderBy: { createdAt: 'desc' }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: "Status updated successfully",
      statusUpdate,
      grievance: updatedGrievance ? {
        ...updatedGrievance,
        currentStatus: updatedGrievance.statuses[0]?.status
      } : null
    });
  } catch (error) {
    console.error("Error updating grievance status:", error);
    res.status(500).json({ error: "Failed to update grievance status" });
  }
});

// Get all users
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: Record<string, unknown> = {
      role: 'USER' // Exclude admins from list
    };

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count
    const totalCount = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { [sortBy as string]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { grievances: true }
        }
      }
    });

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      users: users.map((u: any) => ({
        ...u,
        grievanceCount: u._count.grievances
      })),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasMore: pageNum < totalPages
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get single grievance details (admin view)
router.get("/grievances/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params as { id: string };

    const grievance = await prisma.grievance.findUnique({
      where: { id: id as string },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        },
        statuses: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!grievance) {
      return res.status(404).json({ error: "Grievance not found" });
    }

    res.json({
      success: true,
      grievance: {
        ...grievance,
        currentStatus: grievance.statuses[0]?.status || 'SUBMITTED'
      }
    });
  } catch (error) {
    console.error("Error fetching grievance:", error);
    res.status(500).json({ error: "Failed to fetch grievance" });
  }
});

// Delete grievance (soft delete or hard delete)
router.delete("/grievances/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params as { id: string };

    const grievance = await prisma.grievance.findUnique({
      where: { id: id as string }
    });

    if (!grievance) {
      return res.status(404).json({ error: "Grievance not found" });
    }

    // Hard delete (cascade will delete related status history)
    await prisma.grievance.delete({
      where: { id: id as string }
    });

    res.json({
      success: true,
      message: "Grievance deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting grievance:", error);
    res.status(500).json({ error: "Failed to delete grievance" });
  }
});

// Update user role (promote to admin or demote)
router.patch("/users/:id/role", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params as { id: string };
    const { role } = req.body;

    if (!role || !['USER', 'ADMIN'].includes(role.toUpperCase())) {
      return res.status(400).json({ error: "Invalid role. Must be USER or ADMIN" });
    }

    const user = await prisma.user.findUnique({
      where: { id: id as string }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't allow changing own role
    if (req.user && id === req.user.id) {
      return res.status(400).json({ error: "Cannot change your own role" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id as string },
      data: { role: role.toUpperCase() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Failed to update user role" });
  }
});

export default router;
