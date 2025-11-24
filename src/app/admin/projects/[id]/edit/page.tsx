'use client'

import { useState, useEffect } from 'react'
import { useProject } from '@/hooks/useProject'
import { ProjectEditor } from '@/components/ProjectEditor'

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const [projectId, setProjectId] = useState<string>('')
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(({ id }) => {
      setProjectId(id)
      // In a real app, you'd fetch from your API
      // For now, we'll use the mock data
      setProject({
        id,
        title: 'Sample Project',
        contentBlocks: []
      })
      setLoading(false)
    })
  }, [params])

  const handleSave = async (contentBlocks: any[]) => {
    try {
      // In a real app, you'd save to your API
      console.log('Saving content blocks:', contentBlocks)
      
      // Example API call:
      // await fetch(`/api/projects/${projectId}/content-blocks`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ contentBlocks })
      // })
      
      // Success handled by parent component
      console.log('Content saved successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      // Error handled by parent component
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectEditor 
        project={project} 
        onSave={handleSave}
      />
    </div>
  )
}
