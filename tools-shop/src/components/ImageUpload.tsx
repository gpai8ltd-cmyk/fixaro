'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { resizeImage, type ResizeOptions } from '@/lib/image-resize';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  resizeOptions?: ResizeOptions; // Options for automatic image resizing
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  resizeOptions
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Resize image if resizeOptions are provided
        let fileToUpload = file;
        if (resizeOptions) {
          try {
            fileToUpload = await resizeImage(file, resizeOptions);
          } catch (resizeError) {
            console.error('Resize error:', resizeError);
            // Continue with original file if resize fails
          }
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Грешка при качване');
        }

        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls].slice(0, maxImages);
      onImagesChange(newImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при качване');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];

    // Try to delete from storage (only for blob URLs)
    if (imageUrl.includes('blob.vercel-storage.com')) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: imageUrl }),
        });
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          disabled={isUploading || images.length >= maxImages}
        />
        <label
          htmlFor="image-upload"
          className={`
            flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed rounded-xl
            transition-colors cursor-pointer
            ${isUploading || images.length >= maxImages
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 text-gray-600'
            }
          `}
        >
          {isUploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Качване...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>Качи снимки</span>
              <span className="text-sm text-gray-400">
                (макс. 5MB, JPG/PNG/WebP)
              </span>
            </>
          )}
        </label>
        <p className="text-sm text-gray-500 mt-2">
          {images.length} / {maxImages} снимки. Първата е основна.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              <img
                src={image}
                alt={`Снимка ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100"
                    title="Премести наляво"
                  >
                    ←
                  </button>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  title="Изтрий"
                >
                  <X size={16} />
                </button>

                {/* Move right */}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100"
                    title="Премести надясно"
                  >
                    →
                  </button>
                )}
              </div>

              {/* Main image badge */}
              {index === 0 && (
                <span className="absolute bottom-2 left-2 text-xs bg-[var(--primary)] text-white px-2 py-0.5 rounded">
                  Основна
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !isUploading && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
          <p>Няма качени снимки</p>
        </div>
      )}
    </div>
  );
}
