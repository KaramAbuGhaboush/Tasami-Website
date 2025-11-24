import { notFound } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { apiClient } from '@/lib/api'

export interface Technology {
  name: string;
  description: string;
}

export interface Result {
  metric: string;
  description: string;
}

export interface ClientTestimonial {
  quote: string;
  author: string;
  position: string;
}

export interface ContentBlock {
  id: string;
  type: 'paragraph' | 'image' | 'imageGrid' | 'heading';
  order: number;
  content?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  level?: 2 | 3 | 4;
  columns?: 2 | 3 | 4;
  images?: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    caption?: string;
  }>;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  headerImage: string;
  description: string;
  challenge: string;
  solution: string;
  technologies: Technology[];
  results: Result[];
  timeline: string;
  teamSize: string;
  clientTestimonial: ClientTestimonial | null;
  // Additional fields for case study format
  company?: string;
  services?: string[];
  contentBlocks?: ContentBlock[];
  projectBreakdown?: {
    userResearch?: {
      title: string;
      description: string;
      image: string;
    };
    uiDesign?: {
      title: string;
      description: string;
      image: string;
    };
    development?: {
      title: string;
      description: string;
      image: string;
    };
    testing?: {
      title: string;
      description: string;
      image: string;
    };
  };
}


export interface UseProjectReturn {
  project: Project | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useProject(projectId: string): UseProjectReturn {
  const locale = useLocale() as 'en' | 'ar';
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getProject(projectId, locale);
      
      if (response.success) {
        // Transform API response to match our Project interface
        const transformedProject: Project = {
          id: response.data.project.id,
          title: response.data.project.title,
          category: response.data.project.category?.name || response.data.project.category || 'Uncategorized',
          headerImage: response.data.project.headerImage,
          description: response.data.project.description,
          challenge: response.data.project.challenge || '',
          solution: response.data.project.solution || '',
          technologies: response.data.project.technologies || [],
          results: response.data.project.results || [],
          timeline: response.data.project.timeline || '',
          teamSize: response.data.project.teamSize || '',
          company: response.data.project.category?.name || response.data.project.category || 'Uncategorized', // Use category name as company
          services: response.data.project.technologies?.map((tech: any) => tech.name) || [],
          contentBlocks: response.data.project.contentBlocks || [],
          clientTestimonial: response.data.project.clientTestimonial || null
        };
        
        setProject(transformedProject);
      } else {
        setError('Failed to fetch project');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [projectId, locale]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    refresh: fetchProject
  };
}
