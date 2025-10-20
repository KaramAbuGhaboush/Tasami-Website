'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Calendar,
  User,
  Tag
} from 'lucide-react'

export function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const blogPosts = [
    { 
      id: 1, 
      title: 'AI Trends 2024: What to Expect', 
      excerpt: 'Exploring the latest trends in artificial intelligence and machine learning for 2024.',
      status: 'published', 
      category: 'AI/ML', 
      author: 'Mike Chen',
      publishDate: '2024-01-15',
      views: 1234,
      tags: ['AI', 'Machine Learning', 'Trends']
    },
    { 
      id: 2, 
      title: 'Building Scalable Web Applications', 
      excerpt: 'Best practices for creating web applications that can handle millions of users.',
      status: 'draft', 
      category: 'Web Development', 
      author: 'Sarah Johnson',
      publishDate: '2024-01-10',
      views: 856,
      tags: ['Web Development', 'Scalability', 'Performance']
    },
    { 
      id: 3, 
      title: 'The Future of Automation', 
      excerpt: 'How automation is transforming businesses and what it means for the future.',
      status: 'published', 
      category: 'Automation', 
      author: 'Alex Rodriguez',
      publishDate: '2024-01-08',
      views: 2103,
      tags: ['Automation', 'Business', 'Future']
    }
  ]

  const categories = ['AI/ML', 'Web Development', 'Automation', 'Design', 'Marketing', 'Technology']

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{blogPosts.filter(p => p.status === 'published').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{blogPosts.filter(p => p.status === 'draft').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{blogPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600">Create, edit, and manage your blog posts</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Write and publish a new blog post
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Input placeholder="Enter blog post title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent">
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <Textarea placeholder="Brief description of the post" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <Textarea placeholder="Write your blog post content here..." rows={10} />
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
              placeholder="Search blog posts..."
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
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{post.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {post.author}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        {post.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(post.publishDate).toLocaleDateString()}
                      </div>
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
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first blog post'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
            <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
