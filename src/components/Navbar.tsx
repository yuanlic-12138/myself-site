import { Link } from "react-router-dom";
import { BrickWall, User, Briefcase, Mail, ShoppingBag } from "lucide-react";

/**
 * 导航栏组件
 * 乐高风格的顶部导航栏，包含页面链接
 */
export default function Navbar() {
  return (
    <nav className="bg-lego-yellow border-b-4 border-black p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* 网站标题 */}
        <Link to="/" className="flex items-center gap-2 font-black text-xl">
          <BrickWall /> MY LEGO HUB
        </Link>
        
        {/* 导航链接 */}
        <div className="flex gap-4">
          <Link to="/" className="flex items-center gap-1 hover:text-lego-blue transition-colors">
            <User size={18} /> 首页
          </Link>
          <Link to="/about" className="flex items-center gap-1 hover:text-lego-blue transition-colors">
            <User size={18} /> 关于
          </Link>
          <Link to="/portfolio" className="flex items-center gap-1 hover:text-lego-blue transition-colors">
            <Briefcase size={18} /> 作品集
          </Link>
          <Link to="/contact" className="flex items-center gap-1 hover:text-lego-blue transition-colors">
            <Mail size={18} /> 联系
          </Link>
          <Link to="/showcase" className="flex items-center gap-1 hover:text-lego-blue transition-colors">
            <ShoppingBag size={18} /> 橱窗
          </Link>
        </div>
      </div>
    </nav>
  );
}
