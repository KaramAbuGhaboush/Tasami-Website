'use client'

import { use } from 'react'
import { useProject } from '@/hooks/useProject'
import { ProjectCaseStudy } from '@/components/ProjectCaseStudy'

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { project } = useProject(id)

  if (!project) {
    return null
  }

  return <ProjectCaseStudy project={project} />
}