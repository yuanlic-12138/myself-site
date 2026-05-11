import React from 'react';
import { motion } from 'framer-motion';
interface LegoCardProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  delay?: number;
}
const LegoCard = ({ children, color = "bg-white", className = "", delay = 0 }: LegoCardProps) => (
  <motion.div
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ x: 4, y: 4 }}
    className={`relative ${color} border-4 border-black p-6 shadow-lego active:shadow-lego-active transition-all ${className}`}
  >
    <div className="absolute -top-[14px] left-6 flex gap-2">
      {[1, 2].map(i => (
        <div key={i} className="w-8 h-4 bg-inherit border-x-4 border-t-4 border-black rounded-t-lg" />
      ))}
    </div>
    {children}
  </motion.div>
);
export default LegoCard;