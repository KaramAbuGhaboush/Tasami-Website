'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export interface DashboardStats {
  totalProjects: number
  totalBlogArticles: number
  totalContactMessages: number
  totalEmployees: number
  totalTestimonials: number
  newMessagesThisWeek: number
  publishedArticles: number
  activeEmployees: number
}

export interface RecentActivity {
  id: string
  action: string
  time: string
  type: 'portfolio' | 'blog' | 'contact' | 'users' | 'testimonials'
  user: string
  status: 'active' | 'completed' | 'published' | 'urgent' | 'new'
  value?: string
  views?: string
  role?: string
  improvement?: string
}

export interface UseDashboardOverviewReturn {
  stats: DashboardStats | null
  recentActivities: RecentActivity[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return `${Math.floor(diffInSeconds / 2592000)} months ago`
}

export function useDashboardOverview(): UseDashboardOverviewReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch data from multiple API endpoints
      const [projectsResponse, blogResponse, contactResponse, testimonialsResponse] = await Promise.all([
        apiClient.getProjects(),
        apiClient.getBlogArticles(),
        apiClient.getContactMessages(),
        apiClient.getTestimonials()
      ])

      // Process projects data
      const projects = projectsResponse.data?.projects || []
      const totalProjects = projects.length

      // Process blog articles data
      const articles = blogResponse.data?.articles || []
      const totalBlogArticles = articles.length
      const publishedArticles = articles.filter((article: any) => article.status === 'published').length

      // Process contact messages data
      const messages = contactResponse.data?.messages || []
      const totalContactMessages = messages.length
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const newMessagesThisWeek = messages.filter((message: any) => 
        new Date(message.createdAt) > oneWeekAgo
      ).length

      // Process testimonials data
      const testimonials = testimonialsResponse.data?.testimonials || []
      const totalTestimonials = testimonials.length

      // Fetch employees data (requires authentication)
      let employeesResponse
      try {
        employeesResponse = await apiClient.getTeamStats()
      } catch (err) {
        console.warn('Failed to fetch employees data:', err)
        employeesResponse = { data: { totalUsers: 0, activeUsers: 0 } }
      }
      
      const totalEmployees = employeesResponse.data?.totalUsers || 0
      const activeEmployees = employeesResponse.data?.activeUsers || 0

      // Create stats object
      const dashboardStats: DashboardStats = {
        totalProjects,
        totalBlogArticles,
        totalContactMessages,
        totalEmployees,
        totalTestimonials,
        newMessagesThisWeek,
        publishedArticles,
        activeEmployees
      }

      setStats(dashboardStats)

      // Generate recent activities from real data
      const activities: RecentActivity[] = []

      // Add recent projects
      projects.slice(0, 2).forEach((project: any) => {
        // Handle category as object or string
        const categoryValue = project.category 
          ? (typeof project.category === 'string' 
              ? project.category 
              : project.category.name || project.category.slug || 'Web Development')
          : 'Web Development'
        
        activities.push({
          id: `project-${project.id}`,
          action: `Project "${project.title}" created`,
          time: formatTimeAgo(project.createdAt),
          type: 'portfolio',
          user: 'Admin',
          status: 'active',
          value: categoryValue
        })
      })

      // Add recent blog articles
      articles.slice(0, 2).forEach((article: any) => {
        activities.push({
          id: `blog-${article.id}`,
          action: `Blog post "${article.title}" ${article.status === 'published' ? 'published' : 'created'}`,
          time: formatTimeAgo(article.createdAt),
          type: 'blog',
          user: article.author?.name || 'Admin',
          status: article.status === 'published' ? 'published' : 'active',
          views: article.views?.toString() || '0'
        })
      })

      // Add recent contact messages
      messages.slice(0, 2).forEach((message: any) => {
        // Handle service as object or string
        const serviceValue = message.service 
          ? (typeof message.service === 'string' 
              ? message.service 
              : message.service.name || message.service.title || 'General Inquiry')
          : 'General Inquiry'
        
        activities.push({
          id: `contact-${message.id}`,
          action: `New contact message from ${message.name}`,
          time: formatTimeAgo(message.createdAt),
          type: 'contact',
          user: message.name,
          status: 'new',
          value: serviceValue
        })
      })

      // Add recent testimonials
      testimonials.slice(0, 1).forEach((testimonial: any) => {
        activities.push({
          id: `testimonial-${testimonial.id}`,
          action: `New testimonial from ${testimonial.clientName}`,
          time: formatTimeAgo(testimonial.createdAt),
          type: 'testimonials',
          user: testimonial.clientName,
          status: 'published',
          improvement: `${testimonial.rating}/5 Stars`
        })
      })

      // Sort activities by creation time (most recent first)
      activities.sort((a, b) => {
        const timeA = new Date(a.time.includes('ago') ? new Date() : a.time).getTime()
        const timeB = new Date(b.time.includes('ago') ? new Date() : b.time).getTime()
        return timeB - timeA
      })

      setRecentActivities(activities)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchDashboardData()
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    stats,
    recentActivities,
    loading,
    error,
    refreshData
  }
}

