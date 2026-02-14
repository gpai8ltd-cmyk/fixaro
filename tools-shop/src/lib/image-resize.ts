/**
 * Resize image on client-side using Canvas API
 * This reduces file size before upload for better performance
 */

export interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1, for JPEG/WebP
}

/**
 * Resize an image file to specified dimensions
 * @param file - The image file to resize
 * @param options - Resize options (maxWidth, maxHeight, quality)
 * @returns Promise<File> - Resized image as File object
 */
export async function resizeImage(
  file: File,
  options: ResizeOptions = {}
): Promise<File> {
  const {
    maxWidth = 1200,
    maxHeight = 900,
    quality = 0.85,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        // Only resize if image is larger than max dimensions
        if (width <= maxWidth && height <= maxHeight) {
          // Image is already small enough, return original
          resolve(file);
          return;
        }

        // Calculate aspect ratio
        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Use better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob from canvas'));
              return;
            }

            // Create new File object from blob
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(resizedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Resize multiple images in parallel
 * @param files - Array of image files to resize
 * @param options - Resize options
 * @returns Promise<File[]> - Array of resized images
 */
export async function resizeImages(
  files: File[],
  options: ResizeOptions = {}
): Promise<File[]> {
  return Promise.all(files.map((file) => resizeImage(file, options)));
}
