'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  Edit,
  Eye,
  Search
} from 'lucide-react'

export function OverviewPage() {
  const stats = [
    { 
      label: 'Total Revenue', 
      value: '$124,500', 
      change: '+18.2%', 
      trend: 'up',
      icon: '💰',
      description: 'Monthly recurring revenue',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      label: 'Active Projects', 
      value: '24', 
      change: '+12%', 
      trend: 'up',
      icon: '🚀',
      description: 'Currently in progress',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      label: 'Client Satisfaction', 
      value: '4.9/5', 
      change: '+0.3', 
      trend: 'up',
      icon: '⭐',
      description: 'Average rating',
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      label: 'Team Members', 
      value: '12', 
      change: '+2', 
      trend: 'up',
      icon: '👥',
      description: 'Active team members',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      label: 'Website Traffic', 
      value: '45.2K', 
      change: '+23%', 
      trend: 'up',
      icon: '📊',
      description: 'Monthly visitors',
      color: 'from-indigo-500 to-blue-600'
    },
    { 
      label: 'Conversion Rate', 
      value: '3.2%', 
      change: '+0.8%', 
      trend: 'up',
      icon: '🎯',
      description: 'Lead to client conversion',
      color: 'from-teal-500 to-green-600'
    },
  ]

  const recentActivities = [
    { 
      action: 'New client project "E-commerce Platform" started', 
      time: '2 hours ago', 
      type: 'portfolio',
      user: 'Sarah Johnson',
      status: 'active',
      value: '$15,000'
    },
    { 
      action: 'Blog post "AI Trends 2024" published', 
      time: '4 hours ago', 
      type: 'blog',
      user: 'Mike Chen',
      status: 'published',
      views: '1,234'
    },
    { 
      action: 'High-priority contact from TechCorp', 
      time: '6 hours ago', 
      type: 'contact',
      user: 'John Smith',
      status: 'urgent',
      value: 'Potential $50K project'
    },
    { 
      action: 'New team member "Alex Rodriguez" onboarded', 
      time: '8 hours ago', 
      type: 'users',
      user: 'HR Team',
      status: 'completed',
      role: 'Senior Developer'
    },
    { 
      action: 'Project "Mobile App" completed and delivered', 
      time: '1 day ago', 
      type: 'portfolio',
      user: 'Development Team',
      status: 'completed',
      value: '$25,000'
    },
    { 
      action: 'Website performance optimization completed', 
      time: '2 days ago', 
      type: 'maintenance',
      user: 'DevOps Team',
      status: 'completed',
      improvement: '+40% faster load times'
    },
  ]

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
}
