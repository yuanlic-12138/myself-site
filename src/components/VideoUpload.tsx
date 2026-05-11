import { useState, useRef } from 'react';
import { uploadVideo } from '../utils/api';
import { Video, X, Loader2 } from 'lucide-react';

interface VideoUploadProps {
  videos: string[];
  onChange: (videos: string[]) => void;
}

export default function VideoUpload({ videos, onChange }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newVideos: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadVideo(files[i]);
        newVideos.push(result.url);
      }
      onChange([...videos, ...newVideos]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('视频上传失败');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    onChange(newVideos);
  };

  return (
    <div>
      <label className="block text-sm font-bold mb-2">项目视频</label>
      <div className="space-y-2">
        {videos.map((video, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border-2 border-black">
            <Video size={20} />
            <span className="flex-1 text-sm truncate">{video.split('/').pop()}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-lego-red hover:bg-red-100 p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full p-3 border-2 border-dashed border-black flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>上传中...</span>
            </>
          ) : (
            <>
              <Video size={20} />
              <span>添加视频</span>
            </>
          )}
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />
      <p className="text-xs text-gray-500 mt-1">支持 MP4、WebM、OGG、MOV，最大 100MB</p>
    </div>
  );
}
