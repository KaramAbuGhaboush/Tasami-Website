import { useState, useEffect } from 'react'

// Types based on database schema
export interface ProjectCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
  featured: boolean
  sortOrder: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface ProjectTechnology {
  id: string
  name: string
  description: string
  projectId: string
}

export interface ProjectResult {
  id: string
  metric: string
  description: string
  projectId: string
}

export interface ProjectTestimonial {
  id: string
  quote: string
  author: string
  position: string
  projectId: string
}

export interface ContentBlock {
  id: string
  type: 'heading' | 'paragraph' | 'image' | 'imageGrid'
  order: number
  content?: string
  contentAr?: string
  src?: string
  alt?: string
  altAr?: string
  width?: number
  height?: number
  caption?: string
  captionAr?: string
  level?: number
  columns?: number
  images?: any[]
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  headerImage?: string
  challenge?: string
  solution?: string
  timeline?: string
  teamSize?: string
  status: 'planning' | 'active' | 'completed' | 'on-hold'
  createdAt: string
  updatedAt: string
  category: ProjectCategory
  technologies: ProjectTechnology[]
  results: ProjectResult[]
  clientTestimonial?: ProjectTestimonial
  contentBlocks: ContentBlock[]
}

export interface CreateProjectData {
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  headerImage?: string
  challenge?: string
  challengeAr?: string
  solution?: string
  solutionAr?: string
  timeline?: string
  teamSize?: string
  status: 'planning' | 'active' | 'completed' | 'on-hold'
  categoryId: string
  technologies: { name: string; nameAr?: string; description: string; descriptionAr?: string }[]
  results: { metric: string; metricAr?: string; description: string; descriptionAr?: string }[]
  testimonial?: {
    quote: string
    quoteAr?: string
    author: string
    authorAr?: string
    position: string
    positionAr?: string
  }
  contentBlocks: Omit<ContentBlock, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[]
}

export interface CreateCategoryData {
  name: string
  nameAr?: string
  slug: string
  description: string
  descriptionAr?: string
  color: string
  icon: string
  featured: boolean
  sortOrder: number
  status: 'active' | 'inactive'
}

import { API_BASE_URL } from '../lib/config'

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

export function usePortfolioAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all data
  const fetchAll = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Add cache-busting and status parameter to get all projects (including planning, on-hold, etc.)
      const timestamp = Date.now()
      const [projectsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/projects?status=all&_t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            ...getAuthHeaders(),
            'Cache-Control': 'no-cache',
          }
        }),
        fetch(`${API_BASE_URL}/categories?_t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            ...getAuthHeaders(),
            'Cache-Control': 'no-cache',
          }
        })
      ])

      if (!projectsRes.ok) throw new Error('Failed to fetch projects')
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories')

      const projectsData = await projectsRes.json()
      const categoriesData = await categoriesRes.json()

      // Ensure all projects have contentBlocks as an array
      const projects = (projectsData.data?.projects || []).map((project: any) => ({
        ...project,
        contentBlocks: project.contentBlocks || []
      }))

      setProjects(projects)
      setCategories(categoriesData.data?.categories || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching portfolio data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Projects CRUD
  const createProject = async (projectData: CreateProjectData): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create project')
      }

      const result = await response.json()
      const newProject = {
        ...result.data.project,
        contentBlocks: result.data.project.contentBlocks || []
      }
      
      // Wait a bit to ensure backend has processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Refresh all projects to get the latest data
      await fetchAll()
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
      console.error('Error creating project:', err)
      return false
    }
  }

  const updateProject = async (id: string, projectData: Partial<CreateProjectData>): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update project')
      }

      const result = await response.json()
      const updatedProject = {
        ...result.data.project,
        contentBlocks: result.data.project.contentBlocks || []
      }
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
      console.error('Error updating project:', err)
      return false
    }
  }

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete project')
      }

      setProjects(prev => prev.filter(p => p.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
      console.error('Error deleting project:', err)
      return false
    }
  }

  // Categories CRUD
  const createCategory = async (categoryData: CreateCategoryData): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create category')
      }

      const result = await response.json()
      setCategories(prev => [...prev, result.data.category])
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
      console.error('Error creating category:', err)
      return false
    }
  }

  const updateCategory = async (id: string, categoryData: Partial<CreateCategoryData>): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update category')
      }

      const result = await response.json()
      setCategories(prev => prev.map(c => c.id === id ? result.data.category : c))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
      console.error('Error updating category:', err)
      return false
    }
  }

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete category')
      }

      setCategories(prev => prev.filter(c => c.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
      console.error('Error deleting category:', err)
      return false
    }
  }

  // Content blocks CRUD
  const createContentBlock = async (projectId: string, blockData: Omit<ContentBlock, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/content-blocks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(blockData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create content block')
      }

      const result = await response.json()
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, contentBlocks: [...p.contentBlocks, result.data.contentBlock] }
          : p
      ))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create content block')
      console.error('Error creating content block:', err)
      return false
    }
  }

  const updateContentBlock = async (projectId: string, blockId: string, blockData: Partial<ContentBlock>): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/content-blocks/${blockId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(blockData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update content block')
      }

      const result = await response.json()
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              contentBlocks: p.contentBlocks.map(block => 
                block.id === blockId ? result.data.contentBlock : block
              )
            }
          : p
      ))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content block')
      console.error('Error updating content block:', err)
      return false
    }
  }

  const deleteContentBlock = async (projectId: string, blockId: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/content-blocks/${blockId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete content block')
      }

      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, contentBlocks: p.contentBlocks.filter(block => block.id !== blockId) }
          : p
      ))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete content block')
      console.error('Error deleting content block:', err)
      return false
    }
  }

  const reorderContentBlocks = async (projectId: string, blocks: { id: string; order: number }[]): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/content-blocks/reorder`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ blocks }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to reorder content blocks')
      }

      // Update local state
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              contentBlocks: p.contentBlocks.map(block => {
                const newOrder = blocks.find(b => b.id === block.id)
                return newOrder ? { ...block, order: newOrder.order } : block
              }).sort((a, b) => a.order - b.order)
            }
          : p
      ))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder content blocks')
      console.error('Error reordering content blocks:', err)
      return false
    }
  }

  // Image upload
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setError(null)
      const formData = new FormData()
      formData.append('image', file)

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_BASE_URL}/blog/upload-image`, {
        method: 'POST',
        headers,
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to upload image')
      }
      
      const result = await response.json()
      return result.data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
      console.error('Error uploading image:', err)
      return null
    }
  }

  // Load data on mount
  useEffect(() => {
    fetchAll()
  }, [])

  return {
    // Data
    projects,
    categories,
    loading,
    error,
    
    // Actions
    fetchAll,
    
    // Project actions
    createProject,
    updateProject,
    deleteProject,
    
    // Category actions
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Content block actions
    createContentBlock,
    updateContentBlock,
    deleteContentBlock,
    reorderContentBlocks,
    
    // Image upload
    uploadImage,
  }
}
