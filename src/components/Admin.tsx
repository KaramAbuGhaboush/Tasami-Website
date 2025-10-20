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
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Bell,
  Search,
  Filter,
  Menu,
  X
} from 'lucide-react'
import { DashboardSection, Stat, Activity } from '@/hooks/useAdmin'

interface AdminProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  dashboardSections: DashboardSection[];
  stats: Stat[];
  recentActivities: Activity[];
}

export function Admin({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen, 
  dashboardSections, 
  stats, 
  recentActivities 
}: AdminProps) {
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] rounded-2xl p-8 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
                  <p className="text-white/80 text-lg">Here's what's happening with your business today.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="text-right">
                    <p className="text-white/60 text-sm">Last updated</p>
                    <p className="text-white font-semibold">2 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={`${
                            stat.trend === 'up' 
                              ? 'bg-green-100 text-green-700 border-green-200' 
                              : 'bg-red-100 text-red-700 border-red-200'
                          }`}
                        >
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-gray-600 font-medium">{stat.label}</p>
                      <p className="text-sm text-gray-500">{stat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks you might want to perform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col space-y-2 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Add Project</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2 border-2 hover:bg-gray-50">
                    <Edit className="w-6 h-6" />
                    <span className="text-sm">New Blog Post</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2 border-2 hover:bg-gray-50">
                    <Eye className="w-6 h-6" />
                    <span className="text-sm">Add Team Member</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2 border-2 hover:bg-gray-50">
                    <Search className="w-6 h-6" />
                    <span className="text-sm">View Messages</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Recent Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">📈</span>
                  Recent Activities
                </CardTitle>
                <CardDescription>Latest updates and important events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                        activity.type === 'portfolio' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                        activity.type === 'blog' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                        activity.type === 'contact' ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
                        activity.type === 'users' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                        'bg-gradient-to-br from-gray-500 to-gray-600'
                      }`}>
                        {activity.type === 'portfolio' ? '🚀' :
                         activity.type === 'blog' ? '📝' :
                         activity.type === 'contact' ? '📧' :
                         activity.type === 'users' ? '👥' : '⚙️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">{activity.action}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>👤 {activity.user}</span>
                              <span>🕒 {activity.time}</span>
                            </div>
                            {(activity.value || activity.views || activity.role || activity.improvement) && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {activity.value || activity.views || activity.role || activity.improvement}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              activity.status === 'urgent' ? 'border-red-200 text-red-700 bg-red-50' :
                              activity.status === 'active' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                              activity.status === 'completed' ? 'border-green-200 text-green-700 bg-green-50' :
                              'border-gray-200 text-gray-700 bg-gray-50'
                            }`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="text-2xl mr-3">📊</span>
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Website Speed</span>
                      <span className="text-lg font-bold text-green-600">98/100</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">SEO Score</span>
                      <span className="text-lg font-bold text-blue-600">92/100</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-800">Security Score</span>
                      <span className="text-lg font-bold text-purple-600">95/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Client meeting with TechCorp</span>
                      <Badge variant="outline" className="text-xs">Today 2PM</Badge>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Project milestone review</span>
                      <Badge variant="outline" className="text-xs">Tomorrow</Badge>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Team standup meeting</span>
                      <Badge variant="outline" className="text-xs">Daily 9AM</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'portfolio':
        return (
          <div className="space-y-6">
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
            
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="w-full h-32 bg-gradient-to-br from-[#6812F7]/20 to-[#9253F0]/20 rounded-lg mb-4"></div>
                        <h3 className="font-semibold text-gray-900 mb-2">Project {item}</h3>
                        <p className="text-sm text-gray-600 mb-4">AI-Powered E-commerce Platform</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button size="sm" className="flex-1 bg-[#6812F7] hover:bg-[#5a0fd4]">
                            <Edit className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">View</span>
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
                <div className="overflow-x-auto">
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
                </div>
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <Link href="/" className="text-xl font-bold gradient-text">
                Tasami Admin
              </Link>
              <Badge variant="outline" className="hidden sm:inline-flex">Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
                <Link href="/">Back to Site</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-72 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full bg-white border-r border-gray-200 shadow-lg lg:shadow-none">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Navigation
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <nav className="p-4 space-y-2">
              {dashboardSections.map((section) => {
                const IconComponent = section.icon
                return (
                  <Button
                    key={section.id}
                    variant={activeTab === section.id ? "default" : "ghost"}
                    onClick={() => {
                      setActiveTab(section.id)
                      setSidebarOpen(false) // Close mobile sidebar when item is selected
                    }}
                    className={`w-full justify-start px-3 ${
                      activeTab === section.id
                        ? 'bg-gradient-to-r from-[#6812F7] to-[#9253F0] text-white hover:from-[#5a0fd4] hover:to-[#7d42e6]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-3" />
                    <span>{section.name}</span>
                  </Button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
