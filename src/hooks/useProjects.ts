import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  status: string;
  technologies: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  results: Array<{
    id: string;
    metric: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProjects(category?: string): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getProjects({ category });
      
      if (response.success) {
        // Transform projects to extract category name from category object and map headerImage to image
        const transformedProjects = response.data.projects.map((project: any) => ({
          ...project,
          image: project.headerImage || project.image || '/api/placeholder/400/300',
          category: project.category?.name || project.category || 'Uncategorized'
        }));
        setProjects(transformedProjects);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects
  };
}
