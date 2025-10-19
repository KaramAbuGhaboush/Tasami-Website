import { useState, useEffect } from 'react'
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

export interface UseBlogReturn {
  blogPosts: BlogPost[];
  categories: string[];
  loading: boolean;
  error: string | null;
  featuredPost: BlogPost | undefined;
  regularPosts: BlogPost[];
  handleRetry: () => void;
}

export function useBlog(): UseBlogReturn {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [articlesResponse, categoriesResponse] = await Promise.all([
        apiClient.getBlogArticles(),
        apiClient.getBlogCategories()
      ]);

      if (articlesResponse.success) {
        setBlogPosts(articlesResponse.data.articles);
      }

      if (categoriesResponse.success) {
        const categoryNames = ["All", ...categoriesResponse.data.categories.map((cat: any) => cat.name)];
        setCategories(categoryNames);
      }
    } catch (err) {
      console.error('Error fetching blog data:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    fetchData();
  };

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return {
    blogPosts,
    categories,
    loading,
    error,
    featuredPost,
    regularPosts,
    handleRetry
  };
}
