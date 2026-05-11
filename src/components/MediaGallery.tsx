import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaGalleryProps {
  images: string[];
  videos: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function MediaGallery({ images, videos, isOpen, onClose, initialIndex = 0 }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const allMedia = [
    ...images.map(url => ({ type: 'image' as const, url })),
    ...videos.map(url => ({ type: 'video' as const, url })),
  ];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  if (!isOpen || allMedia.length === 0) return null;

  const currentMedia = allMedia[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X size={32} />
        </button>

        {allMedia.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft size={48} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight size={48} />
            </button>
          </>
        )}

        <motion.div
          key={currentIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-4xl max-h-[80vh] mx-4"
          onClick={e => e.stopPropagation()}
        >
          {currentMedia.type === 'image' ? (
            <img
              src={currentMedia.url}
              alt={`Media ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
          ) : (
            <video
              src={currentMedia.url}
              controls
              autoPlay
              className="max-w-full max-h-[80vh]"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </motion.div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {allMedia.map((_, index) => (
            <button
              key={index}
              onClick={e => { e.stopPropagation(); setCurrentIndex(index); }}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-4 right-4 text-white text-sm">
          {currentIndex + 1} / {allMedia.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
