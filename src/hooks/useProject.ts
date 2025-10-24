import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

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
}

export function useProject(projectId: string): UseProjectReturn {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3002/api/projects/${projectId}`);
        const data = await response.json();
        
        if (data.success) {
          // Transform API response to match our Project interface
          const transformedProject: Project = {
            id: data.data.project.id,
            title: data.data.project.title,
            category: data.data.project.category?.name || data.data.project.category || 'Uncategorized',
            headerImage: data.data.project.headerImage,
            description: data.data.project.description,
            challenge: data.data.project.challenge || '',
            solution: data.data.project.solution || '',
            technologies: data.data.project.technologies || [],
            results: data.data.project.results || [],
            timeline: data.data.project.timeline || '',
            teamSize: data.data.project.teamSize || '',
            company: data.data.project.category?.name || data.data.project.category || 'Uncategorized', // Use category name as company
            services: data.data.project.technologies?.map((tech: any) => tech.name) || [],
            contentBlocks: data.data.project.contentBlocks || [],
            clientTestimonial: data.data.project.clientTestimonial || null
          };
          
          setProject(transformedProject);
        } else {
          setError(data.message || 'Failed to fetch project');
        }
      } catch (err) {
        setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return {
    project,
    loading,
    error
  };
}
