import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface Testimonial {
  id: string;
  clientName: string;
  clientCompany: string;
  clientPosition: string;
  clientAvatar: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface UseTestimonialsReturn {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTestimonials(): UseTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getTestimonials();
      
      if (response.success) {
        setTestimonials(response.data.testimonials);
      } else {
        setError('Failed to fetch testimonials');
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    error,
    refetch: fetchTestimonials
  };
}
