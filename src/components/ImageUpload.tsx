import { useState, useRef } from 'react';
import { uploadImage } from '../utils/api';
import { ImagePlus, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadImage(files[i]);
        newImages.push(result.url);
      }
      onChange([...images, ...newImages]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('图片上传失败');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-bold mb-2">项目图片</label>
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Project ${index + 1}`}
              className="w-24 h-24 object-cover border-2 border-black"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 bg-lego-red text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 border-2 border-dashed border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          {uploading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <ImagePlus size={24} />
          )}
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />
      <p className="text-xs text-gray-500 mt-1">支持 JPG、PNG、GIF、WebP，最大 10MB</p>
    </div>
  );
}
