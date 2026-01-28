const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface UploadResult {
  success: boolean;
  url?: string;
  imageId?: string;
  error?: string;
}

/**
 * Upload an image to Cloudinary via backend API
 * @param file - The image file to upload
 * @returns Upload result with URL or error
 */
export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { 
        success: false, 
        error: `Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed` 
      };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      return { 
        success: false, 
        error: `Image size (${sizeMB} MB) exceeds 10MB limit` 
      };
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Upload via backend API
    const response = await fetch(`${API_URL}/api/upload/image`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to upload image',
      };
    }

    // Return the uploaded image URL
    return {
      success: true,
      url: data.url,
      imageId: data.imageId,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: 'Failed to upload image. Please try again.',
    };
  }
}

/**
 * Upload multiple images to Cloudinary via backend API
 * @param files - Array of image files to upload
 * @returns Array of upload results
 */
export async function uploadMultipleImages(files: File[]): Promise<UploadResult[]> {
  try {
    // Limit number of files
    if (files.length > 5) {
      return [{ success: false, error: 'Maximum 5 images can be uploaded at once' }];
    }

    // Validate all files first
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return [{ success: false, error: `${file.name}: Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed` }];
      }
      if (file.size > 10 * 1024 * 1024) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        return [{ success: false, error: `${file.name}: Size (${sizeMB} MB) exceeds 10MB limit` }];
      }
    }

    // Create form data with multiple files
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Upload via backend API
    const response = await fetch(`${API_URL}/api/upload/images`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return [{ success: false, error: data.error || 'Failed to upload images' }];
    }

    return data.results;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return [{ success: false, error: 'Failed to upload images. Please try again.' }];
  }
}

/**
 * Delete an image from Cloudinary via backend API
 * @param imageId - The Cloudinary image ID (public_id)
 */
export async function deleteFromCloudinary(imageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/upload/image/${imageId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

