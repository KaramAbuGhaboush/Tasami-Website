'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardChartsProps {
  stats: {
    totalProjects: number
    totalBlogArticles: number
    totalContactMessages: number
    totalEmployees: number
    totalTestimonials: number
    newMessagesThisWeek: number
    publishedArticles: number
    activeEmployees: number
  }
}

function DashboardCharts({ stats }: DashboardChartsProps) {
  // Data for the bar chart
  const barChartData = [
    { name: 'Projects', value: stats.totalProjects, color: '#6812F7' },
    { name: 'Articles', value: stats.totalBlogArticles, color: '#9253F0' },
    { name: 'Messages', value: stats.totalContactMessages, color: '#3B82F6' },
    { name: 'Employees', value: stats.totalEmployees, color: '#10B981' },
    { name: 'Testimonials', value: stats.totalTestimonials, color: '#F59E0B' }
  ]

  // Data for the pie chart (Article status)
  const pieChartData = [
    { name: 'Published', value: stats.publishedArticles, color: '#10B981' },
    { name: 'Draft', value: stats.totalBlogArticles - stats.publishedArticles, color: '#F59E0B' }
  ]

  const maxValue = Math.max(...barChartData.map(item => item.value))

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="text-2xl mr-3">📊</span>
            Content Overview
          </CardTitle>
          <CardDescription>Total counts across all content types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 space-y-4">
            {barChartData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-3">🥧</span>
              Article Status
            </CardTitle>
            <CardDescription>Published vs Draft articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 space-y-4">
              {pieChartData.map((item, index) => {
                const percentage = stats.totalBlogArticles > 0 ? (item.value / stats.totalBlogArticles) * 100 : 0
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-3">📈</span>
              Activity Summary
            </CardTitle>
            <CardDescription>Key metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.newMessagesThisWeek}</div>
                  <div className="text-sm text-blue-800">New Messages</div>
                  <div className="text-xs text-blue-600">This Week</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.activeEmployees}</div>
                  <div className="text-sm text-green-800">Active</div>
                  <div className="text-xs text-green-600">Employees</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Content Ratio</span>
                  <span className="text-sm font-bold text-gray-900">
                    {stats.totalBlogArticles > 0 ? ((stats.publishedArticles / stats.totalBlogArticles) * 100).toFixed(1) : 0}% Published
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Team Efficiency</span>
                  <span className="text-sm font-bold text-gray-900">
                    {stats.totalEmployees > 0 ? ((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1) : 0}% Active
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="text-2xl mr-3">🎯</span>
            Performance Metrics
          </CardTitle>
          <CardDescription>Key performance indicators and ratios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalBlogArticles > 0 ? Math.round((stats.publishedArticles / stats.totalBlogArticles) * 100) : 0}%
              </div>
              <div className="text-sm text-blue-800 font-medium">Publish Rate</div>
              <div className="text-xs text-blue-600">Articles published</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-3xl font-bold text-green-600">
                {stats.totalEmployees > 0 ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0}%
              </div>
              <div className="text-sm text-green-800 font-medium">Active Rate</div>
              <div className="text-xs text-green-600">Team members active</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalContactMessages > 0 ? Math.round((stats.newMessagesThisWeek / stats.totalContactMessages) * 100) : 0}%
              </div>
              <div className="text-sm text-purple-800 font-medium">Weekly Growth</div>
              <div className="text-xs text-purple-600">New messages this week</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="text-3xl font-bold text-orange-600">
                {stats.totalProjects > 0 ? Math.round((stats.totalTestimonials / stats.totalProjects) * 100) : 0}%
              </div>
              <div className="text-sm text-orange-800 font-medium">Success Rate</div>
              <div className="text-xs text-orange-600">Testimonials per project</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardCharts