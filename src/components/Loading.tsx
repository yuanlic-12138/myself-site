import { motion } from "framer-motion";

/**
 * 加载动画组件
 * 乐高风格的加载动画
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen lego-baseplate">
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-8 h-8 bg-lego-yellow border-2 border-black rounded-lg"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
