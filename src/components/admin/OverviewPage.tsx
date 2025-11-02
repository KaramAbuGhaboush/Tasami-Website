'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDashboardOverview } from '@/hooks/useDashboardOverview'
import { useAdmin } from '@/hooks/useAdmin'
import dynamic from 'next/dynamic'

const DashboardCharts = dynamic(() => import('./DashboardCharts'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6812F7]"></div></div>
})
import { 
  Plus,
  Edit,
  Eye,
  Search,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

export function OverviewPage() {
  const { stats, recentActivities, loading, error, refreshData } = useDashboardOverview()
  const { setActiveTab } = useAdmin()

  // Transform real data into display format
  const displayStats = stats ? [
    { 
      label: 'Total Projects', 
      value: stats.totalProjects.toString(), 
      change: stats.newMessagesThisWeek > 0 ? `${stats.newMessagesThisWeek} new this week` : 'No new activity', 
      trend: stats.newMessagesThisWeek > 0 ? 'up' : 'neutral',
      icon: '🚀',
      description: 'Portfolio projects',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      label: 'Published Articles', 
      value: stats.publishedArticles.toString(), 
      change: `${stats.totalBlogArticles - stats.publishedArticles} drafts`, 
      trend: 'neutral',
      icon: '📝',
      description: 'Published articles',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      label: 'Contact Messages', 
      value: stats.totalContactMessages.toString(), 
      change: stats.newMessagesThisWeek > 0 ? `${stats.newMessagesThisWeek} new this week` : 'No new messages', 
      trend: stats.newMessagesThisWeek > 0 ? 'up' : 'neutral',
      icon: '📧',
      description: 'Total inquiries',
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      label: 'Active Team Members', 
      value: stats.activeEmployees.toString(), 
      change: `${stats.totalEmployees - stats.activeEmployees} inactive`, 
      trend: 'neutral',
      icon: '👥',
      description: 'Active team members',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      label: 'Testimonials', 
      value: stats.totalTestimonials.toString(), 
      change: `${Math.round((stats.totalTestimonials / stats.totalProjects) * 100)}% per project`, 
      trend: 'neutral',
      icon: '⭐',
      description: 'Client testimonials',
      color: 'from-indigo-500 to-blue-600'
    },
  ] : []

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'portfolio':
        setActiveTab('portfolio')
        break
      case 'blog':
        setActiveTab('blog')
        break
      case 'users':
        setActiveTab('users')
        break
      case 'contact':
        setActiveTab('contact')
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6812F7]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900">Error Loading Dashboard</h2>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
        <Button onClick={refreshData} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] rounded-2xl p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-white/80 text-lg">Here&apos;s what&apos;s happening with your business today.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-right">
              <p className="text-white/60 text-sm">Dashboard Status</p>
              <p className="text-white font-semibold">Live Data</p>
              <Button 
                onClick={refreshData} 
                variant="outline" 
                size="sm" 
                className="mt-2 text-white border-white/20 hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayStats.map((stat, index) => (
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
                        : stat.trend === 'neutral'
                        ? 'bg-gray-100 text-gray-700 border-gray-200'
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
            <Button 
              onClick={() => handleQuickAction('portfolio')}
              className="h-20 flex-col space-y-2 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm">Add Project</span>
            </Button>
            <Button 
              onClick={() => handleQuickAction('blog')}
              variant="outline" 
              className="h-20 flex-col space-y-2 border-2 hover:bg-gray-50"
            >
              <Edit className="w-6 h-6" />
              <span className="text-sm">New Blog Post</span>
            </Button>
            <Button 
              onClick={() => handleQuickAction('users')}
              variant="outline" 
              className="h-20 flex-col space-y-2 border-2 hover:bg-gray-50"
            >
              <Eye className="w-6 h-6" />
              <span className="text-sm">Add Team Member</span>
            </Button>
            <Button 
              onClick={() => handleQuickAction('contact')}
              variant="outline" 
              className="h-20 flex-col space-y-2 border-2 hover:bg-gray-50"
            >
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
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={activity.id || index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                    activity.type === 'portfolio' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                    activity.type === 'blog' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                    activity.type === 'contact' ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
                    activity.type === 'users' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                    activity.type === 'testimonials' ? 'bg-gradient-to-br from-indigo-500 to-blue-600' :
                    'bg-gradient-to-br from-gray-500 to-gray-600'
                  }`}>
                    {activity.type === 'portfolio' ? '🚀' :
                     activity.type === 'blog' ? '📝' :
                     activity.type === 'contact' ? '📧' :
                     activity.type === 'users' ? '👥' :
                     activity.type === 'testimonials' ? '⭐' : '⚙️'}
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
                              {String(activity.value || activity.views || activity.role || activity.improvement || '')}
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
                          activity.status === 'published' ? 'border-green-200 text-green-700 bg-green-50' :
                          activity.status === 'new' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                          'border-gray-200 text-gray-700 bg-gray-50'
                        }`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activities found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API-Driven Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-3">📊</span>
              Content Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-800">Published Articles</span>
                <span className="text-lg font-bold text-green-600">{stats?.publishedArticles || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-800">Total Projects</span>
                <span className="text-lg font-bold text-blue-600">{stats?.totalProjects || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-800">Active Team Members</span>
                <span className="text-lg font-bold text-purple-600">{stats?.activeEmployees || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-3">📈</span>
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">New Messages This Week</span>
                <Badge variant="outline" className="text-xs">{stats?.newMessagesThisWeek || 0}</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Total Testimonials</span>
                <Badge variant="outline" className="text-xs">{stats?.totalTestimonials || 0}</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Total Contact Messages</span>
                <Badge variant="outline" className="text-xs">{stats?.totalContactMessages || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Section */}
      {stats && (
        <div className="mt-8">
          <DashboardCharts stats={stats} />
        </div>
      )}
    </div>
  )
}
