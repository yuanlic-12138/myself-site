import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Plus, Edit, Trash, Save, X, Settings, ShoppingBag, Briefcase, User, Activity, Rocket, Mail, Info } from 'lucide-react';
import LegoCard from '../components/LegoCard';
import ImageUpload from '../components/ImageUpload';
import VideoUpload from '../components/VideoUpload';
import TagSelector from '../components/TagSelector';
import type { Project, ProjectFormData, Product, ProductFormData, Profile, Contact, About } from '../types/portfolio';
import {
  fetchProjects, createProject, updateProject, deleteProject,
  fetchProducts, createProduct, updateProduct, deleteProduct,
  fetchProfile, updateProfile,
  fetchContact, updateContact,
  fetchAbout, updateAbout
} from '../utils/api';

const ADMIN_PASSWORD = '88888888';

const emptyProjectForm: ProjectFormData = {
  title: '',
  description: '',
  tech: [],
  tags: [],
  images: [],
  videos: [],
  links: { github: '', live: '', other: [] },
};

const emptyProductForm: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  category: '',
  tags: [],
  images: [],
  videos: [],
  link: '',
  inStock: true,
};

type TabType = 'projects' | 'products' | 'profile' | 'contact' | 'about';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormData>(emptyProjectForm);
  const [techInput, setTechInput] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(emptyProductForm);
  const [showProductForm, setShowProductForm] = useState(false);
  
  const [profile, setProfile] = useState<Profile>({
    progress: { percentage: 65, label: '人生进度' },
    activities: []
  });
  const [profileForm, setProfileForm] = useState<Profile>({
    progress: { percentage: 65, label: '人生进度' },
    activities: []
  });
  const [activityInput, setActivityInput] = useState('');
  
  const [contact, setContact] = useState<Contact>({
    title: '联系我',
    description: '有任何问题或想法？欢迎联系我！',
    contacts: []
  });
  const [contactForm, setContactForm] = useState<Contact>({
    title: '联系我',
    description: '有任何问题或想法？欢迎联系我！',
    contacts: []
  });
  const [contactInput, setContactInput] = useState({ type: '', label: '', value: '' });
  
  const [about, setAbout] = useState<About>({
    title: '关于我',
    introduction: '',
    description: '',
    skills: []
  });
  const [aboutForm, setAboutForm] = useState<About>({
    title: '关于我',
    introduction: '',
    description: '',
    skills: []
  });
  const [skillInput, setSkillInput] = useState({ category: '', items: '' });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, productsData, profileData, contactData, aboutData] = await Promise.all([
        fetchProjects(),
        fetchProducts(),
        fetchProfile(),
        fetchContact(),
        fetchAbout(),
      ]);
      setProjects(projectsData);
      setProducts(productsData);
      setProfile(profileData);
      setProfileForm(profileData);
      setContact(contactData);
      setContactForm(contactData);
      setAbout(aboutData);
      setAboutForm(aboutData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      loadData();
    } else {
      alert('密码错误');
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectForm);
      } else {
        await createProject(projectForm);
      }
      setShowProjectForm(false);
      setEditingProject(null);
      setProjectForm(emptyProjectForm);
      loadData();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
      } else {
        await createProduct(productForm);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm(emptyProductForm);
      loadData();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      tech: project.tech,
      tags: project.tags,
      images: project.images,
      videos: project.videos,
      links: project.links,
    });
    setShowProjectForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      tags: product.tags,
      images: product.images,
      videos: product.videos,
      link: product.link || '',
      inStock: product.inStock,
    });
    setShowProductForm(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('确定要删除这个作品吗？')) return;
    try {
      await deleteProject(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('删除失败');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('确定要删除这个商品吗？')) return;
    try {
      await deleteProduct(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('删除失败');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profileForm);
      setProfile(profileForm);
      alert('保存成功');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = () => {
    if (activityInput.trim() && !profileForm.activities.includes(activityInput.trim())) {
      setProfileForm({
        ...profileForm,
        activities: [...profileForm.activities, activityInput.trim()]
      });
      setActivityInput('');
    }
  };

  const handleRemoveActivity = (index: number) => {
    setProfileForm({
      ...profileForm,
      activities: profileForm.activities.filter((_, i) => i !== index)
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContact(contactForm);
      setContact(contactForm);
      alert('保存成功');
    } catch (error) {
      console.error('Failed to save contact:', error);
      alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    if (contactInput.type && contactInput.label && contactInput.value) {
      setContactForm({
        ...contactForm,
        contacts: [...contactForm.contacts, { ...contactInput }]
      });
      setContactInput({ type: '', label: '', value: '' });
    }
  };

  const handleRemoveContact = (index: number) => {
    setContactForm({
      ...contactForm,
      contacts: contactForm.contacts.filter((_, i) => i !== index)
    });
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAbout(aboutForm);
      setAbout(aboutForm);
      alert('保存成功');
    } catch (error) {
      console.error('Failed to save about:', error);
      alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.category && skillInput.items) {
      setAboutForm({
        ...aboutForm,
        skills: [...aboutForm.skills, { ...skillInput }]
      });
      setSkillInput({ category: '', items: '' });
    }
  };

  const handleRemoveSkill = (index: number) => {
    setAboutForm({
      ...aboutForm,
      skills: aboutForm.skills.filter((_, i) => i !== index)
    });
  };

  const handleAddTech = () => {
    if (techInput.trim() && !projectForm.tech.includes(techInput.trim())) {
      setProjectForm({ ...projectForm, tech: [...projectForm.tech, techInput.trim()] });
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setProjectForm({ ...projectForm, tech: projectForm.tech.filter(t => t !== tech) });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen lego-baseplate p-6 md:p-12 font-mono flex items-center justify-center">
        <LegoCard color="bg-white" className="max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-lego-blue" size={28} />
            <h1 className="text-2xl font-black">管理员登录</h1>
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
            <Settings className="text-lego-blue" size={28} />
            <h1 className="text-3xl font-black">后台管理</h1>
          </div>
          <p className="mt-2">在这里管理你的作品集和橱窗商品</p>
        </LegoCard>

        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-3 border-4 border-black font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-lego-blue text-white shadow-lego'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <Briefcase size={20} /> 作品管理
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 border-4 border-black font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-lego-yellow text-black shadow-lego'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <ShoppingBag size={20} /> 商品管理
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-6 py-3 border-4 border-black font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-lego-green text-white shadow-lego'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <User size={20} /> 个人动态
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-6 py-3 border-4 border-black font-bold transition-all ${
              activeTab === 'contact'
                ? 'bg-lego-red text-white shadow-lego'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <Mail size={20} /> 联系管理
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-6 py-3 border-4 border-black font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-purple-600 text-white shadow-lego'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <Info size={20} /> 关于管理
          </button>
        </div>

        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">作品列表</h2>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setProjectForm(emptyProjectForm);
                  setShowProjectForm(true);
                }}
                className="bg-lego-green text-white px-4 py-3 border-2 border-black shadow-lego hover:shadow-lego-active transition-all flex items-center gap-2"
              >
                <Plus size={18} /> 添加作品
              </button>
            </div>

            {showProjectForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <LegoCard color="bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      {editingProject ? '编辑作品' : '添加新作品'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowProjectForm(false);
                        setEditingProject(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">项目名称 *</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                        required
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">项目描述 *</label>
                      <textarea
                        value={projectForm.description}
                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                        required
                        rows={3}
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">技术栈</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={techInput}
                          onChange={e => setTechInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                          placeholder="输入技术栈后按回车"
                          className="flex-1 p-2 border-2 border-black"
                        />
                        <button
                          type="button"
                          onClick={handleAddTech}
                          className="bg-lego-yellow px-4 border-2 border-black"
                        >
                          添加
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {projectForm.tech.map(t => (
                          <span
                            key={t}
                            className="flex items-center gap-1 bg-gray-200 px-2 py-1 text-sm"
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() => handleRemoveTech(t)}
                              className="text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <TagSelector
                      selectedTags={projectForm.tags}
                      onChange={tags => setProjectForm({ ...projectForm, tags })}
                    />
                    <ImageUpload
                      images={projectForm.images}
                      onChange={images => setProjectForm({ ...projectForm, images })}
                    />
                    <VideoUpload
                      videos={projectForm.videos}
                      onChange={videos => setProjectForm({ ...projectForm, videos })}
                    />
                    <div>
                      <label className="block text-sm font-bold mb-1">链接</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={projectForm.links.github || ''}
                          onChange={e =>
                            setProjectForm({
                              ...projectForm,
                              links: { ...projectForm.links, github: e.target.value },
                            })
                          }
                          placeholder="GitHub 链接"
                          className="w-full p-2 border-2 border-black"
                        />
                        <input
                          type="text"
                          value={projectForm.links.live || ''}
                          onChange={e =>
                            setProjectForm({
                              ...projectForm,
                              links: { ...projectForm.links, live: e.target.value },
                            })
                          }
                          placeholder="演示链接"
                          className="w-full p-2 border-2 border-black"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-lego-green text-white px-6 py-3 border-2 border-black shadow-lego hover:shadow-lego-active transition-all flex items-center gap-2"
                      >
                        <Save size={18} />
                        {loading ? '保存中...' : '保存'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProjectForm(false);
                          setEditingProject(null);
                        }}
                        className="px-6 py-3 border-2 border-black hover:bg-gray-100 transition-all"
                      >
                        取消
                      </button>
                    </div>
                  </form>
                </LegoCard>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LegoCard color={index % 2 === 0 ? 'bg-lego-red text-white' : 'bg-lego-blue text-white'}>
                    {project.images.length > 0 && (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-32 object-cover mb-3 border-2 border-black"
                      />
                    )}
                    <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                    <p className="text-sm mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-black/20 px-2 py-0.5 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        <Edit size={14} /> 编辑
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        <Trash size={14} /> 删除
                      </button>
                    </div>
                  </LegoCard>
                </motion.div>
              ))}
            </div>

            {projects.length === 0 && (
              <LegoCard color="bg-white" className="text-center py-12">
                <p className="text-gray-500 text-lg">还没有作品，点击"添加作品"开始创建吧！</p>
              </LegoCard>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">商品列表</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm(emptyProductForm);
                  setShowProductForm(true);
                }}
                className="bg-lego-yellow text-black px-4 py-3 border-2 border-black shadow-lego hover:shadow-lego-active transition-all flex items-center gap-2"
              >
                <Plus size={18} /> 添加商品
              </button>
            </div>

            {showProductForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <LegoCard color="bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      {editingProduct ? '编辑商品' : '添加新商品'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">商品名称 *</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                        required
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">商品描述 *</label>
                      <textarea
                        value={productForm.description}
                        onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                        required
                        rows={3}
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-1">价格 *</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                          required
                          min="0"
                          step="0.01"
                          className="w-full p-2 border-2 border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">分类</label>
                        <input
                          type="text"
                          value={productForm.category}
                          onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                          placeholder="如：手工艺品、数字产品"
                          className="w-full p-2 border-2 border-black"
                        />
                      </div>
                    </div>
                    <TagSelector
                      selectedTags={productForm.tags}
                      onChange={tags => setProductForm({ ...productForm, tags })}
                    />
                    <ImageUpload
                      images={productForm.images}
                      onChange={images => setProductForm({ ...productForm, images })}
                    />
                    <VideoUpload
                      videos={productForm.videos}
                      onChange={videos => setProductForm({ ...productForm, videos })}
                    />
                    <div>
                      <label className="block text-sm font-bold mb-1">购买链接</label>
                      <input
                        type="text"
                        value={productForm.link || ''}
                        onChange={e => setProductForm({ ...productForm, link: e.target.value })}
                        placeholder="淘宝、微店等链接"
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="inStock"
                        checked={productForm.inStock}
                        onChange={e => setProductForm({ ...productForm, inStock: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <label htmlFor="inStock" className="font-bold">在售</label>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-lego-yellow text-black px-6 py-3 border-2 border-black shadow-lego hover:shadow-lego-active transition-all flex items-center gap-2"
                      >
                        <Save size={18} />
                        {loading ? '保存中...' : '保存'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                        }}
                        className="px-6 py-3 border-2 border-black hover:bg-gray-100 transition-all"
                      >
                        取消
                      </button>
                    </div>
                  </form>
                </LegoCard>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LegoCard color="bg-lego-yellow">
                    {product.images.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-32 object-cover mb-3 border-2 border-black"
                      />
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      {product.inStock ? (
                        <span className="bg-lego-green text-white px-2 py-0.5 text-xs font-bold">在售</span>
                      ) : (
                        <span className="bg-gray-400 text-white px-2 py-0.5 text-xs font-bold">售罄</span>
                      )}
                    </div>
                    <p className="text-lg font-black text-lego-red mb-2">¥{product.price.toFixed(2)}</p>
                    <p className="text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.category && (
                        <span className="bg-lego-blue text-white px-2 py-0.5 text-xs">
                          {product.category}
                        </span>
                      )}
                      {product.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-black/20 px-2 py-0.5 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        <Edit size={14} /> 编辑
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        <Trash size={14} /> 删除
                      </button>
                    </div>
                  </LegoCard>
                </motion.div>
              ))}
            </div>

            {products.length === 0 && (
              <LegoCard color="bg-white" className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">还没有商品，点击"添加商品"开始创建吧！</p>
              </LegoCard>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <LegoCard color="bg-white" className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-lego-green" size={28} />
                <h2 className="text-2xl font-black">个人动态管理</h2>
              </div>
              <p className="text-gray-600 mb-6">管理首页显示的"人生进度"和"最近在干嘛"内容</p>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="border-2 border-black p-4 bg-gray-50">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Rocket size={18} /> 人生进度
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">进度标签</label>
                      <input
                        type="text"
                        value={profileForm.progress.label}
                        onChange={e => setProfileForm({
                          ...profileForm,
                          progress: { ...profileForm.progress, label: e.target.value }
                        })}
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">进度百分比 (0-100)</label>
                      <input
                        type="number"
                        value={profileForm.progress.percentage}
                        onChange={e => setProfileForm({
                          ...profileForm,
                          progress: { ...profileForm.progress, percentage: parseInt(e.target.value) || 0 }
                        })}
                        min="0"
                        max="100"
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 h-6 border-2 border-black flex">
                      <div
                        className="bg-lego-red h-full transition-all"
                        style={{ width: `${profileForm.progress.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-right mt-1">{profileForm.progress.percentage}% COMPLETED</p>
                  </div>
                </div>

                <div className="border-2 border-black p-4 bg-gray-50">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Activity size={18} /> 最近在干嘛
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={activityInput}
                      onChange={e => setActivityInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddActivity())}
                      placeholder="输入动态内容后按回车添加"
                      className="flex-1 p-2 border-2 border-black"
                    />
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="bg-lego-green text-white px-4 border-2 border-black"
                    >
                      添加
                    </button>
                  </div>
                  <div className="space-y-2">
                    {profileForm.activities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white p-2 border-2 border-black">
                        <span className="flex-1">{activity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveActivity(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                    {profileForm.activities.length === 0 && (
                      <p className="text-gray-500 text-sm">暂无动态</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-lego-green text-white px-6 py-3 border-2 border-black shadow-lego hover:shadow-lego-active transition-all flex items-center gap-2"
                  >
                    <Save size={18} />
                    {loading ? '保存中...' : '保存'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileForm(profile)}
                    className="px-6 py-3 border-2 border-black hover:bg-gray-100 transition-all"
                  >
                    重置
                  </button>
                </div>
              </form>
            </LegoCard>
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <LegoCard color="bg-white" className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-lego-red" size={28} />
                <h2 className="text-2xl font-black">联系管理</h2>
              </div>
              <p className="text-gray-600 mb-6">管理联系页面的标题、描述和联系方式</p>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="border-2 border-black p-4 bg-gray-50">
                  <h3 className="font-bold mb-4">基本信息</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">页面标题</label>
                      <input
                        type="text"
                        value={contactForm.title}
                        onChange={e => setContactForm({ ...contactForm, title: e.target.value })}
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">页面描述</label>
                      <textarea
                        value={contactForm.description}
                        onChange={e => setContactForm({ ...contactForm, description: e.target.value })}
                        rows={3}
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-2 border-black p-4 bg-gray-50">
                  <h3 className="font-bold mb-4">联系方式列表</h3>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <input
                      type="text"
                      value={contactInput.type}
                      onChange={e => setContactInput({ ...contactInput, type: e.target.value })}
                      placeholder="类型 (如 github)"
                      className="p-2 border-2 border-black"
                    />
                    <input
                      type="text"
                      value={contactInput.label}
                      onChange={e => setContactInput({ ...contactInput, label: e.target.value })}
                      placeholder="显示名称"
                      className="p-2 border-2 border-black"
                    />
                    <input
                      type="text"
                      value={contactInput.value}
                      onChange={e => setContactInput({ ...contactInput, value: e.target.value })}
                      placeholder="链接或值"
                      className="p-2 border-2 border-black"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="bg-lego-red text-white px-4 py-2 border-2 border-black mb-4"
                  >
                    <Plus size={16} className="inline mr-1" /> 添加联系方式
                  </button>
                  <div className="space-y-2">
                    {contactForm.contacts.map((info, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white p-2 border-2 border-black">
                        <span className="font-bold">{info.type}:</span>
                        <span>{info.label}</span>
                        <span className="text-gray-500 text-sm">({info.value})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(index)}
                          className="text-red-500 hover:text-red-700 ml-auto"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                    {contactForm.contacts.length === 0 && (
                      <p className="text-gray-500 text-sm">暂无联系方式</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-lego-red text-white px-6 py-3 border-2 border-black shadow-lego hover:shadow-lego-active transition-all flex items-center gap-2"
                  >
                    <Save size={18} />
                    {loading ? '保存中...' : '保存'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactForm(contact)}
                    className="px-6 py-3 border-2 border-black hover:bg-gray-100 transition-all"
                  >
                    重置
                  </button>
                </div>
              </form>
            </LegoCard>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <LegoCard color="bg-white" className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="text-purple-600" size={28} />
                <h2 className="text-2xl font-black">关于管理</h2>
              </div>
              <p className="text-gray-600 mb-6">管理关于页面的个人介绍和技能展示</p>

              <form onSubmit={handleAboutSubmit} className="space-y-6">
                <div className="border-2 border-black p-4 bg-gray-50">
                  <h3 className="font-bold mb-4">基本信息</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">页面标题</label>
                      <input
                        type="text"
                        value={aboutForm.title}
                        onChange={e => setAboutForm({ ...aboutForm, title: e.target.value })}
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">个人介绍</label>
                      <textarea
                        value={aboutForm.introduction}
                        onChange={e => setAboutForm({ ...aboutForm, introduction: e.target.value })}
                        rows={2}
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">详细描述</label>
                      <textarea
                        value={aboutForm.description}
                        onChange={e => setAboutForm({ ...aboutForm, description: e.target.value })}
                        rows={3}
                        className="w-full p-2 border-2 border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-2 border-black p-4 bg-gray-50">
                  <h3 className="font-bold mb-4">技能列表</h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <input
                      type="text"
                      value={skillInput.category}
                      onChange={e => setSkillInput({ ...skillInput, category: e.target.value })}
                      placeholder="技能类别"
                      className="p-2 border-2 border-black"
                    />
                    <input
                      type="text"
                      value={skillInput.items}
                      onChange={e => setSkillInput({ ...skillInput, items: e.target.value })}
                      placeholder="技能内容"
                      className="p-2 border-2 border-black"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-purple-600 text-white px-4 py-2 border-2 border-black mb-4"
                  >
                    <Plus size={16} className="inline mr-1" /> 添加技能
                  </button>
                  <div className="space-y-2">
                    {aboutForm.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white p-2 border-2 border-black">
                        <span className="font-bold">{skill.category}:</span>
                        <span>{skill.items}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="text-red-500 hover:text-red-700 ml-auto"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                    {aboutForm.skills.length === 0 && (
                      <p className="text-gray-500 text-sm">暂无技能</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white px-6 py-3 border-2 border-black shadow-lego hover:shadow-lego-active transition-all flex items-center gap-2"
                  >
                    <Save size={18} />
                    {loading ? '保存中...' : '保存'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAboutForm(about)}
                    className="px-6 py-3 border-2 border-black hover:bg-gray-100 transition-all"
                  >
                    重置
                  </button>
                </div>
              </form>
            </LegoCard>
          </div>
        )}
      </div>
    </div>
  );
}
