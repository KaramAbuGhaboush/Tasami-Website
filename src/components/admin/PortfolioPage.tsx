'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePortfolioAdmin, Project, ProjectCategory, ContentBlock, CreateProjectData, CreateCategoryData } from '@/hooks/usePortfolioAdmin'
import { 
  Plus, 
  Edit, 
  Eye,
  Search,
  Filter,
  Trash2,
  Calendar,
  Users,
  Clock,
  Star,
  TrendingUp,
  Code,
  Target,
  MessageSquare,
  Image,
  Folder,
  Settings,
  Loader2,
  AlertCircle,
  ExternalLink,
  BarChart3,
  Briefcase,
  Tag,
  Award,
  CheckCircle,
  FileText
} from 'lucide-react'

export function PortfolioPage() {
  const router = useRouter()
  
  // Use the API hook
  const {
    projects,
    categories,
    loading,
    error,
    fetchAll,
    createProject,
    updateProject,
    deleteProject,
    createCategory,
    updateCategory,
    deleteCategory,
    createContentBlock,
    updateContentBlock,
    deleteContentBlock,
    reorderContentBlocks,
    uploadImage
  } = usePortfolioAdmin()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('projects')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  
  // Form states
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingCategory, setEditingCategory] = useState<ProjectCategory | null>(null)
  
  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    headerImage: '',
    challenge: '',
    solution: '',
    timeline: '',
    teamSize: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'on-hold',
    categoryId: '',
    technologies: [] as { name: string; description: string }[],
    results: [] as { metric: string; description: string }[],
    testimonial: {
      quote: '',
      author: '',
      position: ''
    }
  })
  
  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#6812F7',
    icon: '📁',
    featured: false,
    sortOrder: 0,
    status: 'active' as 'active' | 'inactive'
  })
  
  // Form input states
  const [techInput, setTechInput] = useState('')
  const [resultInput, setResultInput] = useState({ metric: '', description: '' })
  const [imagePreview, setImagePreview] = useState('')
  
  // Content blocks state
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [newBlockType, setNewBlockType] = useState<'heading' | 'paragraph' | 'image' | 'imageGrid'>('paragraph')
  const [newBlockContent, setNewBlockContent] = useState('')
  const [newBlockLevel, setNewBlockLevel] = useState(2)
  const [newBlockImage, setNewBlockImage] = useState('')
  const [newBlockAlt, setNewBlockAlt] = useState('')
  const [newBlockCaption, setNewBlockCaption] = useState('')
  const [newBlockColumns, setNewBlockColumns] = useState(2)
  const [newBlockImageFile, setNewBlockImageFile] = useState<File | null>(null)
  const [newBlockImagePreview, setNewBlockImagePreview] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    const matchesCategory = filterCategory === 'all' || project.category.id === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'planning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'on-hold': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="w-3 h-3" />
      case 'completed': return <CheckCircle className="w-3 h-3" />
      case 'planning': return <Clock className="w-3 h-3" />
      case 'on-hold': return <AlertCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  // Form handlers
  const handleCreateProject = async () => {
    if (!projectForm.title || !projectForm.description || !projectForm.categoryId) {
      alert('Please fill in all required fields')
      return
    }
    
    const projectData: CreateProjectData = {
      title: projectForm.title,
      description: projectForm.description,
      headerImage: projectForm.headerImage,
      challenge: projectForm.challenge,
      solution: projectForm.solution,
      timeline: projectForm.timeline,
      teamSize: projectForm.teamSize,
      status: projectForm.status,
      categoryId: projectForm.categoryId,
      technologies: projectForm.technologies,
      results: projectForm.results,
      testimonial: projectForm.testimonial.quote ? projectForm.testimonial : undefined,
      contentBlocks: contentBlocks.map(block => ({
        type: block.type,
        order: block.order,
        content: block.content,
        level: block.level,
        src: block.src,
        alt: block.alt,
        caption: block.caption,
        columns: block.columns,
        images: block.images
      }))
    }
    
    const success = await createProject(projectData)
    if (success) {
      // Reset form
      setProjectForm({
        title: '',
        description: '',
        headerImage: '',
        challenge: '',
        solution: '',
        timeline: '',
        teamSize: '',
        status: 'planning',
        categoryId: '',
        technologies: [],
        results: [],
        testimonial: { quote: '', author: '', position: '' }
      })
      setImagePreview('')
      setContentBlocks([])
      setProjectDialogOpen(false)
    }
  }


  const handleUpdateProject = async () => {
    if (!editingProject) return
    
    if (!projectForm.title || !projectForm.description || !projectForm.categoryId) {
      alert('Please fill in all required fields')
      return
    }
    
    const projectData: Partial<CreateProjectData> = {
      title: projectForm.title,
      description: projectForm.description,
      headerImage: projectForm.headerImage,
      challenge: projectForm.challenge,
      solution: projectForm.solution,
      timeline: projectForm.timeline,
      teamSize: projectForm.teamSize,
      status: projectForm.status,
      categoryId: projectForm.categoryId,
      technologies: projectForm.technologies,
      results: projectForm.results,
      testimonial: projectForm.testimonial.quote ? projectForm.testimonial : undefined
    }
    
    const success = await updateProject(editingProject.id, projectData)
    if (success) {
      // Refresh the projects data to get updated content blocks
      await fetchAll()
      
      // Reset form
      setEditingProject(null)
      setProjectForm({
        title: '',
        description: '',
        headerImage: '',
        challenge: '',
        solution: '',
        timeline: '',
        teamSize: '',
        status: 'planning',
        categoryId: '',
        technologies: [],
        results: [],
        testimonial: { quote: '', author: '', position: '' }
      })
      setImagePreview('')
      setContentBlocks([])
      setProjectDialogOpen(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!categoryForm.name) {
      alert('Please fill in the category name')
      return
    }
    
    // Generate slug from name
    const slug = categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const categoryData: CreateCategoryData = { ...categoryForm, slug }
    
    const success = await createCategory(categoryData)
    if (success) {
      // Reset form
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        color: '#6812F7',
        icon: '📁',
        featured: false,
        sortOrder: 0,
        status: 'active'
      })
      setCategoryDialogOpen(false)
    }
  }

  const handleEditCategory = (category: ProjectCategory) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      icon: category.icon,
      featured: category.featured,
      sortOrder: category.sortOrder,
      status: category.status as 'active' | 'inactive'
    })
    setCategoryDialogOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    
    if (!categoryForm.name) {
      alert('Please fill in the category name')
      return
    }
    
    const categoryData: Partial<CreateCategoryData> = { ...categoryForm }
    
    const success = await updateCategory(editingCategory.id, categoryData)
    if (success) {
      // Reset form
      setEditingCategory(null)
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        color: '#6812F7',
        icon: '📁',
        featured: false,
        sortOrder: 0,
        status: 'active'
      })
      setCategoryDialogOpen(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(categoryId)
    }
  }

  // Technology handlers
  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setProjectForm({
        ...projectForm,
        technologies: [...projectForm.technologies, { name: techInput.trim(), description: '' }]
      })
      setTechInput('')
    }
  }

  const handleRemoveTechnology = (index: number) => {
    setProjectForm({
      ...projectForm,
      technologies: projectForm.technologies.filter((_, i) => i !== index)
    })
  }

  const handleUpdateTechnology = (index: number, field: 'name' | 'description', value: string) => {
    const updatedTechs = [...projectForm.technologies]
    updatedTechs[index] = { ...updatedTechs[index], [field]: value }
    setProjectForm({ ...projectForm, technologies: updatedTechs })
  }

  // Results handlers
  const handleAddResult = () => {
    if (resultInput.metric.trim() && resultInput.description.trim()) {
      setProjectForm({
        ...projectForm,
        results: [...projectForm.results, { ...resultInput }]
      })
      setResultInput({ metric: '', description: '' })
    }
  }

  const handleRemoveResult = (index: number) => {
    setProjectForm({
      ...projectForm,
      results: projectForm.results.filter((_, i) => i !== index)
    })
  }

  const handleUpdateResult = (index: number, field: 'metric' | 'description', value: string) => {
    const updatedResults = [...projectForm.results]
    updatedResults[index] = { ...updatedResults[index], [field]: value }
    setProjectForm({ ...projectForm, results: updatedResults })
  }

  // Image upload handler
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setProjectForm({ ...projectForm, headerImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  // Content block image upload handler
  const handleContentBlockImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewBlockImageFile(file)
      setIsUploadingImage(true)
      
      // Show preview immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setNewBlockImagePreview(result)
      }
      reader.readAsDataURL(file)
      
      try {
        // Upload the image
        const uploadedUrl = await uploadImage(file)
        if (uploadedUrl) {
          setNewBlockImage(uploadedUrl)
          setNewBlockImagePreview(uploadedUrl)
        } else {
          // If upload fails, use base64 as fallback
          setNewBlockImage(reader.result as string)
        }
      } catch (error) {
        console.error('Image upload failed:', error)
        // Use base64 as fallback
        setNewBlockImage(reader.result as string)
      } finally {
        setIsUploadingImage(false)
      }
    }
  }

  // Content blocks handlers
  const handleAddContentBlock = async () => {
    if (!newBlockContent.trim() && newBlockType !== 'imageGrid' && newBlockType !== 'image') {
      alert('Please enter content for the block')
      return
    }

    if (newBlockType === 'image' && !newBlockImage.trim()) {
      alert('Please upload an image or enter an image URL')
      return
    }

    if (!editingProject) {
      alert('Please save the project first before adding content blocks')
      return
    }

    const blockData = {
      type: newBlockType,
      order: contentBlocks.length,
      content: newBlockContent,
      level: newBlockType === 'heading' ? newBlockLevel : undefined,
      src: newBlockType === 'image' || newBlockType === 'imageGrid' ? newBlockImage : undefined,
      alt: newBlockType === 'image' || newBlockType === 'imageGrid' ? newBlockAlt : undefined,
      caption: newBlockType === 'image' || newBlockType === 'imageGrid' ? newBlockCaption : undefined,
      columns: newBlockType === 'imageGrid' ? newBlockColumns : undefined,
      images: newBlockType === 'imageGrid' ? [] : undefined
    }

    const success = await createContentBlock(editingProject.id, blockData)
    if (success) {
      // Reset form
      setNewBlockContent('')
      setNewBlockImage('')
      setNewBlockAlt('')
      setNewBlockCaption('')
      setNewBlockImageFile(null)
      setNewBlockImagePreview('')
      setIsUploadingImage(false)
    }
  }

  const handleRemoveContentBlock = async (blockId: string) => {
    if (!editingProject) return
    
    if (confirm('Are you sure you want to delete this content block?')) {
      await deleteContentBlock(editingProject.id, blockId)
    }
  }

  const handleUpdateContentBlock = async (blockId: string, field: keyof ContentBlock, value: any) => {
    if (!editingProject) return
    
    await updateContentBlock(editingProject.id, blockId, { [field]: value })
  }

  const handleReorderContentBlocks = async (fromIndex: number, toIndex: number) => {
    if (!editingProject) return
    
    const newBlocks = [...contentBlocks]
    const [movedBlock] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, movedBlock)
    
    // Update order numbers
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }))
    
    setContentBlocks(reorderedBlocks)
    
    // Update via API
    const blocksToUpdate = reorderedBlocks.map(block => ({
      id: block.id,
      order: block.order
    }))
    
    await reorderContentBlocks(editingProject.id, blocksToUpdate)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title,
      description: project.description,
      headerImage: project.headerImage || '',
      challenge: project.challenge || '',
      solution: project.solution || '',
      timeline: project.timeline || '',
      teamSize: project.teamSize || '',
      status: project.status,
      categoryId: project.category.id,
      technologies: project.technologies.map(t => ({ name: t.name, description: t.description })),
      results: project.results.map(r => ({ metric: r.metric, description: r.description })),
      testimonial: project.clientTestimonial ? {
        quote: project.clientTestimonial.quote,
        author: project.clientTestimonial.author,
        position: project.clientTestimonial.position
      } : { quote: '', author: '', position: '' }
    })
    setImagePreview(project.headerImage || '')
    setContentBlocks(project.contentBlocks || [])
    setProjectDialogOpen(true)
  }

  const handlePreviewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#6812F7]" />
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">Error loading portfolio data: {error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#6812F7] hover:bg-[#5a0fd4]">
            Retry
          </Button>
        </div>
      </div>
    )
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
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Management</h2>
          <p className="text-gray-600">Manage projects, categories, and portfolio content</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
              <p className="text-sm text-gray-600">Manage your project portfolio</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="w-1 h-1 bg-current rounded-sm"></div>
                    <div className="w-1 h-1 bg-current rounded-sm"></div>
                    <div className="w-1 h-1 bg-current rounded-sm"></div>
                    <div className="w-1 h-1 bg-current rounded-sm"></div>
                  </div>
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <div className="flex flex-col gap-0.5 w-4 h-4">
                    <div className="w-full h-0.5 bg-current rounded-sm"></div>
                    <div className="w-full h-0.5 bg-current rounded-sm"></div>
                    <div className="w-full h-0.5 bg-current rounded-sm"></div>
                  </div>
                </Button>
              </div>
              <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
          <DialogTrigger asChild>
                  <Button 
                    className="bg-[#6812F7] hover:bg-[#5a0fd4]"
                    onClick={() => {
                      setEditingProject(null)
                      setProjectForm({
                        title: '',
                        description: '',
                        headerImage: '',
                        challenge: '',
                        solution: '',
                        timeline: '',
                        teamSize: '',
                        status: 'planning',
                        categoryId: '',
                        technologies: [],
                        results: [],
                        testimonial: { quote: '', author: '', position: '' }
                      })
                      setImagePreview('')
                      setContentBlocks([])
                      setProjectDialogOpen(true)
                    }}
                  >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col w-[95vw] 2xl:max-w-[1400px]">
                  <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200">
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      {editingProject ? (
                        <>
                          <Edit className="w-6 h-6 text-[#6812F7]" />
                          Edit Project
                        </>
                      ) : (
                        <>
                          <Plus className="w-6 h-6 text-[#6812F7]" />
                          Create New Project
                        </>
                      )}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2">
                      {editingProject ? 'Update the project details and settings' : 'Create a new project for your portfolio with comprehensive details'}
              </DialogDescription>
            </DialogHeader>
                  <div className="flex-1 overflow-y-auto px-1">
                    <div className="space-y-8 py-6">
                      {/* Basic Information */}
                      <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <Input 
                              placeholder="Enter project title..." 
                              value={projectForm.title}
                              onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                              className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select 
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                              value={projectForm.categoryId}
                              onChange={(e) => setProjectForm({...projectForm, categoryId: e.target.value})}
                            >
                              <option value="">Select a category</option>
                              {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                          <Textarea 
                            placeholder="Enter project description..." 
                            rows={4}
                            value={projectForm.description}
                            onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                            className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                            <Input 
                              placeholder="e.g., 6 months" 
                              value={projectForm.timeline}
                              onChange={(e) => setProjectForm({...projectForm, timeline: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                            <Input 
                              placeholder="e.g., 8 developers" 
                              value={projectForm.teamSize}
                              onChange={(e) => setProjectForm({...projectForm, teamSize: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select 
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                              value={projectForm.status}
                              onChange={(e) => setProjectForm({...projectForm, status: e.target.value as any})}
                            >
                              <option value="planning">Planning</option>
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                              <option value="on-hold">On Hold</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Challenge</label>
                          <Textarea 
                            placeholder="What problem did this project solve?" 
                            rows={3}
                            value={projectForm.challenge}
                            onChange={(e) => setProjectForm({...projectForm, challenge: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Solution</label>
                          <Textarea 
                            placeholder="How did you solve the problem?" 
                            rows={3}
                            value={projectForm.solution}
                            onChange={(e) => setProjectForm({...projectForm, solution: e.target.value})}
                          />
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Image className="w-4 h-4 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Project Image</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                                <div className="relative group">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg focus-within:border-[#6812F7] hover:border-[#6812F7] hover:bg-blue-50/30 transition-all duration-200 group-hover:shadow-sm">
                                    <div className="text-center">
                                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                                        <Image className="w-8 h-8 text-blue-600" />
                                      </div>
                                      <p className="text-lg font-medium text-gray-700 mb-2">Click to upload or drag & drop</p>
                                      <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, WebP up to 2MB</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                <Input 
                                  placeholder="Or enter image URL (https://...)" 
                                  value={projectForm.headerImage}
                                  onChange={(e) => {
                                    setProjectForm({...projectForm, headerImage: e.target.value})
                                    setImagePreview(e.target.value)
                                  }}
                                  className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                                />
                              </div>
                            </div>
                            {imagePreview && (
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Preview</label>
                                <div className="relative aspect-video">
                                  <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                  />
                                  <div className="absolute top-2 right-2">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="bg-white/90 hover:bg-white shadow-md"
                                      onClick={() => {
                                        setImagePreview('')
                                        setProjectForm({...projectForm, headerImage: ''})
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Code className="w-4 h-4 text-orange-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Technologies Used</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex space-x-2">
                            <Input 
                              placeholder="Add technology (e.g., React, Node.js)" 
                              value={techInput}
                              onChange={(e) => setTechInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                              className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                            />
                            <Button 
                              type="button" 
                              onClick={handleAddTechnology} 
                              variant="outline"
                              className="border-[#6812F7] text-[#6812F7] hover:bg-[#6812F7] hover:text-white transition-colors"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </div>
                          
                          {projectForm.technologies.length > 0 && (
                            <div className="space-y-3">
                              {projectForm.technologies.map((tech, index) => (
                                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1 grid grid-cols-2 gap-2">
                                    <Input 
                                      placeholder="Technology name" 
                                      value={tech.name}
                                      onChange={(e) => handleUpdateTechnology(index, 'name', e.target.value)}
                                    />
                                    <Input 
                                      placeholder="Description" 
                                      value={tech.description}
                                      onChange={(e) => handleUpdateTechnology(index, 'description', e.target.value)}
                                    />
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleRemoveTechnology(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Results */}
                      <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Award className="w-4 h-4 text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Project Results</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <Input 
                              placeholder="Metric (e.g., 40%)" 
                              value={resultInput.metric}
                              onChange={(e) => setResultInput({...resultInput, metric: e.target.value})}
                              className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                            />
                            <Input 
                              placeholder="Description (e.g., Increase in conversion rate)" 
                              value={resultInput.description}
                              onChange={(e) => setResultInput({...resultInput, description: e.target.value})}
                              className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                            />
                            <Button 
                              type="button" 
                              onClick={handleAddResult} 
                              variant="outline"
                              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Result
                            </Button>
                          </div>
                          
                          {projectForm.results.length > 0 && (
                            <div className="space-y-3">
                              {projectForm.results.map((result, index) => (
                                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1 grid grid-cols-2 gap-2">
                                    <Input 
                                      placeholder="Metric" 
                                      value={result.metric}
                                      onChange={(e) => handleUpdateResult(index, 'metric', e.target.value)}
                                    />
                                    <Input 
                                      placeholder="Description" 
                                      value={result.description}
                                      onChange={(e) => handleUpdateResult(index, 'description', e.target.value)}
                                    />
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleRemoveResult(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Client Testimonial */}
                      <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-indigo-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Client Testimonial</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
                            <Textarea 
                              placeholder="Client testimonial quote..." 
                              rows={3}
                              value={projectForm.testimonial.quote}
                              onChange={(e) => setProjectForm({
                                ...projectForm, 
                                testimonial: {...projectForm.testimonial, quote: e.target.value}
                              })}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                              <Input 
                                placeholder="Client name" 
                                value={projectForm.testimonial.author}
                                onChange={(e) => setProjectForm({
                                  ...projectForm, 
                                  testimonial: {...projectForm.testimonial, author: e.target.value}
                                })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                              <Input 
                                placeholder="Client position/company" 
                                value={projectForm.testimonial.position}
                                onChange={(e) => setProjectForm({
                                  ...projectForm, 
                                  testimonial: {...projectForm.testimonial, position: e.target.value}
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Blocks */}
                      <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-pink-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Content Blocks</h3>
                        </div>
                        
                        {/* Add New Block */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Block Type</label>
                              <select 
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                                value={newBlockType}
                                onChange={(e) => setNewBlockType(e.target.value as any)}
                              >
                                <option value="paragraph">Paragraph</option>
                                <option value="heading">Heading</option>
                                <option value="image">Image</option>
                                <option value="imageGrid">Image Grid</option>
                              </select>
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                              {newBlockType === 'heading' ? (
                                <div className="flex space-x-2">
                                  <select 
                                    className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                                    value={newBlockLevel}
                                    onChange={(e) => setNewBlockLevel(parseInt(e.target.value))}
                                  >
                                    <option value={2}>H2</option>
                                    <option value={3}>H3</option>
                                    <option value={4}>H4</option>
                                  </select>
                                  <Input 
                                    placeholder="Heading text..." 
                                    value={newBlockContent}
                                    onChange={(e) => setNewBlockContent(e.target.value)}
                                    className="flex-1"
                                  />
                                </div>
                              ) : newBlockType === 'image' ? (
                                <div className="space-y-4">
                                  {/* Image Upload Section */}
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-4">
                                      <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                                        <div className="relative group">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleContentBlockImageUpload}
                                            disabled={isUploadingImage}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                                          />
                                          <div className={`w-full px-4 py-3 border-2 border-dashed rounded-lg transition-all duration-200 group-hover:shadow-sm ${
                                            isUploadingImage 
                                              ? 'border-blue-300 bg-blue-50/50 cursor-not-allowed' 
                                              : 'border-gray-300 focus-within:border-[#6812F7] hover:border-[#6812F7] hover:bg-blue-50/30'
                                          }`}>
                                            <div className="text-center">
                                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 transition-colors ${
                                                isUploadingImage
                                                  ? 'bg-blue-200 animate-pulse'
                                                  : 'bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200'
                                              }`}>
                                                {isUploadingImage ? (
                                                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                                ) : (
                                                  <Image className="w-6 h-6 text-blue-600" />
                                                )}
                                              </div>
                                              <p className="text-sm font-medium text-gray-700 mb-1">
                                                {isUploadingImage ? 'Uploading image...' : 'Click to upload or drag & drop'}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {isUploadingImage ? 'Please wait...' : 'Supports JPG, PNG, WebP up to 2MB'}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {newBlockImagePreview && (
                                        <div className="flex-shrink-0">
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                                          <div className="relative w-24 h-24">
                                            <img
                                              src={newBlockImagePreview}
                                              alt="Preview"
                                              className="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                            />
                                            <button
                                              type="button"
                                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                              onClick={() => {
                                                setNewBlockImagePreview('')
                                                setNewBlockImage('')
                                                setNewBlockImageFile(null)
                                                setIsUploadingImage(false)
                                              }}
                                            >
                                              ×
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* OR Divider */}
                                    <div className="relative">
                                      <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                      </div>
                                      <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">OR</span>
                                      </div>
                                    </div>
                                    
                                    {/* URL Input */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                      <Input 
                                        placeholder="Enter image URL (https://...)" 
                                        value={newBlockImage}
                                        onChange={(e) => {
                                          setNewBlockImage(e.target.value)
                                          setNewBlockImagePreview(e.target.value)
                                          setNewBlockImageFile(null)
                                          setIsUploadingImage(false)
                                        }}
                                        className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Image Details */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input 
                                      placeholder="Alt text..." 
                                      value={newBlockAlt}
                                      onChange={(e) => setNewBlockAlt(e.target.value)}
                                    />
                                    <Input 
                                      placeholder="Caption..." 
                                      value={newBlockCaption}
                                      onChange={(e) => setNewBlockCaption(e.target.value)}
                                    />
                                  </div>
                                </div>
                              ) : newBlockType === 'imageGrid' ? (
                                <div className="space-y-2">
                                  <div className="flex space-x-2">
                                    <Input 
                                      placeholder="Number of columns..." 
                                      type="number"
                                      min="2"
                                      max="4"
                                      value={newBlockColumns}
                                      onChange={(e) => setNewBlockColumns(parseInt(e.target.value) || 2)}
                                      className="w-32"
                                    />
                                    <Input 
                                      placeholder="Image URL..." 
                                      value={newBlockImage}
                                      onChange={(e) => setNewBlockImage(e.target.value)}
                                      className="flex-1"
                                    />
                                  </div>
                                  <Input 
                                    placeholder="Alt text..." 
                                    value={newBlockAlt}
                                    onChange={(e) => setNewBlockAlt(e.target.value)}
                                  />
                                </div>
                              ) : (
                                <Textarea 
                                  placeholder="Paragraph content..." 
                                  rows={3}
                                  value={newBlockContent}
                                  onChange={(e) => setNewBlockContent(e.target.value)}
                                />
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              <Button 
                                onClick={handleAddContentBlock}
                                className="bg-[#6812F7] hover:bg-[#5a0fd4]"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Block
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Content Blocks List */}
                        {contentBlocks.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700">Content Blocks ({contentBlocks.length})</h4>
                            <div className="space-y-2">
                              {contentBlocks
                                .sort((a, b) => a.order - b.order)
                                .map((block, index) => (
                                <div key={block.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                      {block.type === 'heading' && <FileText className="w-4 h-4 text-blue-600" />}
                                      {block.type === 'paragraph' && <FileText className="w-4 h-4 text-blue-600" />}
                                      {block.type === 'image' && <Image className="w-4 h-4 text-blue-600" />}
                                      {block.type === 'imageGrid' && <Image className="w-4 h-4 text-blue-600" />}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-gray-900">
                                        {block.type === 'heading' ? `H${block.level}` : block.type}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        Order: {block.order}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">
                                      {block.type === 'image' || block.type === 'imageGrid' 
                                        ? `Image: ${block.src || 'No URL'}` 
                                        : block.content || 'No content'
                                      }
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        const newOrder = Math.max(0, index - 1)
                                        handleReorderContentBlocks(index, newOrder)
                                      }}
                                      disabled={index === 0}
                                    >
                                      ↑
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        const newOrder = Math.min(contentBlocks.length - 1, index + 1)
                                        handleReorderContentBlocks(index, newOrder)
                                      }}
                                      disabled={index === contentBlocks.length - 1}
                                    >
                                      ↓
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => handleRemoveContentBlock(block.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingProject(null)
                          setProjectForm({
                            title: '',
                            description: '',
                            headerImage: '',
                            challenge: '',
                            solution: '',
                            timeline: '',
                            teamSize: '',
                            status: 'planning',
                            categoryId: '',
                            technologies: [],
                            results: [],
                            testimonial: { quote: '', author: '', position: '' }
                          })
                          setImagePreview('')
                          setContentBlocks([])
                          setProjectDialogOpen(false)
                        }}
                        className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </Button>
                      {editingProject ? (
                        <Button 
                          className="bg-[#6812F7] hover:bg-[#5a0fd4] px-6 py-2 text-white font-medium transition-all duration-200 hover:shadow-lg"
                          onClick={handleUpdateProject}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Update Project
                        </Button>
                      ) : (
                        <Button 
                          className="bg-[#6812F7] hover:bg-[#5a0fd4] px-6 py-2 text-white font-medium transition-all duration-200 hover:shadow-lg"
                          onClick={handleCreateProject}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Project
                        </Button>
                      )}
                    </div>
            </div>
          </DialogContent>
        </Dialog>
            </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
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
            <option value="completed">Completed</option>
            <option value="planning">Planning</option>
                <option value="on-hold">On Hold</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
          </select>
        </div>
      </div>

          {/* Projects Display */}
          {viewMode === 'grid' ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
                    <div className="w-full h-32 bg-gradient-to-br from-[#6812F7]/20 to-[#9253F0]/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      {project.headerImage ? (
                        <img 
                          src={project.headerImage} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">{project.category.icon}</span>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className={`${getStatusColor(project.status)} flex items-center gap-1`}>
                          {getStatusIcon(project.status)}
                          {project.status}
                        </Badge>
                      </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{project.title}</h3>
                </div>
                
                      <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
                
                <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          style={{ borderColor: project.category.color, color: project.category.color }}
                          className="flex items-center gap-1"
                        >
                          <span>{project.category.icon}</span>
                          {project.category.name}
                        </Badge>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0"
                      onClick={() => handlePreviewProject(project.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                          <Button 
                            size="sm" 
                            className="h-8 w-8 p-0 bg-[#6812F7] hover:bg-[#5a0fd4]"
                            onClick={() => handleEditProject(project)}
                          >
                      <Edit className="w-4 h-4" />
                    </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                      {/* Project Details */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {project.timeline || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {project.teamSize || 'N/A'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Code className="w-3 h-3" />
                            {project.technologies.length} tech
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {project.results.length} results
                          </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Team Size</TableHead>
                        <TableHead>Technologies</TableHead>
                        <TableHead>Results</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="font-medium text-gray-900 truncate">{project.title}</p>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              style={{ borderColor: project.category.color, color: project.category.color }}
                              className="flex items-center gap-1 w-fit"
                            >
                              <span>{project.category.icon}</span>
                              {project.category.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${getStatusColor(project.status)} flex items-center gap-1 w-fit`}>
                              {getStatusIcon(project.status)}
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {project.timeline || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              {project.teamSize || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Code className="w-4 h-4" />
                              {project.technologies.length}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Target className="w-4 h-4" />
                              {project.results.length}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {new Date(project.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePreviewProject(project.id)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-[#6812F7] hover:bg-[#5a0fd4]"
                                onClick={() => handleEditProject(project)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteProject(project.id)}
                              >
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
          )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first project'
            }
          </p>
              {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
            <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Project Categories</h3>
              <p className="text-sm text-gray-600">Manage project categories and organization</p>
            </div>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#6812F7] hover:bg-[#5a0fd4]"
                  onClick={() => {
                    setEditingCategory(null)
                    setCategoryForm({
                      name: '',
                      slug: '',
                      description: '',
                      color: '#6812F7',
                      icon: '📁',
                      featured: false,
                      sortOrder: 0,
                      status: 'active'
                    })
                    setCategoryDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {editingCategory ? (
                      <>
                        <Edit className="w-6 h-6 text-[#6812F7]" />
                        Edit Category
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6 text-[#6812F7]" />
                        Create New Category
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2">
                    {editingCategory ? 'Update the category details and settings' : 'Create a new project category for organizing your portfolio'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-6">
                  <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Folder className="w-4 h-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Category Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <Input 
                          placeholder="Category name" 
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <Input 
                          placeholder="📁" 
                          value={categoryForm.icon}
                          onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <Textarea 
                        placeholder="Category description" 
                        rows={3}
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="#6812F7" 
                            value={categoryForm.color}
                            onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                            className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                          />
                          <div 
                            className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center"
                            style={{ backgroundColor: categoryForm.color }}
                          >
                            <span className="text-white text-sm font-bold">A</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                        <Input 
                          type="number"
                          placeholder="0" 
                          value={categoryForm.sortOrder}
                          onChange={(e) => setCategoryForm({...categoryForm, sortOrder: parseInt(e.target.value) || 0})}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="featured" 
                          checked={categoryForm.featured}
                          onChange={(e) => setCategoryForm({...categoryForm, featured: e.target.checked})}
                          className="w-4 h-4 text-[#6812F7] border-gray-300 rounded focus:ring-[#6812F7]"
                        />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Category</label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                          value={categoryForm.status}
                          onChange={(e) => setCategoryForm({...categoryForm, status: e.target.value as 'active' | 'inactive'})}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingCategory(null)
                      setCategoryForm({
                        name: '',
                        slug: '',
                        description: '',
                        color: '#6812F7',
                        icon: '📁',
                        featured: false,
                        sortOrder: 0,
                        status: 'active'
                      })
                      setCategoryDialogOpen(false)
                    }}
                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Button>
                  {editingCategory ? (
                    <Button 
                      className="bg-[#6812F7] hover:bg-[#5a0fd4] px-6 py-2 text-white font-medium transition-all duration-200 hover:shadow-lg"
                      onClick={handleUpdateCategory}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Update Category
                    </Button>
                  ) : (
                    <Button 
                      className="bg-[#6812F7] hover:bg-[#5a0fd4] px-6 py-2 text-white font-medium transition-all duration-200 hover:shadow-lg"
                      onClick={handleCreateCategory}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Category
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    {category.featured && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Projects:</span>
                      <span className="text-sm font-medium">{projects.filter(p => p.category.id === category.id).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Color:</span>
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium">{category.color}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant="outline" className={category.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                        {category.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Analytics</h3>
              <p className="text-sm text-gray-600">Insights and metrics for your portfolio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Project Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['completed', 'active', 'planning', 'on-hold'].map(status => {
                    const count = projects.filter(p => p.status === status).length
                    const percentage = (count / projects.length) * 100
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{status.replace('-', ' ')}</span>
                          <span>{count} projects ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getStatusColor(status).split(' ')[0]}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  Category Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map(category => {
                    const count = projects.filter(p => p.category.id === category.id).length
                    const percentage = (count / projects.length) * 100
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            {category.name}
                          </span>
                          <span>{count} projects ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Technologies</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projects.reduce((sum, project) => sum + project.technologies.length, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Results</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projects.reduce((sum, project) => sum + project.results.length, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Testimonials</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projects.filter(p => p.clientTestimonial).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
