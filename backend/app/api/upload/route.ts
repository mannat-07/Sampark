import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { UploadedFile } from 'express-fileupload';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to convert buffer to stream
const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Upload single image to Cloudinary
router.post("/image", async (req, res) => {
  try {
    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("❌ Cloudinary credentials missing");
      return res.status(500).json({ 
        success: false, 
        error: "Cloudinary not configured. Please add credentials to .env file" 
      });
    }

    // Check if file exists in request
    if (!req.files || !req.files.file) {
      return res.status(400).json({ 
        success: false, 
        error: "No file uploaded" 
      });
    }

    const file = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file as UploadedFile;
    console.log(`📤 Uploading image: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

    // Validate file type (support common image formats)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed" 
      });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return res.status(400).json({ 
        success: false, 
        error: `Image size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds 10MB limit` 
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise<{secure_url: string; public_id: string}>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sampark-grievances',
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' } // Optimize images
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as {secure_url: string; public_id: string});
        }
      );

      bufferToStream(file.data).pipe(uploadStream);
    });

    console.log(`✅ Image uploaded successfully to Cloudinary`);

    // Return the uploaded image URL
    return res.json({
      success: true,
      url: uploadResult.secure_url,
      imageId: uploadResult.public_id,
      filename: file.name,
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
    
    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("❌ Cloudinary credentials not configured");
      return res.status(500).json({ 
        success: false, 
        error: "Cloudinary not configured. Please add credentials to .env file" 
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
    
    // Limit number of files (max 5 images per upload)
    if (files.length > 5) {
      return res.status(400).json({
        success: false,
        error: "Maximum 5 images can be uploaded at once"
      });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    const uploadPromises = files.map(async (file: UploadedFile) => {
      try {
        // Validate each file
        if (!allowedTypes.includes(file.mimetype)) {
          console.warn(`⚠️ ${file.name}: Invalid type (${file.mimetype})`);
          return { success: false, error: `${file.name}: Invalid file type` };
        }

        if (file.size > 10 * 1024 * 1024) {
          console.warn(`⚠️ ${file.name}: File too large (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
          return { success: false, error: `${file.name}: Exceeds 10MB limit` };
        }

        console.log(`📤 Uploading ${file.name} to Cloudinary...`);
        
        // Upload to Cloudinary
        const uploadResult = await new Promise<{secure_url: string; public_id: string}>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'sampark-grievances',
              resource_type: 'image',
              transformation: [
                { quality: 'auto', fetch_format: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as {secure_url: string; public_id: string});
            }
          );

          bufferToStream(file.data).pipe(uploadStream);
        });

        console.log(`✅ ${file.name} uploaded successfully`);
        return {
          success: true,
          url: uploadResult.secure_url,
          imageId: uploadResult.public_id,
          filename: file.name,
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
      error: "Failed to upload images: " + (error instanceof Error ? error.message : 'Unknown error'),
    });
  }
});

export default router;
