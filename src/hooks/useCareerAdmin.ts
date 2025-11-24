import { useState, useEffect } from 'react'
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
  salary?: string;
  applicationDeadline?: string;
  postedDate: string;
  status: string;
  applications: number;
  team?: string;
}

export interface CreateJobData {
  title: string;
  titleAr?: string;
  department: string;
  departmentAr?: string;
  location: string;
  locationAr?: string;
  type: string;
  typeAr?: string;
  experience: string;
  experienceAr?: string;
  description: string;
  descriptionAr?: string;
  requirements: string[];
  requirementsAr?: string[];
  benefits: string[];
  benefitsAr?: string[];
  salary?: string;
  salaryAr?: string;
  applicationDeadline?: string;
  status?: string;
  team?: string;
  teamAr?: string;
}

export interface UpdateJobData {
  title?: string;
  titleAr?: string;
  department?: string;
  departmentAr?: string;
  location?: string;
  locationAr?: string;
  type?: string;
  typeAr?: string;
  experience?: string;
  experienceAr?: string;
  description?: string;
  descriptionAr?: string;
  requirements?: string[];
  requirementsAr?: string[];
  benefits?: string[];
  benefitsAr?: string[];
  salary?: string;
  salaryAr?: string;
  applicationDeadline?: string;
  status?: string;
  team?: string;
  teamAr?: string;
}

export interface UseCareerAdminReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  fetchJobs: (params?: {
    page?: number;
    limit?: number;
    department?: string;
    location?: string;
    type?: string;
  }) => Promise<void>;
  createJob: (jobData: CreateJobData) => Promise<{ success: boolean; job?: Job; error?: string }>;
  updateJob: (id: string, jobData: UpdateJobData) => Promise<{ success: boolean; job?: Job; error?: string }>;
  deleteJob: (id: string) => Promise<{ success: boolean; error?: string }>;
  getJob: (id: string) => Promise<{ success: boolean; job?: Job; error?: string }>;
  clearError: () => void;
}

export function useCareerAdmin(): UseCareerAdminReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async (params?: {
    page?: number;
    limit?: number;
    department?: string;
    location?: string;
    type?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getJobs(params);
      
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

  const createJob = async (jobData: CreateJobData) => {
    try {
      setCreating(true);
      setError(null);
      
      const response = await apiClient.createJob(jobData);
      
      if (response.success) {
        // Add the new job to the list
        setJobs(prev => [response.data.job, ...prev]);
        return { success: true, job: response.data.job };
      } else {
        const errorMsg = 'Failed to create job position';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Error creating job:', err);
      const errorMsg = 'Failed to create job position. Please try again later.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setCreating(false);
    }
  };

  const updateJob = async (id: string, jobData: UpdateJobData) => {
    try {
      setUpdating(true);
      setError(null);
      
      const response = await apiClient.updateJob(id, jobData);
      
      if (response.success) {
        // Update the job in the list
        setJobs(prev => prev.map(job => 
          job.id === id ? response.data.job : job
        ));
        return { success: true, job: response.data.job };
      } else {
        const errorMsg = 'Failed to update job position';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Error updating job:', err);
      const errorMsg = 'Failed to update job position. Please try again later.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setUpdating(false);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      setDeleting(true);
      setError(null);
      
      const response = await apiClient.deleteJob(id);
      
      if (response.success) {
        // Remove the job from the list
        setJobs(prev => prev.filter(job => job.id !== id));
        return { success: true };
      } else {
        const errorMsg = 'Failed to delete job position';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      const errorMsg = 'Failed to delete job position. Please try again later.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setDeleting(false);
    }
  };

  const getJob = async (id: string) => {
    try {
      setError(null);
      
      const response = await apiClient.getJob(id);
      
      if (response.success) {
        return { success: true, job: response.data.job };
      } else {
        const errorMsg = 'Failed to load job details';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      const errorMsg = 'Failed to load job details. Please try again later.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    creating,
    updating,
    deleting,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    getJob,
    clearError
  };
}
