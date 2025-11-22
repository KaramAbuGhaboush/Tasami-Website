'use client'

import { use } from 'react'
import { useProject } from '@/hooks/useProject'
import { ProjectCaseStudy } from '@/components/ProjectCaseStudy'

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { project, loading, error } = useProject(id)

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading project...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Project</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                    <p className="text-gray-600">The project you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        )
    }

    return <ProjectCaseStudy project={project} />
}

