'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Briefcase
} from 'lucide-react'

export function CareerPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const jobPositions = [
    { 
      id: 1, 
      title: 'Senior Frontend Developer', 
      department: 'Engineering',
      type: 'Full-time', 
      location: 'Remote',
      status: 'active',
      salary: '$80,000 - $120,000',
      postedDate: '2024-01-15',
      applications: 24
    },
    { 
      id: 2, 
      title: 'AI/ML Engineer', 
      department: 'Engineering',
      type: 'Full-time', 
      location: 'San Francisco, CA',
      status: 'active',
      salary: '$100,000 - $150,000',
      postedDate: '2024-01-12',
      applications: 18
    },
    { 
      id: 3, 
      title: 'UX/UI Designer', 
      department: 'Design',
      type: 'Contract', 
      location: 'Remote',
      status: 'closed',
      salary: '$60,000 - $90,000',
      postedDate: '2024-01-08',
      applications: 32
    }
  ]

  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations']
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']

  const filteredPositions = jobPositions.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || position.status === filterStatus
    const matchesType = filterType === 'all' || position.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'closed': return 'bg-red-100 text-red-700 border-red-200'
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Positions</p>
                <p className="text-2xl font-bold text-gray-900">{jobPositions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{jobPositions.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{jobPositions.reduce((sum, pos) => sum + pos.applications, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Remote Positions</p>
                <p className="text-2xl font-bold text-gray-900">{jobPositions.filter(p => p.location === 'Remote').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Management</h2>
          <p className="text-gray-600">Manage job positions and career opportunities</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Job Position</DialogTitle>
              <DialogDescription>
                Add a new job opening to your career page
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <Input placeholder="e.g., Senior Frontend Developer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent">
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent">
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input placeholder="e.g., Remote, San Francisco, CA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <Input placeholder="e.g., $80,000 - $120,000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <Textarea placeholder="Describe the role, responsibilities, and requirements..." rows={6} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Save Draft</Button>
                <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">Publish</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search job positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
          >
            <option value="all">All Types</option>
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Positions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{position.title}</p>
                        <p className="text-sm text-gray-500 mt-1">Posted {new Date(position.postedDate).toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{position.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {position.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {position.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        {position.salary}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {position.applications}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(position.status)}>
                        {position.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-[#6812F7] hover:bg-[#5a0fd4]">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredPositions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No job positions found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first job position'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
            <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
