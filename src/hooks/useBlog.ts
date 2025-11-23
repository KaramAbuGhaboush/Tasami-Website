import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { apiClient } from '@/lib/api'

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  image: string;
  readTime: string;
  featured: boolean;
  status: string;
  views: number;
  tags: string[];
  createdAt: string;
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
  description: string | null;
  slug: string;
  color: string;
  icon: string | null;
  featured: boolean;
}

export interface UseBlogReturn {
  blogPosts: BlogPost[];
  categories: string[];
  categoryObjects: BlogCategory[];
  loading: boolean;
  error: string | null;
  featuredPost: BlogPost | undefined;
  regularPosts: BlogPost[];
  handleRetry: () => void;
}

export function useBlog(): UseBlogReturn {
  const locale = useLocale() as 'en' | 'ar'
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch featured article, regular articles, and categories in parallel
      const [featuredResponse, articlesResponse, categoriesResponse] = await Promise.all([
        apiClient.getBlogArticles({ locale, featured: true, limit: 1 }),
        apiClient.getBlogArticles({ locale, limit: 10 }),
        apiClient.getBlogCategories(locale)
      ]);

      // Get featured article from the featured response
      const featuredArticle = featuredResponse.success && featuredResponse.data.articles.length > 0
        ? featuredResponse.data.articles[0]
        : null;

      // Get all articles and filter out the featured one to avoid duplicates
      let allArticles: BlogPost[] = [];
      if (articlesResponse.success) {
        allArticles = articlesResponse.data.articles;
        
        // If we have a featured article, remove it from the regular articles list to avoid duplicates
        if (featuredArticle) {
          allArticles = allArticles.filter(post => post.id !== featuredArticle.id);
        }
        
        // Add the featured article at the beginning if it exists
        if (featuredArticle) {
          allArticles = [featuredArticle, ...allArticles];
        }
        
        setBlogPosts(allArticles);
      } else {
        setError('Failed to load blog posts.');
      }

      if (categoriesResponse.success) {
        // Categories will be translated by the backend based on locale
        // The backend returns transformed categories where 'name' field contains the localized name
        const categoryNames = categoriesResponse.data.categories.map((cat: any) => cat.name);
        setCategories(categoryNames);
        
        // Store full category objects for Popular Topics section
        const fullCategories: BlogCategory[] = categoriesResponse.data.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || null,
          slug: cat.slug,
          color: cat.color || '#6812F7',
          icon: cat.icon || '📝',
          featured: cat.featured || false
        }));
        setCategoryObjects(fullCategories);
      } else {
        setError('Failed to load categories.');
      }
    } catch (err) {
      console.error('Error fetching blog data:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const featuredPost = useMemo(() => 
    blogPosts.find(post => post.featured), 
    [blogPosts]
  );
  
  const regularPosts = useMemo(() => 
    blogPosts.filter(post => !post.featured), 
    [blogPosts]
  );

  return {
    blogPosts,
    categories,
    categoryObjects,
    loading,
    error,
    featuredPost,
    regularPosts,
    handleRetry
  };
}
