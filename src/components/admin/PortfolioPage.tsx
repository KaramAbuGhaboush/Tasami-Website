'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Eye,
  Search,
  Filter,
  Trash2
} from 'lucide-react'

export function PortfolioPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const projects = [
    { id: 1, title: 'E-commerce Platform', description: 'AI-Powered E-commerce Platform', status: 'active', category: 'Web Development' },
    { id: 2, title: 'Mobile App', description: 'Cross-platform mobile application', status: 'completed', category: 'Mobile' },
    { id: 3, title: 'Data Analytics Dashboard', description: 'Real-time analytics dashboard', status: 'active', category: 'Data Science' },
    { id: 4, title: 'AI Chatbot', description: 'Intelligent customer service chatbot', status: 'completed', category: 'AI/ML' },
    { id: 5, title: 'Blockchain Solution', description: 'Decentralized finance platform', status: 'planning', category: 'Blockchain' },
    { id: 6, title: 'IoT System', description: 'Smart home automation system', status: 'active', category: 'IoT' },
  ]

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'planning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Portfolio Management</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage your project portfolio</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] hover:from-[#5a0fd4] hover:to-[#7d42e6]">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Create a new project for your portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Project title" />
              <Textarea placeholder="Project description" />
              <Button className="w-full">Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="planning">Planning</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="w-full h-32 bg-gradient-to-br from-[#6812F7]/20 to-[#9253F0]/20 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🚀</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600">{project.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {project.category}
                  </span>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="h-8 w-8 p-0 bg-[#6812F7] hover:bg-[#5a0fd4]">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first project'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
