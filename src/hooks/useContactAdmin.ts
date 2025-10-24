import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'

export interface ContactMessage {
  id: string
  name: string
  email: string
  company: string | null
  message: string
  service: string
  budget: string
  status: 'new' | 'read' | 'replied' | 'closed'
  source: string
  createdAt: string
  updatedAt: string
}

export interface UpdateContactMessageData {
  status: 'new' | 'read' | 'replied' | 'closed'
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export interface UseContactAdminReturn {
  messages: ContactMessage[]
  pagination: PaginationInfo
  loading: boolean
  error: string | null
  updating: boolean
  deleting: boolean
  testingEmail: boolean
  fetchMessages: (params?: {
    page?: number
    limit?: number
    status?: string
    service?: string
    search?: string
  }) => Promise<void>
  updateMessage: (id: string, data: UpdateContactMessageData) => Promise<{ success: boolean; message?: string }>
  deleteMessage: (id: string) => Promise<{ success: boolean; message?: string }>
  testEmail: () => Promise<{ success: boolean; message?: string }>
  clearError: () => void
}

export function useContactAdmin(): UseContactAdminReturn {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)

  const fetchMessages = async (params?: {
    page?: number
    limit?: number
    status?: string
    service?: string
    search?: string
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.getContactMessages(params)
      if (response.success) {
        setMessages(response.data.messages)
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to fetch contact messages')
      }
    } catch (err) {
      console.error('Error fetching contact messages:', err)
      setError('Failed to fetch contact messages')
    } finally {
      setLoading(false)
    }
  }

  const updateMessage = async (id: string, data: UpdateContactMessageData): Promise<{ success: boolean; message?: string }> => {
    setUpdating(true)
    setError(null)
    
    try {
      const response = await apiClient.updateContactMessage(id, data)
      if (response.success) {
        // Update the message in the local state
        setMessages(prev => prev.map(msg => 
          msg.id === id 
            ? { ...msg, ...response.data.message, updatedAt: response.data.message.updatedAt }
            : msg
        ))
        return { success: true, message: 'Message updated successfully' }
      } else {
        setError(response.message || 'Failed to update message')
        return { success: false, message: response.message }
      }
    } catch (err) {
      console.error('Error updating contact message:', err)
      const errorMessage = 'Failed to update message'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setUpdating(false)
    }
  }

  const deleteMessage = async (id: string): Promise<{ success: boolean; message?: string }> => {
    setDeleting(true)
    setError(null)
    
    try {
      const response = await apiClient.deleteContactMessage(id)
      if (response.success) {
        // Remove the message from the local state
        setMessages(prev => prev.filter(msg => msg.id !== id))
        return { success: true, message: 'Message deleted successfully' }
      } else {
        setError(response.message || 'Failed to delete message')
        return { success: false, message: response.message }
      }
    } catch (err) {
      console.error('Error deleting contact message:', err)
      const errorMessage = 'Failed to delete message'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setDeleting(false)
    }
  }

  const testEmail = async (): Promise<{ success: boolean; message?: string }> => {
    setTestingEmail(true)
    setError(null)
    
    try {
      const response = await apiClient.testContactEmail()
      if (response.success) {
        return { success: true, message: 'Email configuration test successful' }
      } else {
        setError(response.message || 'Email test failed')
        return { success: false, message: response.message }
      }
    } catch (err) {
      console.error('Error testing email:', err)
      const errorMessage = 'Email test failed'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setTestingEmail(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages()
  }, [])

  return {
    messages,
    pagination,
    loading,
    error,
    updating,
    deleting,
    testingEmail,
    fetchMessages,
    updateMessage,
    deleteMessage,
    testEmail,
    clearError
  }
}
