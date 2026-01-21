// Cloudflare Images Upload Configuration (via Backend API)
// Production-ready implementation with backend proxy

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface UploadResult {
  success: boolean;
  url?: string;
  imageId?: string;
  error?: string;
}

/**
 * Upload an image to Cloudflare via backend API
 * @param file - The image file to upload
 * @returns Upload result with URL or error
 */
export async function uploadToCloudflare(file: File): Promise<UploadResult> {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return { success: false, error: 'Image size must be less than 10MB' };
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
 * Upload multiple images to Cloudflare via backend API
 * @param files - Array of image files to upload
 * @returns Array of upload results
 */
export async function uploadMultipleImages(files: File[]): Promise<UploadResult[]> {
  try {
    // Validate all files first
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return [{ success: false, error: `${file.name} is not an image` }];
      }
      if (file.size > 10 * 1024 * 1024) {
        return [{ success: false, error: `${file.name} is larger than 10MB` }];
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
 * Delete an image from Cloudflare via backend API
 * @param imageId - The Cloudflare image ID
 */
export async function deleteFromCloudflare(imageId: string): Promise<boolean> {
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

