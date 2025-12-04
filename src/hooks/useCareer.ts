import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { apiClient } from '@/lib/api'

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary: string;
  applicationDeadline: string;
  postedDate: string;
  status: string;
}

export interface UseCareerReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  handleRetry: () => void;
}

export function useCareer(): UseCareerReturn {
  const { locale } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getJobs({ locale });
      
      if (response.success) {
        setJobs(response.data.jobs);
      } else {
        setError('Failed to load job positions');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job positions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [locale]);

  const handleRetry = () => {
    fetchJobs();
  };

  return {
    jobs,
    loading,
    error,
    handleRetry
  };
}
