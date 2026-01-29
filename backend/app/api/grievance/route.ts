import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../lib/auth.js';
import {
  saveFormData,
  getFormData,
  clearFormData,
  cacheUserGrievances,
  getCachedUserGrievances,
  invalidateUserGrievancesCache
} from '../../../lib/redis.js';

const router = express.Router();
const prisma = new PrismaClient();

// Generate unique tracking ID
function generateTrackingId() {
  const prefix = "SMPK";
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${randomNum}${timestamp}`;
}

// Submit a new grievance
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { title, description, category, location, latitude, longitude, images, priority } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const userId = req.user.id;

    // Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate unique tracking ID
    let trackingId = generateTrackingId();
    let isUnique = false;
    
    // Ensure tracking ID is unique
    while (!isUnique) {
      const existing = await prisma.grievance.findUnique({
        where: { trackingId }
      });
      if (!existing) {
        isUnique = true;
      } else {
        trackingId = generateTrackingId();
      }
    }

    // Create grievance
    const grievance = await prisma.grievance.create({
      data: {
        trackingId,
        title,
        description,
        category: category.toUpperCase(),
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        images: images || [],
        priority: priority || "MEDIUM",
        userId,
        statuses: {
          create: {
            status: "SUBMITTED",
            comment: "Grievance submitted successfully"
          }
        }
      },
      include: {
        statuses: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    // Clear form cache after successful submission
    await clearFormData(userId);
    
    // Invalidate grievances cache so it fetches fresh data
    await invalidateUserGrievancesCache(userId);

    res.status(201).json({
      success: true,
      trackingId: grievance.trackingId,
      grievance
    });
  } catch (error) {
    console.error("Error submitting grievance:", error);
    res.status(500).json({ error: "Failed to submit grievance" });
  }
});

// Track grievance by tracking ID
router.get("/track/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params;

    const grievance = await prisma.grievance.findUnique({
      where: { trackingId: trackingId.toUpperCase() },
      include: {
        statuses: {
          orderBy: { createdAt: "desc" }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!grievance) {
      return res.status(404).json({ error: "Grievance not found" });
    }

    res.json({
      success: true,
      grievance
    });
  } catch (error) {
    console.error("Error tracking grievance:", error);
    res.status(500).json({ error: "Failed to track grievance" });
  }
});

// Get all grievances for logged-in user
router.get("/my-grievances", verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const userId = req.user.id;

    // Try to get from cache first
    const cachedGrievances = await getCachedUserGrievances(userId);
    
    if (cachedGrievances) {
      return res.json({
        success: true,
        grievances: cachedGrievances,
        cached: true
      });
    }

    // If not in cache, fetch from database
    const grievances = await prisma.grievance.findMany({
      where: { userId },
      include: {
        statuses: {
          orderBy: { createdAt: "desc" },
          take: 1 // Get only the latest status
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Cache the result for 12 hours
    await cacheUserGrievances(userId, grievances);

    res.json({
      success: true,
      grievances,
      cached: false
    });
  } catch (error) {
    console.error("Error fetching grievances:", error);
    res.status(500).json({ error: "Failed to fetch grievances" });
  }
});

// Get single grievance details
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const userId = req.user.id;

    const grievance = await prisma.grievance.findFirst({
      where: {
        id,
        userId // Ensure user can only view their own grievances
      },
      include: {
        statuses: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!grievance) {
      return res.status(404).json({ error: "Grievance not found" });
    }

    res.json({
      success: true,
      grievance
    });
  } catch (error) {
    console.error("Error fetching grievance:", error);
    res.status(500).json({ error: "Failed to fetch grievance" });
  }
});

// Update grievance status (for admin - future use)
router.post("/:id/status", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // Add status update
    const statusUpdate = await prisma.grievanceStatusHistory.create({
      data: {
        grievanceId: id,
        status: status.toUpperCase(),
        comment: comment || null,
        createdBy: req.user.id
      }
    });

    // Get updated grievance
    const grievance = await prisma.grievance.findUnique({
      where: { id },
      include: {
        statuses: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    res.json({
      success: true,
      statusUpdate,
      grievance
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Save form data to cache (auto-save)
router.post("/form/save", verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const userId = req.user.id;
    const formData = req.body;

    await saveFormData(userId, formData);

    res.json({
      success: true,
      message: "Form data saved"
    });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ error: "Failed to save form data" });
  }
});

// Get saved form data from cache
router.get("/form/restore", verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const userId = req.user.id;

    const formData = await getFormData(userId);

    res.json({
      success: true,
      formData
    });
  } catch (error) {
    console.error("Error restoring form data:", error);
    res.status(500).json({ error: "Failed to restore form data" });
  }
});

// Clear saved form data from cache
router.delete("/form/clear", verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const userId = req.user.id;

    await clearFormData(userId);

    res.json({
      success: true,
      message: "Form data cleared"
    });
  } catch (error) {
    console.error("Error clearing form data:", error);
    res.status(500).json({ error: "Failed to clear form data" });
  }
});

export default router;
