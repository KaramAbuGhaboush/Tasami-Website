import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  results: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  quote: string;
  rating: number;
}

export const useWorkData = () => {
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.getProjects();
        if (response.success) {
          setProjects(response.data.projects);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch testimonials data
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiClient.getTestimonials();
        if (response.success) {
          setTestimonials(response.data.testimonials);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    };
    fetchTestimonials();
  }, []);

  // Get unique categories from projects
  const categories = ["All", ...Array.from(new Set(projects.map(project => project.category).filter(Boolean)))];

  // Filter projects by selected category
  const filteredProjects = projects.filter(project => 
    selectedCategory === "All" || project.category === selectedCategory
  );

  return {
    // Data
    projects: filteredProjects,
    testimonials,
    categories,
    loading,
    selectedCategory,
    
    // Actions
    setSelectedCategory,
  };
};
