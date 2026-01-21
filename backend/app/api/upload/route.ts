import express from 'express';
import FormData from 'form-data';

const router = express.Router();

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

// Upload single image to Cloudflare
router.post("/image", async (req, res) => {
  try {
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
      return res.status(500).json({ 
        success: false, 
        error: "Cloudflare credentials not configured" 
      });
    }

    // Check if file exists in request
    if (!req.files || !req.files.file) {
      return res.status(400).json({ 
        success: false, 
        error: "No file uploaded" 
      });
    }

    const file = req.files.file;

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ 
        success: false, 
        error: "File must be an image" 
      });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return res.status(400).json({ 
        success: false, 
        error: "Image size must be less than 10MB" 
      });
    }

    // Upload to Cloudflare using fetch with FormData
    const formData = new FormData();
    formData.append('file', file.data, file.name);

    const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(response.status).json({
        success: false,
        error: data.errors?.[0]?.message || "Failed to upload image to Cloudflare",
      });
    }

    // Return the uploaded image URL
    return res.json({
      success: true,
      url: data.result.variants[0], // First variant URL
      imageId: data.result.id,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to upload image",
    });
  }
});

// Upload multiple images
router.post("/images", async (req, res) => {
  try {
    console.log("📤 Upload request received");
    console.log("Files:", req.files);
    console.log("Cloudflare configured:", !!CLOUDFLARE_ACCOUNT_ID && !!CLOUDFLARE_API_TOKEN);
    
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
      console.error("❌ Cloudflare credentials not configured");
      return res.status(500).json({ 
        success: false, 
        error: "Cloudflare credentials not configured. Please add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to backend .env file" 
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      console.error("❌ No files in request");
      return res.status(400).json({ 
        success: false, 
        error: "No files uploaded" 
      });
    }

    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    console.log(`📁 Processing ${files.length} file(s)`);
    
    const uploadPromises = files.map(async (file) => {
      try {
        // Validate each file
        if (!file.mimetype.startsWith('image/')) {
          console.warn(`⚠️ ${file.name}: Not an image`);
          return { success: false, error: `${file.name}: Not an image` };
        }

        if (file.size > 10 * 1024 * 1024) {
          console.warn(`⚠️ ${file.name}: File too large (${file.size} bytes)`);
          return { success: false, error: `${file.name}: File too large` };
        }

        const formData = new FormData();
        formData.append('file', file.data, file.name);

        const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;
        
        console.log(`⬆️ Uploading ${file.name} to Cloudflare...`);
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            ...formData.getHeaders(),
          },
          body: formData,
        });

        const data = await response.json();
        console.log(`📥 Cloudflare response for ${file.name}:`, data);

        if (!response.ok || !data.success) {
          console.error(`❌ Upload failed for ${file.name}:`, data.errors);
          return {
            success: false,
            error: data.errors?.[0]?.message || "Upload failed",
          };
        }

        console.log(`✅ ${file.name} uploaded successfully`);
        return {
          success: true,
          url: data.result.variants[0],
          imageId: data.result.id,
        };
      } catch (error) {
        console.error(`❌ Error uploading ${file.name}:`, error);
        return { success: false, error: `${file.name}: Upload failed` };
      }
    });

    const results = await Promise.all(uploadPromises);
    console.log("✅ All uploads processed:", results);
    
    return res.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error("❌ Multiple upload error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to upload images: " + error.message,
    });
  }
});

export default router;
