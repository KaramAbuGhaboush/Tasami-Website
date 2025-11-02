'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBlogAdmin, BlogArticle, BlogCategory, BlogAuthor } from '@/hooks/useBlogAdmin'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { 
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  BookOpen,
  Users,
  Folder,
  Settings,
  Image,
  Clock,
  Star,
  Eye as EyeIcon,
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react'

export function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('articles')
  
  // Form states
  const [articleForm, setArticleForm] = useState({
    title: '',
    titleAr: '',
    excerpt: '',
    excerptAr: '',
    content: '',
    contentAr: '',
    image: '',
    readTime: '',
    featured: false,
    status: 'draft' as 'draft' | 'published' | 'review',
    tags: [] as string[],
    authorId: '',
    categoryId: '',
    seoTitle: '',
    seoDescription: '',
    relatedArticles: [] as string[]
  })
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    color: '#6812F7',
    icon: '📝',
    featured: false,
    seoTitle: '',
    seoTitleAr: '',
    seoDescription: '',
    seoDescriptionAr: ''
  })
  
  const [authorForm, setAuthorForm] = useState({
    name: '',
    nameAr: '',
    email: '',
    role: '',
    roleAr: '',
    avatar: '',
    bio: '',
    bioAr: '',
    expertise: [] as string[],
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
      website: ''
    }
  })

  // Edit states
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [editingAuthor, setEditingAuthor] = useState<BlogAuthor | null>(null)
  
  // Dialog open states
  const [articleDialogOpen, setArticleDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false)
  
  // Form input states
  const [tagInput, setTagInput] = useState('')
  const [relatedArticleInput, setRelatedArticleInput] = useState('')
  const [expertiseInput, setExpertiseInput] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [relatedArticleSearch, setRelatedArticleSearch] = useState('')
  const [showRelatedDropdown, setShowRelatedDropdown] = useState(false)
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write')

  // Use the blog admin hook
  const {
    articles,
    articlesLoading,
    articlesError,
    categories,
    categoriesLoading,
    categoriesError,
    authors,
    authorsLoading,
    authorsError,
    createArticle,
    updateArticle,
    deleteArticle,
    createCategory,
    updateCategory,
    deleteCategory,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    refreshAll
  } = useBlogAdmin()

  // Filter functions
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus
    const matchesCategory = filterCategory === 'all' || article.category.name === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700 border-green-200'
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'review': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getFeaturedColor = (featured: boolean) => {
    return featured ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-700 border-gray-200'
  }

  // Form handlers
  const handleCreateArticle = async () => {
    if (!articleForm.title || !articleForm.excerpt || !articleForm.content || !articleForm.authorId || !articleForm.categoryId) {
      alert('Please fill in all required fields')
      return
    }
    
    const success = await createArticle(articleForm)
    if (success) {
      setArticleForm({
        title: '',
        titleAr: '',
        excerpt: '',
        excerptAr: '',
        content: '',
        contentAr: '',
        image: '',
        readTime: '',
        featured: false,
        status: 'draft',
        tags: [],
        authorId: '',
        categoryId: '',
        seoTitle: '',
        seoDescription: '',
        relatedArticles: []
      })
      setImagePreview('')
      setTagInput('')
      setRelatedArticleInput('')
      setRelatedArticleSearch('')
      setShowRelatedDropdown(false)
      setArticleDialogOpen(false)
      alert('Article created successfully!')
    } else {
      alert('Failed to create article')
    }
  }

  const handleEditArticle = (article: BlogArticle) => {
    setEditingArticle(article)
    setArticleForm({
      title: article.title,
      titleAr: (article as any).titleAr || '',
      excerpt: article.excerpt,
      excerptAr: (article as any).excerptAr || '',
      content: article.content,
      contentAr: (article as any).contentAr || '',
      image: article.image || '',
      readTime: article.readTime,
      featured: article.featured,
      status: article.status,
      tags: article.tags,
      authorId: article.author.id,
      categoryId: article.category.id,
      seoTitle: (article as any).seoTitle || '',
      seoDescription: (article as any).seoDescription || '',
      relatedArticles: article.relatedArticles || []
    })
    setImagePreview(article.image || '')
    setArticleDialogOpen(true)
  }

  const handleUpdateArticle = async () => {
    if (!editingArticle) return
    
    if (!articleForm.title || !articleForm.excerpt || !articleForm.content || !articleForm.authorId || !articleForm.categoryId) {
      alert('Please fill in all required fields')
      return
    }
    
    const success = await updateArticle(editingArticle.id, articleForm)
    if (success) {
      setEditingArticle(null)
      setArticleForm({
        title: '',
        titleAr: '',
        excerpt: '',
        excerptAr: '',
        content: '',
        contentAr: '',
        image: '',
        readTime: '',
        featured: false,
        status: 'draft',
        tags: [],
        authorId: '',
        categoryId: '',
        seoTitle: '',
        seoDescription: '',
        relatedArticles: []
      })
      setImagePreview('')
      setTagInput('')
      setRelatedArticleInput('')
      setRelatedArticleSearch('')
      setShowRelatedDropdown(false)
      setArticleDialogOpen(false)
      alert('Article updated successfully!')
    } else {
      alert('Failed to update article')
    }
  }

  const handleCreateCategory = async () => {
    if (!categoryForm.name) {
      alert('Please fill in the category name')
      return
    }
    
    const success = await createCategory(categoryForm)
    if (success) {
      setCategoryForm({
        name: '',
        nameAr: '',
        description: '',
        descriptionAr: '',
        color: '#6812F7',
        icon: '📝',
        featured: false,
        seoTitle: '',
        seoTitleAr: '',
        seoDescription: '',
        seoDescriptionAr: ''
      })
      setCategoryDialogOpen(false)
      alert('Category created successfully!')
    } else {
      alert('Failed to create category')
    }
  }

  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      nameAr: (category as any).nameAr || '',
      description: category.description,
      descriptionAr: (category as any).descriptionAr || '',
      color: category.color,
      icon: category.icon,
      featured: category.featured,
      seoTitle: category.seoTitle,
      seoTitleAr: (category as any).seoTitleAr || '',
      seoDescription: category.seoDescription,
      seoDescriptionAr: (category as any).seoDescriptionAr || ''
    })
    setCategoryDialogOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    
    if (!categoryForm.name) {
      alert('Please fill in the category name')
      return
    }
    
    const success = await updateCategory(editingCategory.id, categoryForm)
    if (success) {
      setEditingCategory(null)
      setCategoryForm({
        name: '',
        nameAr: '',
        description: '',
        descriptionAr: '',
        color: '#6812F7',
        icon: '📝',
        featured: false,
        seoTitle: '',
        seoTitleAr: '',
        seoDescription: '',
        seoDescriptionAr: ''
      })
      setCategoryDialogOpen(false)
      alert('Category updated successfully!')
    } else {
      alert('Failed to update category')
    }
  }

  const handleCreateAuthor = async () => {
    if (!authorForm.name || !authorForm.email) {
      alert('Please fill in the required fields')
      return
    }
    
    const success = await createAuthor(authorForm)
    if (success) {
      setAuthorForm({
        name: '',
        nameAr: '',
        email: '',
        role: '',
        roleAr: '',
        avatar: '',
        bio: '',
        bioAr: '',
        expertise: [],
        socialLinks: {
          twitter: '',
          linkedin: '',
          github: '',
          website: ''
        }
      })
      setExpertiseInput('')
      setAuthorDialogOpen(false)
      alert('Author created successfully!')
    } else {
      alert('Failed to create author')
    }
  }

  const handleEditAuthor = (author: BlogAuthor) => {
    setEditingAuthor(author)
    setAuthorForm({
      name: author.name,
      nameAr: (author as any).nameAr || '',
      email: author.email,
      role: author.role,
      roleAr: (author as any).roleAr || '',
      avatar: author.avatar,
      bio: author.bio,
      expertise: author.expertise,
      socialLinks: {
        twitter: author.socialLinks?.twitter || '',
        linkedin: author.socialLinks?.linkedin || '',
        github: author.socialLinks?.github || '',
        website: (author.socialLinks as any)?.website || ''
      }
    })
    setAuthorDialogOpen(true)
  }

  const handleUpdateAuthor = async () => {
    if (!editingAuthor) return
    
    if (!authorForm.name || !authorForm.email) {
      alert('Please fill in the required fields')
      return
    }
    
    const success = await updateAuthor(editingAuthor.id, authorForm)
    if (success) {
      setEditingAuthor(null)
      setAuthorForm({
        name: '',
        nameAr: '',
        email: '',
        role: '',
        roleAr: '',
        avatar: '',
        bio: '',
        bioAr: '',
        expertise: [],
        socialLinks: {
          twitter: '',
          linkedin: '',
          github: '',
          website: ''
        }
      })
      setExpertiseInput('')
      setAuthorDialogOpen(false)
      alert('Author updated successfully!')
    } else {
      alert('Failed to update author')
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      const success = await deleteArticle(id)
      if (success) {
        alert('Article deleted successfully!')
      } else {
        alert('Failed to delete article')
      }
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const success = await deleteCategory(id)
      if (success) {
        alert('Category deleted successfully!')
      } else {
        alert('Failed to delete category')
      }
    }
  }

  const handleDeleteAuthor = async (id: string) => {
    if (confirm('Are you sure you want to delete this author?')) {
      const result = await deleteAuthor(id)
      if (result.success) {
        alert('Author deleted successfully!')
      } else {
        alert(result.message || 'Failed to delete author')
      }
    }
  }

  // View/Show handlers
  const handleViewArticle = (article: BlogArticle) => {
    // Open article in new tab or show preview
    const articleUrl = `/article/${article.slug}`
    window.open(articleUrl, '_blank')
  }

  const handleViewCategory = (category: BlogCategory) => {
    // Show category details or filter articles by category
    alert(`Category: ${category.name}\nDescription: ${category.description}\nColor: ${category.color}\nFeatured: ${category.featured ? 'Yes' : 'No'}`)
  }

  const handleViewAuthor = (author: BlogAuthor) => {
    // Show author details
    alert(`Author: ${author.name}\nEmail: ${author.email}\nRole: ${author.role}\nBio: ${author.bio}\nExpertise: ${author.expertise.join(', ')}`)
  }

  // Form helper functions
  const handleAddTag = () => {
    if (tagInput.trim() && !articleForm.tags.includes(tagInput.trim())) {
      setArticleForm({
        ...articleForm,
        tags: [...articleForm.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setArticleForm({
      ...articleForm,
      tags: articleForm.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleAddRelatedArticle = () => {
    if (relatedArticleInput.trim() && !articleForm.relatedArticles.includes(relatedArticleInput.trim())) {
      setArticleForm({
        ...articleForm,
        relatedArticles: [...articleForm.relatedArticles, relatedArticleInput.trim()]
      })
      setRelatedArticleInput('')
    }
  }

  const handleRemoveRelatedArticle = (articleToRemove: string) => {
    setArticleForm({
      ...articleForm,
      relatedArticles: articleForm.relatedArticles.filter(article => article !== articleToRemove)
    })
  }

  const handleSelectRelatedArticle = (article: BlogArticle) => {
    if (!articleForm.relatedArticles.includes(article.id)) {
      setArticleForm({
        ...articleForm,
        relatedArticles: [...articleForm.relatedArticles, article.id]
      })
    }
    setRelatedArticleSearch('')
    setShowRelatedDropdown(false)
  }

  const filteredRelatedArticles = articles.filter(article => 
    article.id !== editingArticle?.id && // Don't show current article
    article.title.toLowerCase().includes(relatedArticleSearch.toLowerCase()) &&
    !articleForm.relatedArticles.includes(article.id) // Don't show already selected
  )

  const handleAddExpertise = () => {
    if (expertiseInput.trim() && !authorForm.expertise.includes(expertiseInput.trim())) {
      setAuthorForm({
        ...authorForm,
        expertise: [...authorForm.expertise, expertiseInput.trim()]
      })
      setExpertiseInput('')
    }
  }

  const handleRemoveExpertise = (expertiseToRemove: string) => {
    setAuthorForm({
      ...authorForm,
      expertise: authorForm.expertise.filter(expertise => expertise !== expertiseToRemove)
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setArticleForm({ ...articleForm, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  // Loading state
  if (articlesLoading || categoriesLoading || authorsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading blog data...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (articlesError || categoriesError || authorsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">
            {articlesError || categoriesError || authorsError}
          </p>
          <Button onClick={refreshAll} className="bg-[#6812F7] hover:bg-[#5a0fd4]">
            Try Again
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
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{articles.filter(a => a.status === 'published').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{articles.filter(a => a.status === 'draft').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{articles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600">Manage articles, categories, and authors</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="authors" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Authors
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Blog Articles</h3>
              <p className="text-sm text-gray-600">Manage your blog posts and content</p>
        </div>
        <Dialog open={articleDialogOpen} onOpenChange={setArticleDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#6812F7] hover:bg-[#5a0fd4]"
              onClick={() => {
                setEditingArticle(null)
                setArticleForm({
                  title: '',
                  excerpt: '',
                  content: '',
                  image: '',
                  readTime: '',
                  featured: false,
                  status: 'draft',
                  tags: [],
                  authorId: '',
                  categoryId: '',
                  seoTitle: '',
                  seoDescription: '',
                  relatedArticles: []
                })
                setImagePreview('')
                setTagInput('')
                setRelatedArticleInput('')
                setArticleDialogOpen(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
                  New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col w-[95vw] 2xl:max-w-[1400px]">
            <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {editingArticle ? (
                  <>
                    <Edit className="w-6 h-6 text-[#6812F7]" />
                    Edit Article
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6 text-[#6812F7]" />
                    Create New Article
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                {editingArticle ? 'Update the blog article with new content and settings' : 'Create a new blog article with rich content and SEO optimization'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-1">
              <div className="space-y-8 py-6">
              {/* Basic Information */}
              <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                </div>
                
                {/* Basic Info Guidelines */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-green-900">Quick Tips</h4>
                      <div className="text-sm text-green-800 space-y-1">
                        <p><strong>Title:</strong> Use clear, descriptive titles (50-60 characters for SEO)</p>
                        <p><strong>Author:</strong> Select the appropriate author for attribution</p>
                        <p><strong>Category:</strong> Choose the most relevant category for organization</p>
                        <p><strong>Read Time:</strong> Estimate based on content length (average 200 words per minute)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (English) *</label>
                    <Input 
                      placeholder="Enter a clear, descriptive article title..." 
                      value={articleForm.title}
                      onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                      className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">{articleForm.title.length}/60 characters (SEO optimized)</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic)</label>
                    <Input 
                      placeholder="أدخل عنوان المقال بالعربية..." 
                      value={articleForm.titleAr || ''}
                      onChange={(e) => setArticleForm({...articleForm, titleAr: e.target.value})}
                      className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                      dir="rtl"
                    />
                    <p className="text-xs text-gray-500 mt-1">{(articleForm.titleAr || '').length}/60 characters</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                      value={articleForm.authorId}
                      onChange={(e) => setArticleForm({...articleForm, authorId: e.target.value})}
                    >
                      <option value="">Select an author</option>
                      {authors.map(author => (
                        <option key={author.id} value={author.id}>{author.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                      value={articleForm.categoryId}
                      onChange={(e) => setArticleForm({...articleForm, categoryId: e.target.value})}
                    >
                      <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                      value={articleForm.status}
                      onChange={(e) => setArticleForm({...articleForm, status: e.target.value as 'draft' | 'published' | 'review'})}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="review">Review</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Draft: Save for later | Published: Live on site | Review: Needs approval</p>
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                    <Input 
                      placeholder="5 min read" 
                      value={articleForm.readTime}
                      onChange={(e) => setArticleForm({...articleForm, readTime: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Estimate: ~200 words per minute</p>
              </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={articleForm.featured}
                      onChange={(e) => setArticleForm({...articleForm, featured: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Article</span>
                  </label>
                  <p className="text-xs text-gray-500">Featured articles appear prominently on the blog homepage</p>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Image className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Featured Image</h3>
                </div>
                
                {/* Image Guidelines */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-blue-900">Image Guidelines</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Recommended Size:</strong> 1200x630 pixels (16:9 aspect ratio)</p>
                        <p><strong>Minimum Size:</strong> 800x400 pixels</p>
                        <p><strong>File Format:</strong> JPG, PNG, or WebP</p>
                        <p><strong>File Size:</strong> Under 2MB for best performance</p>
                        <p><strong>Quality:</strong> High resolution, clear and sharp images work best</p>
                      </div>
                    </div>
                  </div>
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
                              <div className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Choose File</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <Input 
                          placeholder="Or enter image URL (https://...)" 
                          value={articleForm.image}
                          onChange={(e) => {
                            setArticleForm({...articleForm, image: e.target.value})
                            setImagePreview(e.target.value)
                          }}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Use external URLs for images hosted elsewhere</p>
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
                            onError={(e) => {
                              console.error('Image failed to load:', imagePreview);
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', imagePreview);
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white shadow-md"
                              onClick={() => {
                                setImagePreview('')
                                setArticleForm({...articleForm, image: ''})
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>This preview shows how the image will appear in blog cards</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Content</h3>
                </div>
                
                {/* Content Guidelines */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-amber-900">Content Tips</h4>
                      <div className="text-sm text-amber-800 space-y-1">
                        <p><strong>Excerpt:</strong> Write a compelling 1-2 sentence summary that appears in blog cards</p>
                        <p><strong>Content:</strong> Use Markdown formatting for headings, bold, italic, lists, and more</p>
                        <p><strong>Formatting:</strong> Use # for headings, **bold**, *italic*, and - for lists</p>
                        <p><strong>Preview:</strong> Switch to Preview mode to see how your content will look</p>
                        <p><strong>SEO:</strong> Include relevant keywords naturally in your content</p>
                        <p><strong>Length:</strong> Aim for 300-2000 words for optimal engagement</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (English) *</label>
                  <Textarea 
                    placeholder="Write a compelling 1-2 sentence summary that will appear in blog cards and search results..." 
                    rows={3}
                    value={articleForm.excerpt}
                    onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">{articleForm.excerpt.length}/200 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (Arabic)</label>
                  <Textarea 
                    placeholder="اكتب ملخصاً مقنعاً من جملة إلى جملتين سيظهر في بطاقات المدونة..." 
                    rows={3}
                    value={articleForm.excerptAr || ''}
                    onChange={(e) => setArticleForm({...articleForm, excerptAr: e.target.value})}
                    dir="rtl"
                  />
                  <p className="text-xs text-gray-500 mt-1">{(articleForm.excerptAr || '').length}/200 characters</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Content *</label>
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setEditorMode('write')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          editorMode === 'write'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode('preview')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          editorMode === 'preview'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content (English) *</label>
                      {editorMode === 'write' ? (
                        <>
                          <Textarea 
                            placeholder="Write your article content in Markdown format...

# Heading 1

This is a paragraph with proper spacing.

## Heading 2

Another paragraph here.

**Bold text** and *italic text*

- Bullet point 1
- Bullet point 2

1. Numbered list item 1
2. Numbered list item 2

[Link text](https://example.com)

![Image alt text](https://example.com/image.jpg)

> This is a blockquote

```javascript
// Code block
const example = 'Hello World';
```" 
                        rows={15}
                        value={articleForm.content}
                        onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                        className="font-mono text-sm"
                      />
                          <div className="text-xs text-gray-500 space-y-1">
                            <p><strong>Markdown Tips:</strong></p>
                            <p>• Use # for headings, ## for subheadings, ### for smaller headings</p>
                            <p>• Use **bold** and *italic* for emphasis</p>
                            <p>• Use - or * for bullet lists, 1. for numbered lists</p>
                            <p>• Use [text](url) for links and ![alt](url) for images</p>
                            <p>• Use ```language for code blocks</p>
                            <p>• <strong>Important:</strong> Add blank lines between paragraphs for proper spacing</p>
                          </div>
                        </>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-4 min-h-[400px] bg-white">
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeHighlight]}
                            >
                              {articleForm.content || '*No content to preview*'}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{articleForm.content.length} characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content (Arabic)</label>
                      <Textarea 
                        placeholder="اكتب محتوى المقال بصيغة Markdown..." 
                        rows={15}
                        value={articleForm.contentAr || ''}
                        onChange={(e) => setArticleForm({...articleForm, contentAr: e.target.value})}
                        className="font-mono text-sm"
                        dir="rtl"
                      />
                      <p className="text-xs text-gray-500 mt-1">{(articleForm.contentAr || '').length} characters</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Add a tag" 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddTag} 
                      variant="outline"
                      className="border-[#6812F7] text-[#6812F7] hover:bg-[#6812F7] hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                  {articleForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {articleForm.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="flex items-center gap-1 bg-[#6812F7]/10 text-[#6812F7] border-[#6812F7]/20 hover:bg-[#6812F7]/20 transition-colors"
                        >
                          {tag}
                          <button 
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Related Articles */}
              <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Related Articles</h3>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <Input 
                          placeholder="Search for articles to relate..." 
                          value={relatedArticleSearch}
                          onChange={(e) => {
                            setRelatedArticleSearch(e.target.value)
                            setShowRelatedDropdown(true)
                          }}
                          onFocus={() => setShowRelatedDropdown(true)}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        />
                        {showRelatedDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredRelatedArticles.length > 0 ? (
                              filteredRelatedArticles.map((article) => (
                                <div
                                  key={article.id}
                                  onClick={() => handleSelectRelatedArticle(article)}
                                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                      {article.image ? (
                                        <img 
                                          src={article.image} 
                                          alt={article.title}
                                          className="w-12 h-12 object-cover rounded-lg"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                          <BookOpen className="w-6 h-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {article.title}
                                      </h4>
                                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {article.excerpt}
                                      </p>
                                      <div className="flex items-center space-x-2 mt-2">
                                        <Badge 
                                          variant="outline" 
                                          className="text-xs"
                                          style={{ borderColor: article.category.color, color: article.category.color }}
                                        >
                                          {article.category.name}
                                        </Badge>
                                        <span className="text-xs text-gray-400">
                                          {new Date(article.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                {relatedArticleSearch ? 'No articles found matching your search' : 'Start typing to search for articles'}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Button 
                        type="button" 
                        onClick={() => {
                          setRelatedArticleSearch('')
                          setShowRelatedDropdown(!showRelatedDropdown)
                        }}
                        variant="outline"
                        className="border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors"
                      >
                        <Search className="w-4 h-4 mr-1" />
                        Search
                      </Button>
                    </div>
                    {showRelatedDropdown && (
                      <div 
                        className="fixed inset-0 z-0" 
                        onClick={() => setShowRelatedDropdown(false)}
                      />
                    )}
                  </div>
                  
                  {articleForm.relatedArticles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Selected Articles:</h4>
                      <div className="flex flex-wrap gap-2">
                        {articleForm.relatedArticles.map((articleId) => {
                          const article = articles.find(a => a.id === articleId)
                          return article ? (
                            <div
                              key={articleId}
                              className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 rounded-lg p-2"
                            >
                              <div className="flex-shrink-0">
                                {article.image ? (
                                  <img 
                                    src={article.image} 
                                    alt={article.title}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-indigo-900 truncate">
                                  {article.title}
                                </p>
                                <p className="text-xs text-indigo-600">
                                  {article.category.name}
                                </p>
                              </div>
                              <button 
                                onClick={() => handleRemoveRelatedArticle(articleId)}
                                className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                    <Input 
                      placeholder="SEO optimized title" 
                      value={articleForm.seoTitle}
                      onChange={(e) => setArticleForm({...articleForm, seoTitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                    <Textarea 
                      placeholder="SEO meta description" 
                      rows={3}
                      value={articleForm.seoDescription}
                      onChange={(e) => setArticleForm({...articleForm, seoDescription: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              </div>
            </div>
            <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingArticle(null)
                        setArticleForm({
                          title: '',
                          excerpt: '',
                          content: '',
                          image: '',
                          readTime: '',
                          featured: false,
                          status: 'draft',
                          tags: [],
                          authorId: '',
                          categoryId: '',
                          seoTitle: '',
                          seoDescription: '',
                          relatedArticles: []
                        })
                        setImagePreview('')
                        setTagInput('')
                        setRelatedArticleInput('')
                        setArticleDialogOpen(false)
                      }}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Button>
                    {editingArticle ? (
                      <Button 
                        className="bg-[#6812F7] hover:bg-[#5a0fd4] px-6 py-2 text-white font-medium transition-all duration-200 hover:shadow-lg"
                        onClick={handleUpdateArticle}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update Article
                      </Button>
                    ) : (
                      <Button 
                        className="bg-[#6812F7] hover:bg-[#5a0fd4] px-6 py-2 text-white font-medium transition-all duration-200 hover:shadow-lg"
                        onClick={handleCreateArticle}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Article
                      </Button>
                    )}
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
                  placeholder="Search articles..."
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

          {/* Articles Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                      <TableHead>Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                  <TableHead>Views</TableHead>
                      <TableHead>Read Time</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow key={article.id}>
                    <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 truncate">{article.title}</p>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                              {article.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                          <Badge 
                            variant="outline" 
                            style={{ borderColor: article.category.color, color: article.category.color }}
                          >
                            {article.category.name}
                          </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                            <span className="text-lg mr-2">{article.author.avatar}</span>
                            <div>
                              <p className="font-medium text-sm">{article.author.name}</p>
                              <p className="text-xs text-gray-500">{article.author.role}</p>
                            </div>
                      </div>
                    </TableCell>
                    <TableCell>
                          <Badge variant="outline" className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getFeaturedColor(article.featured)}>
                            {article.featured ? <Star className="w-3 h-3 mr-1" /> : null}
                            {article.featured ? 'Featured' : 'Regular'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                            <EyeIcon className="w-4 h-4 mr-1 text-gray-400" />
                            {article.views.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-gray-400" />
                            {article.readTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(article.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewArticle(article)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-[#6812F7] hover:bg-[#5a0fd4]"
                          onClick={() => handleEditArticle(article)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteArticle(article.id)}
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

      {/* Empty State */}
          {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first article'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
            <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">
              <Plus className="w-4 h-4 mr-2" />
                  New Article
            </Button>
          )}
        </div>
      )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Blog Categories</h3>
              <p className="text-sm text-gray-600">Manage article categories and organization</p>
            </div>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#6812F7] hover:bg-[#5a0fd4]"
                  onClick={() => {
                    setEditingCategory(null)
                    setCategoryForm({
                      name: '',
                      description: '',
                      color: '#6812F7',
                      icon: '📝',
                      featured: false,
                      seoTitle: '',
                      seoDescription: ''
                    })
                    setCategoryDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col w-[90vw] 2xl:max-w-[1000px]">
                <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200">
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
                    {editingCategory ? 'Update the blog category settings and appearance' : 'Add a new blog category for organizing articles with custom styling'}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name (English) *</label>
                      <Input 
                        placeholder="Category name" 
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                        className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name (Arabic)</label>
                      <Input 
                        placeholder="اسم الفئة بالعربية" 
                        value={categoryForm.nameAr}
                        onChange={(e) => setCategoryForm({...categoryForm, nameAr: e.target.value})}
                        className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <Input 
                        placeholder="🎨" 
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                        className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label>
                    <Textarea 
                      placeholder="Category description" 
                      rows={3}
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabic)</label>
                    <Textarea 
                      placeholder="وصف الفئة بالعربية" 
                      rows={3}
                      value={categoryForm.descriptionAr}
                      onChange={(e) => setCategoryForm({...categoryForm, descriptionAr: e.target.value})}
                      dir="rtl"
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <Input 
                        placeholder="#6812F7" 
                        value={categoryForm.color}
                        onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                        className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                      />
                    </div>
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
                  </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingCategory(null)
                        setCategoryForm({
                          name: '',
                          description: '',
                          color: '#6812F7',
                          icon: '📝',
                          featured: false,
                          seoTitle: '',
                          seoDescription: ''
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
                      <span className="text-sm text-gray-600">Articles:</span>
                      <span className="text-sm font-medium">{articles.filter(a => a.category.id === category.id).length}</span>
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
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewCategory(category)}
                    >
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

        {/* Authors Tab */}
        <TabsContent value="authors" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Blog Authors</h3>
              <p className="text-sm text-gray-600">Manage blog authors and their profiles</p>
            </div>
            <Dialog open={authorDialogOpen} onOpenChange={setAuthorDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#6812F7] hover:bg-[#5a0fd4]"
                  onClick={() => {
                    setEditingAuthor(null)
                    setAuthorForm({
                      name: '',
                      email: '',
                      role: '',
                      avatar: '',
                      bio: '',
                      expertise: [],
                      socialLinks: {
                        twitter: '',
                        linkedin: '',
                        github: '',
                        website: ''
                      }
                    })
                    setExpertiseInput('')
                    setAuthorDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Author
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col w-[95vw] 2xl:max-w-[1200px]">
                <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200">
                  <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {editingAuthor ? (
                      <>
                        <Edit className="w-6 h-6 text-[#6812F7]" />
                        Edit Author
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6 text-[#6812F7]" />
                        Create New Author
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2">
                    {editingAuthor ? 'Update the blog author profile and social links' : 'Add a new blog author to your team with complete profile setup'}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-1">
                  <div className="space-y-8 py-6">
                  {/* Basic Information */}
                  <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name (English) *</label>
                        <Input 
                          placeholder="Author name" 
                          value={authorForm.name}
                          onChange={(e) => setAuthorForm({...authorForm, name: e.target.value})}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name (Arabic)</label>
                        <Input 
                          placeholder="اسم الكاتب بالعربية" 
                          value={authorForm.nameAr || ''}
                          onChange={(e) => setAuthorForm({...authorForm, nameAr: e.target.value})}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <Input 
                          placeholder="author@example.com" 
                          type="email"
                          value={authorForm.email}
                          onChange={(e) => setAuthorForm({...authorForm, email: e.target.value})}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role (English)</label>
                        <Input 
                          placeholder="Senior Writer" 
                          value={authorForm.role || ''}
                          onChange={(e) => setAuthorForm({...authorForm, role: e.target.value})}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role (Arabic)</label>
                        <Input 
                          placeholder="كاتب أول" 
                          value={authorForm.roleAr || ''}
                          onChange={(e) => setAuthorForm({...authorForm, roleAr: e.target.value})}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                        <Input 
                          placeholder="https://example.com/avatar.jpg" 
                          value={authorForm.avatar}
                          onChange={(e) => setAuthorForm({...authorForm, avatar: e.target.value})}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio (English)</label>
                      <Textarea 
                        placeholder="Author biography" 
                        rows={3}
                        value={authorForm.bio || ''}
                        onChange={(e) => setAuthorForm({...authorForm, bio: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio (Arabic)</label>
                      <Textarea 
                        placeholder="سيرة الكاتب بالعربية" 
                        rows={3}
                        value={authorForm.bioAr || ''}
                        onChange={(e) => setAuthorForm({...authorForm, bioAr: e.target.value})}
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Expertise */}
                  <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Tag className="w-4 h-4 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Expertise</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="Add expertise area" 
                          value={expertiseInput}
                          onChange={(e) => setExpertiseInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                          className="focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddExpertise} 
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      {authorForm.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {authorForm.expertise.map((expertise, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
                            >
                              {expertise}
                              <button 
                                onClick={() => handleRemoveExpertise(expertise)}
                                className="ml-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                        <Input 
                          placeholder="https://twitter.com/username" 
                          value={authorForm.socialLinks.twitter}
                          onChange={(e) => setAuthorForm({
                            ...authorForm, 
                            socialLinks: {...authorForm.socialLinks, twitter: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <Input 
                          placeholder="https://linkedin.com/in/username" 
                          value={authorForm.socialLinks.linkedin}
                          onChange={(e) => setAuthorForm({
                            ...authorForm, 
                            socialLinks: {...authorForm.socialLinks, linkedin: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                        <Input 
                          placeholder="https://github.com/username" 
                          value={authorForm.socialLinks.github}
                          onChange={(e) => setAuthorForm({
                            ...authorForm, 
                            socialLinks: {...authorForm.socialLinks, github: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                        <Input 
                          placeholder="https://example.com" 
                          value={authorForm.socialLinks.website}
                          onChange={(e) => setAuthorForm({
                            ...authorForm, 
                            socialLinks: {...authorForm.socialLinks, website: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
                <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingAuthor(null)
                        setAuthorForm({
                          name: '',
                          nameAr: '',
                          email: '',
                          role: '',
                          roleAr: '',
                          avatar: '',
                          bio: '',
                          bioAr: '',
                          expertise: [],
                          socialLinks: {
                            twitter: '',
                            linkedin: '',
                            github: '',
                            website: ''
                          }
                        })
                        setExpertiseInput('')
                        setAuthorDialogOpen(false)
                      }}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Button>
                    {editingAuthor ? (
                      <Button 
                        className="bg-[#6812F7] hover:bg-[#5a0fd4] px-6 py-2 text-white font-medium transition-all duration-200 hover:shadow-lg"
                        onClick={handleUpdateAuthor}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update Author
                      </Button>
                    ) : (
                      <Button 
                        className="bg-[#6812F7] hover:bg-[#5a0fd4] px-6 py-2 text-white font-medium transition-all duration-200 hover:shadow-lg"
                        onClick={handleCreateAuthor}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Author
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Authors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Card key={author.id}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">{author.avatar}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{author.name}</h3>
                      <p className="text-sm text-gray-600">{author.role}</p>
                      <p className="text-xs text-gray-500">{author.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{author.bio}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Expertise:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {author.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Articles:</span>
                      <span className={`text-sm ml-2 font-medium ${
                        articles.filter(a => a.author.id === author.id).length > 0 
                          ? 'text-red-600' 
                          : 'text-gray-600'
                      }`}>
                        {articles.filter(a => a.author.id === author.id).length}
                        {articles.filter(a => a.author.id === author.id).length > 0 && (
                          <span className="text-xs text-red-500 ml-1">(Cannot delete)</span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Joined:</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {new Date(author.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewAuthor(author)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditAuthor(author)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={`${
                        articles.filter(a => a.author.id === author.id).length > 0
                          ? 'text-gray-400 cursor-not-allowed opacity-50'
                          : 'text-red-600 hover:text-red-700'
                      }`}
                      disabled={articles.filter(a => a.author.id === author.id).length > 0}
                      onClick={() => handleDeleteAuthor(author.id)}
                      title={
                        articles.filter(a => a.author.id === author.id).length > 0
                          ? 'Cannot delete author with articles'
                          : 'Delete author'
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
