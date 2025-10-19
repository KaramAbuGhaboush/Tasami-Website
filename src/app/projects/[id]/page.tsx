'use client'

import { use } from 'react'
import { useProject } from '@/hooks/useProject'
import { ProjectComponent } from '@/components/Project'

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { project } = useProject(id)

  if (!project) {
    return null
  }

  return <ProjectComponent project={project} />
}