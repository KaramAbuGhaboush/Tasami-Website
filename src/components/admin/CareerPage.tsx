'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCareerAdmin, type Job, type CreateJobData } from '@/hooks/useCareerAdmin'
import { CareerPageForm } from './CareerPageForm'
import { useNotification } from '@/hooks/useNotification'
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
  Briefcase,
  Loader2
} from 'lucide-react'

export function CareerPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [previewJob, setPreviewJob] = useState<Job | null>(null)
  const { success: showSuccess } = useNotification()
  const {
    jobs: jobPositions,
    loading,
    error,
    creating,
    updating,
    deleting,
    createJob,
    updateJob,
    deleteJob,
    clearError
  } = useCareerAdmin()

  const departments = ['Engineering', 'Design', 'Marketing', 'Product', 'Sales', 'Operations']
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']

  const filteredPositions = jobPositions.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || position.status === filterStatus
    const matchesType = filterType === 'all' || position.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })


  const handleDeleteJob = async (id: string) => {
    const job = jobPositions.find(j => j.id === id)
    const jobTitle = job?.title || 'this job position'
    
    if (window.confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      const result = await deleteJob(id)
      if (result.success) {
        showSuccess(`Job position "${jobTitle}" has been deleted successfully.`)
      }
    }
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setIsCreateDialogOpen(true)
  }

  const handlePreviewJob = (job: Job) => {
    setPreviewJob(job)
  }

  const closeDialog = () => {
    setIsCreateDialogOpen(false)
    setEditingJob(null)
    clearError()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'closed': return 'bg-red-100 text-red-700 border-red-200'
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading job positions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <p className="text-red-600">{error}</p>
            <Button variant="outline" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

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
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          if (open) {
            setIsCreateDialogOpen(true)
          } else {
            closeDialog()
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] xl:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{editingJob ? 'Edit Job Position' : 'Create New Job Position'}</DialogTitle>
              <DialogDescription>
                {editingJob ? 'Update the job position details' : 'Add a new job opening to your career page'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2">
              <CareerPageForm
                initialData={editingJob ? {
                  title: editingJob.title,
                  titleAr: (editingJob as any).titleAr || '',
                  department: editingJob.department,
                  departmentAr: (editingJob as any).departmentAr || '',
                  location: editingJob.location,
                  locationAr: (editingJob as any).locationAr || '',
                  type: editingJob.type,
                  typeAr: (editingJob as any).typeAr || '',
                  experience: editingJob.experience,
                  experienceAr: (editingJob as any).experienceAr || '',
                  description: editingJob.description,
                  descriptionAr: (editingJob as any).descriptionAr || '',
                  requirements: editingJob.requirements,
                  requirementsAr: (editingJob as any).requirementsAr || [],
                  benefits: editingJob.benefits,
                  benefitsAr: (editingJob as any).benefitsAr || [],
                  salary: editingJob.salary || '',
                  salaryAr: (editingJob as any).salaryAr || '',
                  applicationDeadline: editingJob.applicationDeadline || '',
                  status: editingJob.status as 'draft' | 'active' | 'inactive' | 'closed',
                  team: editingJob.team || '',
                  teamAr: (editingJob as any).teamAr || '',
                } : undefined}
                onSubmit={async (data) => {
                  if (editingJob) {
                    const result = await updateJob(editingJob.id, data)
                    if (result.success) {
                      showSuccess(`Job position "${data.title}" has been updated successfully!`)
                      closeDialog()
                    }
                    return result
                  } else {
                    const result = await createJob(data)
                    if (result.success) {
                      showSuccess(`New job position "${data.title}" has been created successfully!`)
                      closeDialog()
                    }
                    return result
                  }
                }}
                onCancel={closeDialog}
                isSubmitting={creating || updating}
                error={error}
              />
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
                  <TableHead>Experience</TableHead>
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
                        <p className="text-sm text-gray-500 mt-1">
                          Posted {new Date(position.postedDate).toLocaleDateString()}
                          {position.applicationDeadline && (
                            <span className="ml-2 text-orange-600">
                              • Deadline: {new Date(position.applicationDeadline).toLocaleDateString()}
                            </span>
                          )}
                        </p>
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
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        {position.experience}
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          title="View Details" 
                          disabled={deleting}
                          onClick={() => handlePreviewJob(position)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-[#6812F7] hover:bg-[#5a0fd4]" 
                          title="Edit Position"
                          onClick={() => handleEditJob(position)}
                          disabled={deleting}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700" 
                          title="Delete Position"
                          onClick={() => handleDeleteJob(position.id)}
                          disabled={deleting}
                        >
                          {deleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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

      {/* Job Preview Dialog */}
      <Dialog open={!!previewJob} onOpenChange={() => setPreviewJob(null)}>
        <DialogContent className="max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-8xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Job Position Preview</DialogTitle>
            <DialogDescription>
              Preview how this job position will appear to candidates
            </DialogDescription>
          </DialogHeader>
          
          {previewJob && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* Job Header */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{previewJob.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{previewJob.department}</Badge>
                      <Badge variant="outline">{previewJob.type}</Badge>
                      <Badge variant="outline">{previewJob.location}</Badge>
                      <Badge variant="outline" className={getStatusColor(previewJob.status)}>
                        {previewJob.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Posted: {new Date(previewJob.postedDate).toLocaleDateString()}</p>
                    {previewJob.applicationDeadline && (
                      <p>Deadline: {new Date(previewJob.applicationDeadline).toLocaleDateString()}</p>
                    )}
                    <p>Applications: {previewJob.applications}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 text-sm">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Experience:</span>
                    <span className="ml-2">{previewJob.experience}</span>
                  </div>
                  {previewJob.salary && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Salary:</span>
                      <span className="ml-2">{previewJob.salary}</span>
                    </div>
                  )}
                  {previewJob.team && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Team:</span>
                      <span className="ml-2">{previewJob.team}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{previewJob.description}</p>
                </div>
              </div>

              {/* Requirements and Benefits in two columns on larger screens */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Requirements */}
                {previewJob.requirements && previewJob.requirements.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
                    <ul className="space-y-2">
                      {previewJob.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#6812F7] mr-2 mt-1">•</span>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {previewJob.benefits && previewJob.benefits.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h2>
                    <ul className="space-y-2">
                      {previewJob.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2 mt-1">✓</span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex-shrink-0 flex justify-end space-x-2 pt-4 border-t bg-white">
            <Button variant="outline" onClick={() => setPreviewJob(null)}>
              Close
            </Button>
            <Button 
              className="bg-[#6812F7] hover:bg-[#5a0fd4]"
              onClick={() => {
                if (previewJob) {
                  handleEditJob(previewJob)
                  setPreviewJob(null)
                }
              }}
            >
              Edit Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
