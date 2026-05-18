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

// Generate unique tracking ID with better randomness
function generateTrackingId() {
  const prefix = "SMPK";
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${randomNum}${timestamp}${random}`;
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

    // Validate field lengths
    if (title.length > 200) {
      return res.status(400).json({ error: "Title must be less than 200 characters" });
    }
    if (description.length > 2000) {
      return res.status(400).json({ error: "Description must be less than 2000 characters" });
    }
    if (location.length > 500) {
      return res.status(400).json({ error: "Location must be less than 500 characters" });
    }

    // Validate category
    const validCategories = ['POTHOLES', 'WASTE', 'WATER', 'ELECTRICITY', 'DRAINAGE', 'OTHER'];
    if (!validCategories.includes(category.toUpperCase())) {
      return res.status(400).json({ error: "Invalid category" });
    }

    // Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    const normalizedPriority = priority ? priority.toUpperCase() : 'MEDIUM';
    if (!validPriorities.includes(normalizedPriority)) {
      return res.status(400).json({ error: "Invalid priority. Must be LOW, MEDIUM, or HIGH" });
    }

    // Validate coordinates if provided
    if (latitude !== undefined && latitude !== null) {
      const lat = parseFloat(latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({ error: "Invalid latitude" });
      }
    }
    if (longitude !== undefined && longitude !== null) {
      const lon = parseFloat(longitude);
      if (isNaN(lon) || lon < -180 || lon > 180) {
        return res.status(400).json({ error: "Invalid longitude" });
      }
    }

    // Validate images array
    if (images && (!Array.isArray(images) || images.length > 5)) {
      return res.status(400).json({ error: "Maximum 5 images allowed" });
    }

    // Generate unique tracking ID with retry limit to prevent infinite loop
    let trackingId = generateTrackingId();
    let attempts = 0;
    const maxAttempts = 5;
    
    // Ensure tracking ID is unique with bounded retries
    while (attempts < maxAttempts) {
      try {
        const existing = await prisma.grievance.findUnique({
          where: { trackingId }
        });
        if (!existing) {
          break;
        }
        trackingId = generateTrackingId();
        attempts++;
      } catch (error) {
        console.error("Error checking tracking ID uniqueness:", error);
        return res.status(500).json({ error: "Failed to generate tracking ID" });
      }
    }

    if (attempts >= maxAttempts) {
      return res.status(500).json({ error: "Failed to generate unique tracking ID. Please try again." });
    }

    // Create grievance
    const grievance = await prisma.grievance.create({
      data: {
        trackingId,
        title: title.trim(),
        description: description.trim(),
        category: category.toUpperCase(),
        location: location.trim(),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        images: images || [],
        priority: normalizedPriority,
        userId,
        statuses: {
          create: {
            status: "SUBMITTED",
            comment: "Grievance submitted successfully",
            createdBy: userId
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
    const id = req.params.id as string;
    
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
    const id = req.params.id as string;
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
