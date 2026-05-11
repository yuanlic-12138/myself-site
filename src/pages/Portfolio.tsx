import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, ExternalLink, Filter, Tag } from 'lucide-react';
import LegoCard from '../components/LegoCard';
import MediaGallery from '../components/MediaGallery';
import type { Project } from '../types/portfolio';
import { fetchProjects, fetchTags } from '../utils/api';

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, tagsData] = await Promise.all([
        fetchProjects(),
        fetchTags(),
      ]);
      setProjects(projectsData);
      setAllTags(tagsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedTag
    ? projects.filter(p => p.tags.includes(selectedTag))
    : projects;

  const openGallery = (project: Project) => {
    if (project.images.length > 0 || project.videos.length > 0) {
      setGalleryProject(project);
      setGalleryOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen lego-baseplate p-6 md:p-12 font-mono flex items-center justify-center">
        <LegoCard color="bg-white">
          <p className="text-xl">加载中...</p>
        </LegoCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen lego-baseplate p-6 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto">
        <LegoCard color="bg-white" className="mb-8">
          <Briefcase className="mb-4 w-12 h-12 text-lego-blue" />
          <h1 className="text-3xl font-black mb-4">个人作品集</h1>
          <p>这里展示我做过的一些项目。</p>
        </LegoCard>

        {allTags.length > 0 && (
          <LegoCard color="bg-white" className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={18} />
              <span className="font-bold">按标签筛选</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 border-2 border-black text-sm transition-all ${
                  selectedTag === null
                    ? 'bg-lego-blue text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                全部
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 border-2 border-black text-sm transition-all flex items-center gap-1 ${
                    selectedTag === tag
                      ? 'bg-lego-blue text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <Tag size={12} />
                  {tag}
                </button>
              ))}
            </div>
          </LegoCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LegoCard
                color={index % 3 === 0 ? 'bg-lego-red text-white' : index % 3 === 1 ? 'bg-lego-blue text-white' : 'bg-lego-yellow'}
                className="h-full flex flex-col"
              >
                {project.images.length > 0 && (
                  <div
                    className="cursor-pointer mb-3"
                    onClick={() => openGallery(project)}
                  >
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-40 object-cover border-2 border-black hover:opacity-90 transition-opacity"
                    />
                    {(project.images.length > 1 || project.videos.length > 0) && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs">
                        {project.images.length + project.videos.length} 个媒体
                      </div>
                    )}
                  </div>
                )}
                <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                <p className="text-sm mb-4 flex-grow">{project.description}</p>
                
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-black/20 px-2 py-0.5 text-xs cursor-pointer hover:bg-black/30"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map(tech => (
                    <span key={tech} className="bg-black/20 px-2 py-1 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-auto">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <Code size={16} /> 代码
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink size={16} /> 演示
                    </a>
                  )}
                  {(project.images.length > 0 || project.videos.length > 0) && (
                    <button
                      onClick={() => openGallery(project)}
                      className="flex items-center gap-1 hover:underline ml-auto"
                    >
                      查看媒体
                    </button>
                  )}
                </div>
              </LegoCard>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <LegoCard color="bg-white" className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedTag ? `没有标签为"${selectedTag}"的作品` : '还没有作品'}
            </p>
          </LegoCard>
        )}
      </div>

      {galleryProject && (
        <MediaGallery
          images={galleryProject.images}
          videos={galleryProject.videos}
          isOpen={galleryOpen}
          onClose={() => {
            setGalleryOpen(false);
            setGalleryProject(null);
          }}
        />
      )}
    </div>
  );
}
