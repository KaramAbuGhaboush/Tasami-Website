import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  image?: string;
  readTime: string;
  featured: boolean;
  status: 'draft' | 'published' | 'review';
  views: number;
  tags: string[];
  relatedArticles: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  expertise: string[];
  joinDate: string;
}

export interface UseBlogAdminReturn {
  // Articles
  articles: BlogArticle[];
  articlesLoading: boolean;
  articlesError: string | null;
  
  // Categories
  categories: BlogCategory[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  
  // Authors
  authors: BlogAuthor[];
  authorsLoading: boolean;
  authorsError: string | null;
  
  // Actions
  createArticle: (data: CreateArticleData) => Promise<boolean>;
  updateArticle: (id: string, data: UpdateArticleData) => Promise<boolean>;
  deleteArticle: (id: string) => Promise<boolean>;
  
  createCategory: (data: CreateCategoryData) => Promise<boolean>;
  updateCategory: (id: string, data: UpdateCategoryData) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  createAuthor: (data: CreateAuthorData) => Promise<boolean>;
  updateAuthor: (id: string, data: UpdateAuthorData) => Promise<boolean>;
  deleteAuthor: (id: string) => Promise<{ success: boolean; message?: string }>;
  
  // Refresh functions
  refreshArticles: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshAuthors: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export interface CreateArticleData {
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  readTime?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'review';
  tags?: string[];
  relatedArticles?: string[];
  authorId: string;
  categoryId: string;
}

export interface UpdateArticleData {
  title?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  readTime?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'review';
  tags?: string[];
  relatedArticles?: string[];
  authorId?: string;
  categoryId?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CreateAuthorData {
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  expertise?: string[];
}

export interface UpdateAuthorData {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  expertise?: string[];
}

export function useBlogAdmin(): UseBlogAdminReturn {
  // Articles state
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  
  // Categories state
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  // Authors state
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [authorsError, setAuthorsError] = useState<string | null>(null);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      setArticlesLoading(true);
      setArticlesError(null);
      const response = await apiClient.getBlogArticles();
      
      if (response.success) {
        setArticles(response.data.articles);
      } else {
        setArticlesError('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticlesError('Failed to fetch articles');
    } finally {
      setArticlesLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      const response = await apiClient.getBlogCategories();
      
      if (response.success) {
        setCategories(response.data.categories);
      } else {
        setCategoriesError('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategoriesError('Failed to fetch categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch authors
  const fetchAuthors = async () => {
    try {
      setAuthorsLoading(true);
      setAuthorsError(null);
      const response = await apiClient.getBlogAuthors();
      
      if (response.success) {
        setAuthors(response.data.authors);
      } else {
        setAuthorsError('Failed to fetch authors');
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      setAuthorsError('Failed to fetch authors');
    } finally {
      setAuthorsLoading(false);
    }
  };

  // Article actions
  const createArticle = async (data: CreateArticleData): Promise<boolean> => {
    try {
      const response = await apiClient.createArticle(data);
      if (response.success) {
        await fetchArticles();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating article:', error);
      return false;
    }
  };

  const updateArticle = async (id: string, data: UpdateArticleData): Promise<boolean> => {
    try {
      const response = await apiClient.updateArticle(id, data);
      if (response.success) {
        await fetchArticles();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating article:', error);
      return false;
    }
  };

  const deleteArticle = async (id: string): Promise<boolean> => {
    try {
      const response = await apiClient.deleteArticle(id);
      if (response.success) {
        await fetchArticles();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  };

  // Category actions
  const createCategory = async (data: CreateCategoryData): Promise<boolean> => {
    try {
      const response = await apiClient.createBlogCategory(data);
      if (response.success) {
        await fetchCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating category:', error);
      return false;
    }
  };

  const updateCategory = async (id: string, data: UpdateCategoryData): Promise<boolean> => {
    try {
      const response = await apiClient.updateBlogCategory(id, data);
      if (response.success) {
        await fetchCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const response = await apiClient.deleteBlogCategory(id);
      if (response.success) {
        await fetchCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  };

  // Author actions
  const createAuthor = async (data: CreateAuthorData): Promise<boolean> => {
    try {
      const response = await apiClient.createAuthor(data);
      if (response.success) {
        await fetchAuthors();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating author:', error);
      return false;
    }
  };

  const updateAuthor = async (id: string, data: UpdateAuthorData): Promise<boolean> => {
    try {
      const response = await apiClient.updateAuthor(id, data);
      if (response.success) {
        await fetchAuthors();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating author:', error);
      return false;
    }
  };

  const deleteAuthor = async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.deleteAuthor(id);
      if (response.success) {
        await fetchAuthors();
        return { success: true };
      }
      return { success: false, message: response.message || 'Failed to delete author' };
    } catch (error) {
      console.error('Error deleting author:', error);
      return { success: false, message: 'Failed to delete author' };
    }
  };

  // Refresh functions
  const refreshArticles = async () => {
    await fetchArticles();
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  const refreshAuthors = async () => {
    await fetchAuthors();
  };

  const refreshAll = async () => {
    await Promise.all([fetchArticles(), fetchCategories(), fetchAuthors()]);
  };

  // Initial data fetch
  useEffect(() => {
    refreshAll();
  }, []);

  return {
    // Articles
    articles,
    articlesLoading,
    articlesError,
    
    // Categories
    categories,
    categoriesLoading,
    categoriesError,
    
    // Authors
    authors,
    authorsLoading,
    authorsError,
    
    // Actions
    createArticle,
    updateArticle,
    deleteArticle,
    
    createCategory,
    updateCategory,
    deleteCategory,
    
    createAuthor,
    updateAuthor,
    deleteAuthor,
    
    // Refresh functions
    refreshArticles,
    refreshCategories,
    refreshAuthors,
    refreshAll
  };
}
