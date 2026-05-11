import { useState, useEffect } from "react";
import LegoCard from "../components/LegoCard";
import { User } from "lucide-react";
import { fetchAbout } from "../utils/api";
import type { About as AboutType } from "../types/portfolio";

/**
 * 关于页面组件
 * 展示个人介绍和技能
 */
export default function About() {
  const [aboutData, setAboutData] = useState<AboutType>({
    title: "关于我",
    introduction: "这里是陈三合，一个热爱创意和技术的人。",
    description: "我喜欢用乐高积木的方式思考问题，把复杂的事情分解成简单的模块，然后重新组合成更有趣的东西。",
    skills: [
      { category: "前端开发", items: "React, TypeScript, Tailwind CSS" },
      { category: "创意设计", items: "UI/UX, 动效设计" }
    ]
  });

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await fetchAbout();
      setAboutData(data);
    } catch (error) {
      console.error('Failed to load about:', error);
    }
  };

  return (
    <div className="min-h-screen lego-baseplate p-6 md:p-12 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* 个人介绍卡片 */}
        <LegoCard color="bg-white" className="mb-8">
          <User className="mb-4 w-12 h-12 text-lego-blue" />
          <h1 className="text-3xl font-black mb-4">{aboutData.title}</h1>
          <p className="text-lg mb-4">{aboutData.introduction}</p>
          <p>{aboutData.description}</p>
        </LegoCard>
        
        {/* 技能卡片 */}
        <LegoCard color="bg-lego-blue text-white">
          <h2 className="text-xl font-bold mb-4">我的技能</h2>
          <div className="grid grid-cols-2 gap-4">
            {aboutData.skills.map((skill, index) => (
              <div key={index}>
                <h3 className="font-bold mb-2">{skill.category}</h3>
                <p className="text-sm">{skill.items}</p>
              </div>
            ))}
            {aboutData.skills.length === 0 && (
              <p className="text-sm">暂无技能信息</p>
            )}
          </div>
        </LegoCard>
      </div>
    </div>
  );
}
