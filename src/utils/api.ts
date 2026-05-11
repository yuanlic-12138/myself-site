import type { Project, ProjectFormData, Product, ProductFormData, Profile, Contact, About } from '../types/portfolio';

const STATIC_ERR = '静态模式下不支持此操作，请编辑 JSON 文件后重新部署';

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/data/projects.json');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProject(id: string): Promise<Project> {
  const projects = await fetchProjects();
  const project = projects.find(p => p.id === id);
  if (!project) throw new Error('Project not found');
  return project;
}

export function createProject(_data: ProjectFormData): Promise<Project> {
  return Promise.reject(new Error(STATIC_ERR));
}

export function updateProject(_id: string, _data: Partial<ProjectFormData>): Promise<Project> {
  return Promise.reject(new Error(STATIC_ERR));
}

export function deleteProject(_id: string): Promise<void> {
  return Promise.reject(new Error(STATIC_ERR));
}

export async function fetchTags(): Promise<string[]> {
  const projects = await fetchProjects();
  return [...new Set(projects.flatMap(p => p.tags || []))];
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/data/products.json');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const products = await fetchProducts();
  const product = products.find(p => p.id === id);
  if (!product) throw new Error('Product not found');
  return product;
}

export function createProduct(_data: ProductFormData): Promise<Product> {
  return Promise.reject(new Error(STATIC_ERR));
}

export function updateProduct(_id: string, _data: Partial<ProductFormData>): Promise<Product> {
  return Promise.reject(new Error(STATIC_ERR));
}

export function deleteProduct(_id: string): Promise<void> {
  return Promise.reject(new Error(STATIC_ERR));
}

export async function fetchProductCategories(): Promise<string[]> {
  const products = await fetchProducts();
  return [...new Set(products.map(p => p.category).filter(Boolean))];
}

export async function fetchProductTags(): Promise<string[]> {
  const products = await fetchProducts();
  return [...new Set(products.flatMap(p => p.tags || []))];
}

export function uploadImage(_file: File): Promise<{ url: string; filename: string }> {
  return Promise.reject(new Error(STATIC_ERR));
}

export function uploadVideo(_file: File): Promise<{ url: string; filename: string }> {
  return Promise.reject(new Error(STATIC_ERR));
}

export function deleteMedia(_type: 'images' | 'videos', _filename: string): Promise<void> {
  return Promise.reject(new Error(STATIC_ERR));
}

export interface FileItem {
  filename: string;
  originalname: string;
  url: string;
  size: number;
  createdAt: string;
}

export function uploadFile(_file: File): Promise<FileItem> {
  return Promise.reject(new Error(STATIC_ERR));
}

export async function fetchFiles(): Promise<FileItem[]> {
  return [];
}

export function deleteFile(_filename: string): Promise<void> {
  return Promise.reject(new Error(STATIC_ERR));
}

export async function fetchProfile(): Promise<Profile> {
  const res = await fetch('/data/profile.json');
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export function updateProfile(_data: Partial<Profile>): Promise<Profile> {
  return Promise.reject(new Error(STATIC_ERR));
}

export async function fetchContact(): Promise<Contact> {
  const res = await fetch('/data/contact.json');
  if (!res.ok) throw new Error('Failed to fetch contact');
  return res.json();
}

export function updateContact(_data: Partial<Contact>): Promise<Contact> {
  return Promise.reject(new Error(STATIC_ERR));
}

export async function fetchAbout(): Promise<About> {
  const res = await fetch('/data/about.json');
  if (!res.ok) throw new Error('Failed to fetch about');
  return res.json();
}

export function updateAbout(_data: Partial<About>): Promise<About> {
  return Promise.reject(new Error(STATIC_ERR));
}
