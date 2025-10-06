'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { 
  BarChart3, 
  Users, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Bell,
  Search,
  Filter
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const dashboardSections = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
    { id: 'about', name: 'About Us', icon: Users },
    { id: 'work', name: 'Work', icon: Settings },
    { id: 'blog', name: 'Blog', icon: FileText },
    { id: 'career', name: 'Career', icon: Briefcase },
    { id: 'contact', name: 'Contact', icon: MessageSquare },
    { id: 'users', name: 'Users', icon: Users },
  ]

  const stats = [
    { label: 'Total Projects', value: '24', change: '+12%' },
    { label: 'Blog Posts', value: '18', change: '+8%' },
    { label: 'Active Users', value: '1,234', change: '+15%' },
    { label: 'Contact Messages', value: '89', change: '+23%' },
  ]

  const recentActivities = [
    { action: 'New project added', time: '2 hours ago', type: 'portfolio' },
    { action: 'Blog post published', time: '4 hours ago', type: 'blog' },
    { action: 'Contact form submitted', time: '6 hours ago', type: 'contact' },
    { action: 'User registered', time: '8 hours ago', type: 'users' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {stat.change}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates across your dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                      <Badge variant="outline" className="text-[#6812F7] border-[#6812F7]">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'portfolio':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Portfolio Management</h2>
                <p className="text-gray-600">Manage your project portfolio</p>
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
            
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="w-full h-32 bg-gradient-to-br from-[#6812F7]/20 to-[#9253F0]/20 rounded-lg mb-4"></div>
                        <h3 className="font-semibold text-gray-900 mb-2">Project {item}</h3>
                        <p className="text-sm text-gray-600 mb-4">AI-Powered E-commerce Platform</p>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1 bg-[#6812F7] hover:bg-[#5a0fd4]">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">About Us Management</h2>
            <div className="luxury-card rounded-2xl p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                  <textarea 
                    className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                    placeholder="Enter company description..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                  <textarea 
                    className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                    placeholder="Enter mission statement..."
                  ></textarea>
                </div>
                <button className="btn-primary rounded-full">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )

      case 'work':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Work Management</h2>
            <div className="luxury-card rounded-2xl p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Work Item {item}</h3>
                        <p className="text-sm text-gray-600">Description of work item...</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-[#6812F7] text-white py-2 px-4 rounded-lg text-sm font-medium">
                          Edit
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'blog':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
              <button className="btn-primary rounded-full">
                + New Post
              </button>
            </div>
            <div className="luxury-card rounded-2xl p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Blog Post {item}</h3>
                        <p className="text-sm text-gray-600">Published 2 days ago</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-[#6812F7] text-white py-2 px-4 rounded-lg text-sm font-medium">
                          Edit
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'career':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Career Management</h2>
              <button className="btn-primary rounded-full">
                + Add Position
              </button>
            </div>
            <div className="luxury-card rounded-2xl p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Job Position {item}</h3>
                        <p className="text-sm text-gray-600">Full-time • Remote</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-[#6812F7] text-white py-2 px-4 rounded-lg text-sm font-medium">
                          Edit
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
            <div className="luxury-card rounded-2xl p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Contact Message {item}</h3>
                        <p className="text-sm text-gray-600">john@example.com • 2 hours ago</p>
                        <p className="text-sm text-gray-500 mt-1">Interested in your services...</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-[#6812F7] text-white py-2 px-4 rounded-lg text-sm font-medium">
                          Reply
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium">
                          Mark Read
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <p className="text-gray-600">Manage user accounts and permissions</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <TableRow key={item}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-gradient-to-br from-[#6812F7] to-[#9253F0] text-white">
                                U{item}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">User {item}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>user{item}@example.com</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Admin</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>2 hours ago</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F3FF] via-white to-[#DFC7FE]/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold gradient-text">
                Tasami Admin
              </Link>
              <Badge variant="outline">Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">Back to Site</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1 p-4">
                  {dashboardSections.map((section) => {
                    const IconComponent = section.icon
                    return (
                      <Button
                        key={section.id}
                        variant={activeTab === section.id ? "default" : "ghost"}
                        onClick={() => setActiveTab(section.id)}
                        className={`w-full justify-start ${
                          activeTab === section.id
                            ? 'bg-gradient-to-r from-[#6812F7] to-[#9253F0] text-white hover:from-[#5a0fd4] hover:to-[#7d42e6]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-3" />
                        {section.name}
                      </Button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
