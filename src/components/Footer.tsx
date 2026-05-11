import { BrickWall, Heart } from "lucide-react";

/**
 * 页脚组件
 * 乐高风格的页脚
 */
export default function Footer() {
  return (
    <footer className="bg-lego-yellow border-t-4 border-black p-6 mt-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BrickWall size={20} />
          <span className="font-bold">MY LEGO HUB</span>
        </div>
        <p className="text-sm">
          用 <Heart size={14} className="inline text-lego-red" /> 和乐高积木搭建
        </p>
        <p className="text-xs mt-2 opacity-75">
          © {new Date().getFullYear()} 陈三合. 保留所有权利.
        </p>
      </div>
    </footer>
  );
}
