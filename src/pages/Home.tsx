import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { HardDrive, Rocket, Lightbulb, User, Briefcase, Code, ExternalLink, ArrowRight } from "lucide-react";
import LegoCard from "../components/LegoCard";
import { fetchProjects, fetchProfile } from "../utils/api";
import type { Project, Profile } from "../types/portfolio";

/**
 * 首页组件
 * 展示个人信息、人生进度、最近动态和作品集
 */
export default function Home() {
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile>({
    progress: { percentage: 65, label: '人生进度' },
    activities: ['🛠️ 正在搭建个人乐高主页', '📚 成功战胜了 Tailwind v4 报错']
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projects, profileData] = await Promise.all([
        fetchProjects(),
        fetchProfile(),
      ]);
      setRecentProjects(projects.slice(0, 3));
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  return (
    <div>
      <div className="min-h-screen lego-baseplate p-6 md:p-12 font-mono transition-colors">
        {/* 网盘按钮 */}
        <div className="max-w-6xl mx-auto mb-10 flex justify-end">
          <motion.button 
            onClick={() => navigate('/files')} 
            className="p-4 bg-white border-4 border-black shadow-lego active:shadow-none translate-y-0 active:translate-y-1 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HardDrive />
          </motion.button>
        </div>

        {/* 主要内容网格 */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 个人介绍卡片 */}
          <LegoCard color="bg-white dark:bg-gray-800 dark:text-white" className="md:col-span-2" delay={0.1}>
            <User className="mb-4 w-12 h-12 text-lego-blue" />
            <h2 className="text-3xl font-black mb-2">你好，这里是"陈三合"</h2>
            <p className="dark:text-gray-300">这里展示我的创意作品、人生想法和最近动态。</p>
          </LegoCard>

          {/* 人生进度卡片 */}
          <LegoCard color="bg-lego-red text-white dark:bg-red-800" delay={0.2}>
            <h3 className="font-bold mb-4 flex items-center gap-2"><Rocket size={18} /> {profile.progress.label}</h3>
            <div className="w-full bg-black/20 h-8 border-2 border-black flex mb-2">
              <motion.div 
                className="bg-white h-full" 
                initial={{ width: 0 }}
                animate={{ width: `${profile.progress.percentage}%` }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-right">{profile.progress.percentage}% COMPLETED</p>
          </LegoCard>

          {/* 最近动态卡片 */}
          <LegoCard color="bg-lego-blue text-white dark:bg-blue-900" delay={0.3}>
            <h3 className="font-bold mb-2 flex items-center gap-2"><Lightbulb size={18} /> 最近在干嘛</h3>
            <ul className="text-sm space-y-2">
              {profile.activities.length > 0 ? (
                profile.activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))
              ) : (
                <li>暂无动态</li>
              )}
            </ul>
          </LegoCard>

          {/* 作品集卡片 */}
          <LegoCard color="bg-white dark:bg-gray-800 dark:text-white" className="md:col-span-2" delay={0.4}>
            <h3 className="font-bold mb-4 flex items-center gap-2"><Briefcase size={18} /> 个人作品集</h3>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <Link 
                    key={project.id} 
                    to="/portfolio"
                    className="block border-2 border-black p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <h4 className="font-bold text-sm mb-1">{project.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{project.description}</p>
                    <div className="flex gap-2">
                      {project.links.github && (
                        <span className="text-xs flex items-center gap-1">
                          <Code size={12} /> 代码
                        </span>
                      )}
                      {project.links.live && (
                        <span className="text-xs flex items-center gap-1">
                          <ExternalLink size={12} /> 演示
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
                <Link 
                  to="/portfolio" 
                  className="flex items-center gap-2 text-sm font-bold text-lego-blue hover:underline mt-2"
                >
                  查看全部作品 <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <p className="text-sm dark:text-gray-300">加载中...</p>
            )}
          </LegoCard>
        </div>
      </div>
    </div>
  );
}
