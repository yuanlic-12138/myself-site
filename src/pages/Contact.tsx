import { useState, useEffect } from "react";
import LegoCard from "../components/LegoCard";
import { Mail, Code, X } from "lucide-react";
import { fetchContact } from "../utils/api";
import type { Contact as ContactType } from "../types/portfolio";

/**
 * 联系页面组件
 * 展示联系方式
 */
export default function Contact() {
  const [contactData, setContactData] = useState<ContactType>({
    title: "联系我",
    description: "有任何问题或想法？欢迎联系我！",
    contacts: []
  });

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const data = await fetchContact();
      setContactData(data);
    } catch (error) {
      console.error('Failed to load contact:', error);
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Code size={20} />;
      case 'twitter':
        return <X size={20} />;
      case 'email':
        return <Mail size={20} />;
      default:
        return <Mail size={20} />;
    }
  };

  return (
    <div className="min-h-screen lego-baseplate p-6 md:p-12 font-mono">
      <div className="max-w-4xl mx-auto">
        <LegoCard color="bg-white" className="mb-8">
          <Mail className="mb-4 w-12 h-12 text-lego-blue" />
          <h1 className="text-3xl font-black mb-4">{contactData.title}</h1>
          <p>{contactData.description}</p>
        </LegoCard>
        <LegoCard color="bg-blue-50">
          <h2 className="text-xl font-bold mb-4">联系方式</h2>
          <div className="space-y-4">
            {contactData.contacts.map((info, index) => (
              <div key={index} className="flex items-center gap-2">
                {getContactIcon(info.type)}
                <span className="font-bold">{info.label}:</span>
                <span>{info.value}</span>
              </div>
            ))}
            {contactData.contacts.length === 0 && (
              <p className="text-gray-500">暂无联系方式</p>
            )}
          </div>
        </LegoCard>
      </div>
    </div>
  );
}
