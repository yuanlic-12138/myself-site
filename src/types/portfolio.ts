export interface ProjectLink {
  github?: string;
  live?: string;
  other?: { label: string; url: string }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  tags: string[];
  images: string[];
  videos: string[];
  links: ProjectLink;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  tech: string[];
  tags: string[];
  images: string[];
  videos: string[];
  links: ProjectLink;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  images: string[];
  videos: string[];
  link?: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  images: string[];
  videos: string[];
  link?: string;
  inStock: boolean;
}

export interface ProfileProgress {
  percentage: number;
  label: string;
}

export interface Profile {
  progress: ProfileProgress;
  activities: string[];
}

export interface ContactInfo {
  type: string;
  label: string;
  value: string;
}

export interface Contact {
  title: string;
  description: string;
  contacts: ContactInfo[];
}

export interface Skill {
  category: string;
  items: string;
}

export interface About {
  title: string;
  introduction: string;
  description: string;
  skills: Skill[];
}
