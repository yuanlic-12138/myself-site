import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, HardDrive, Upload, Trash, Download, FileText, Image, Video, Music, Archive, File, Loader2 } from 'lucide-react';
import LegoCard from '../components/LegoCard';
import { uploadFile, fetchFiles, deleteFile } from '../utils/api';
import type { FileItem } from '../utils/api';

const ADMIN_PASSWORD = '88888888';

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return <Image size={20} />;
  if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext)) return <Video size={20} />;
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext)) return <Music size={20} />;
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <Archive size={20} />;
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) return <FileText size={20} />;
  return <File size={20} />;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

export default function Files() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadFiles();
    } else {
      setLoading(false);
    }
  }, []);

  const loadFiles = async () => {
    try {
      const data = await fetchFiles();
      setFiles(data);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      loadFiles();
    } else {
      alert('密码错误');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < selected.length; i++) {
        await uploadFile(selected[i]);
      }
      await loadFiles();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('上传失败');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('确定要删除这个文件吗？')) return;
    try {
      await deleteFile(filename);
      await loadFiles();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('删除失败');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen lego-baseplate p-6 md:p-12 font-mono flex items-center justify-center">
        <LegoCard color="bg-white" className="max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-lego-blue" size={28} />
            <h1 className="text-2xl font-black">文件管理</h1>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入管理员密码"
              className="w-full p-3 border-2 border-black mb-4"
            />
            <button
              type="submit"
              className="w-full bg-lego-blue text-white p-3 border-2 border-black shadow-lego hover:shadow-lego-active transition-all"
            >
              登录
            </button>
          </form>
        </LegoCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen lego-baseplate p-6 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        <LegoCard color="bg-white" className="mb-8">
          <div className="flex items-center gap-3">
            <HardDrive className="text-lego-blue" size={28} />
            <h1 className="text-3xl font-black">文件管理</h1>
          </div>
          <p className="mt-2">上传和管理你的文件</p>
        </LegoCard>

        <LegoCard color="bg-white" className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">上传文件</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-lego-green text-white px-6 py-3 border-2 border-black shadow-lego hover:shadow-lego-active transition-all flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> 上传中...
                </>
              ) : (
                <>
                  <Upload size={18} /> 选择文件
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">支持任意类型文件，最大 50MB，可多选</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </LegoCard>

        {loading ? (
          <LegoCard color="bg-white" className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p>加载中...</p>
          </LegoCard>
        ) : files.length === 0 ? (
          <LegoCard color="bg-white" className="text-center py-12">
            <HardDrive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">还没有文件</p>
          </LegoCard>
        ) : (
          <div className="space-y-3">
            {files.map((file, index) => (
              <motion.div
                key={file.filename}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <LegoCard color="bg-white">
                  <div className="flex items-center gap-4">
                    <div className="text-lego-blue">{getFileIcon(file.filename)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{file.originalname}</p>
                      <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={file.url}
                        download={file.originalname}
                        className="p-2 border-2 border-black hover:bg-gray-100 transition-colors"
                        title="下载"
                      >
                        <Download size={18} />
                      </a>
                      <button
                        onClick={() => handleDelete(file.filename)}
                        className="p-2 border-2 border-black hover:bg-red-100 transition-colors text-lego-red"
                        title="删除"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </LegoCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
