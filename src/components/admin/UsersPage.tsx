'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Users,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Target,
  Clock4,
  FileText,
  RefreshCw,
  Settings,
  Activity,
  Loader2
} from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useNotification } from '@/hooks/useNotification'

// Types matching API schema
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'employee'
  isActive: boolean
  weeklyGoal: number
  createdAt: string
  updatedAt: string
  // Additional fields for UI
  phone?: string
  department?: string
  lastActive?: string
  avatar?: string
  currentWeekHours?: number
  goalProgress?: number
}

interface TimeEntry {
  id: string
  date: string
  hours: number
  minutes: number
  project: string
  description?: string
  userId: string
  createdAt: string
  updatedAt: string
}

interface TeamStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  adminUsers: number
  employeeUsers: number
  newUsersThisMonth: number
  usersMeetingGoals: number
}

interface TeamAnalytics {
  totalUsers: number
  activeUsers: number
  totalHours: number
  averageHoursPerUser: number
  goalAchievementRate: number
  usersMeetingGoals: number
  usersExceedingGoals: number
  usersBelowGoals: number
  period: {
    startDate: string
    endDate: string
  }
}

interface ProjectDistribution {
  project: string
  totalHours: number
  percentage: number
  userCount: number
}

export function UsersPage() {
  const { user, isAuthenticated } = useAuth()
  const { success, error: showError, warning: showWarning, confirm } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false)
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [actionUser, setActionUser] = useState<User | null>(null)
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Dynamic data state
  const [users, setUsers] = useState<User[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null)
  const [teamAnalytics, setTeamAnalytics] = useState<TeamAnalytics | null>(null)
  const [projectDistribution, setProjectDistribution] = useState<ProjectDistribution[]>([])
  
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: 'employee' as 'admin' | 'employee',
    isActive: true,
    weeklyGoal: 40,
    password: ''
  })

  const [goalForm, setGoalForm] = useState({
    weeklyGoal: 40
  })

  // Load data on component mount
  useEffect(() => {
    console.log('UsersPage mounted, user:', user, 'isAuthenticated:', isAuthenticated)
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Loading data...')
      console.log('API client:', apiClient)
      
      // Test a simple API call first
      try {
        const testResponse = await apiClient.getEmployees()
        console.log('Test API call result:', testResponse)
      } catch (testError) {
        console.error('Test API call failed:', testError)
      }
      
      // Load all data in parallel
      const [usersResponse, statsResponse, analyticsResponse, projectsResponse] = await Promise.all([
        apiClient.getEmployees(),
        apiClient.getTeamStats(),
        apiClient.getTeamAnalytics(),
        apiClient.getProjectDistribution()
      ])

      console.log('Users response:', usersResponse)

      if (usersResponse.success) {
        console.log('Setting users:', (usersResponse.data as any).items)
        
        // Get time entries for each employee individually
        const users = (usersResponse.data as any).items
        const allTimeEntries: any[] = []
        
        // Get time entries for each employee
        for (const user of users) {
          if (user.role === 'employee') {
            try {
              const timeEntriesResponse = await apiClient.getEmployeeTimeEntries(user.id, { filter: 'week' })
              if (timeEntriesResponse.success) {
                const userTimeEntries = (timeEntriesResponse.data as any).items || []
                allTimeEntries.push(...userTimeEntries)
              }
            } catch (error) {
              console.error(`Error getting time entries for user ${user.id}:`, error)
            }
          }
        }
        
        setTimeEntries(allTimeEntries)
        
        // Calculate progress for each user
        const mappedUsers = users.map((user: any) => {
          // Calculate current week hours for this user
          const userTimeEntries = Array.isArray(allTimeEntries) ? allTimeEntries.filter((entry: any) => entry.userId === user.id) : []
          const currentWeekHours = userTimeEntries.reduce((total: number, entry: any) => total + (entry.hours || 0), 0)
          const goalProgress = user.weeklyGoal > 0 ? Math.min((currentWeekHours / user.weeklyGoal) * 100, 100) : 0
          
          return {
            ...user,
            department: user.department || 'N/A',
            phone: user.phone || 'N/A',
            lastActive: user.lastActive || user.updatedAt,
            avatar: user.avatar || '',
            currentWeekHours,
            goalProgress
          }
        })
        setUsers(mappedUsers)
      } else {
        console.error('Users response failed:', usersResponse)
      }
      
      if (statsResponse.success) {
        // Map API response to our interface
        setTeamStats({
          totalUsers: statsResponse.data.totalUsers,
          activeUsers: statsResponse.data.activeUsers,
          inactiveUsers: (statsResponse.data as any).inactiveUsers,
          adminUsers: (statsResponse.data as any).adminUsers,
          employeeUsers: (statsResponse.data as any).employeeUsers,
          newUsersThisMonth: (statsResponse.data as any).newUsersThisMonth,
          usersMeetingGoals: (statsResponse.data as any).usersMeetingGoals
        })
      }
      
      if (analyticsResponse.success) {
        // Map API response to our interface
        setTeamAnalytics({
          totalUsers: analyticsResponse.data.totalUsers,
          activeUsers: analyticsResponse.data.activeUsers,
          totalHours: analyticsResponse.data.totalHours,
          averageHoursPerUser: analyticsResponse.data.averageHoursPerUser,
          goalAchievementRate: analyticsResponse.data.goalAchievementRate,
          usersMeetingGoals: (analyticsResponse.data as any).usersMeetingGoals,
          usersExceedingGoals: (analyticsResponse.data as any).usersExceedingGoals,
          usersBelowGoals: (analyticsResponse.data as any).usersBelowGoals,
          period: (analyticsResponse.data as any).period
        })
      }
      
      if (projectsResponse.success) {
        // Map API response to our interface
        setProjectDistribution(projectsResponse.data.projects.map((p: any) => ({
          project: p.project,
          totalHours: p.totalHours,
          percentage: p.percentage,
          userCount: p.userCount
        })))
      }
      
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please try again.')
      // Set empty arrays as fallback
      setUsers([])
      setTimeEntries([])
      setTeamStats(null)
      setTeamAnalytics(null)
      setProjectDistribution([])
    } finally {
      setIsLoading(false)
    }
  }



  const roles = ['admin', 'employee']
  const statuses = ['active', 'inactive']
  const departments = ['Engineering', 'Content', 'Marketing', 'Design', 'Sales', 'Operations']

  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' ? user.isActive : !user.isActive)
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-700 border-green-200' 
      : 'bg-red-100 text-red-700 border-red-200'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'employee': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`
  }

  const getGoalProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600'
    if (progress >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
    setIsUserDetailOpen(true)
  }

  const getUserTimeEntries = (userId: string) => {
    return timeEntries.filter(entry => entry.userId === userId)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      department: user.department || '',
      role: user.role,
      isActive: user.isActive,
      weeklyGoal: user.weeklyGoal,
      password: '' // Password not shown when editing
    })
    setIsEditUserOpen(true)
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setUserForm({
      name: '',
      email: '',
      phone: '',
      department: '',
      role: 'employee',
      isActive: true,
      weeklyGoal: 40,
      password: ''
    })
    setIsAddUserOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!userForm.name || !userForm.email) {
      showWarning('Name and email are required')
      return
    }

    // Validate password for new users
    if (!editingUser && !userForm.password) {
      showWarning('Password is required for new users')
      return
    }

    if (!editingUser && userForm.password.length < 6) {
      showWarning('Password must be at least 6 characters long')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userForm.email)) {
      showWarning('Please enter a valid email address')
      return
    }

    // Validate weekly goal
    if (userForm.weeklyGoal < 1 || userForm.weeklyGoal > 80) {
      showWarning('Weekly goal must be between 1 and 80 hours')
      return
    }

    try {
      setIsSubmitting(true)
      
      if (editingUser) {
        // Update existing user
        const response = await apiClient.updateEmployee(editingUser.id, {
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          department: userForm.department,
          role: userForm.role,
          isActive: userForm.isActive,
          weeklyGoal: userForm.weeklyGoal
        })
        
        if (response.success) {
          success(`User "${userForm.name}" has been updated successfully!`)
          await loadData() // Refresh data
        } else {
          showError('Failed to update user')
        }
      } else {
        // Create new user
        const response = await apiClient.createEmployee({
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          phone: userForm.phone,
          department: userForm.department,
          role: userForm.role,
          isActive: userForm.isActive,
          weeklyGoal: userForm.weeklyGoal
        })
        
        if (response.success) {
          success(`New user "${userForm.name}" has been created successfully!`)
          await loadData() // Refresh data
        } else {
          showError('Failed to create user')
        }
      }
      
      // Reset form and close modal
      setUserForm({
        name: '',
        email: '',
        phone: '',
        department: '',
        role: 'employee',
        isActive: true,
        weeklyGoal: 40,
        password: ''
      })
      setIsEditUserOpen(false)
      setIsAddUserOpen(false)
      setEditingUser(null)
      
    } catch (error) {
      console.error('Error saving user:', error)
      showError('An error occurred while saving the user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormChange = (field: string, value: any) => {
    setUserForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Specific action handlers

  const handleChangePassword = (user: User) => {
    setActionUser(user)
    setIsEditPasswordOpen(true)
  }

  const handleChangeGoal = (user: User) => {
    setActionUser(user)
    setGoalForm({ weeklyGoal: user.weeklyGoal })
    setIsEditGoalOpen(true)
  }

  const handleToggleStatus = async (user: User) => {
    try {
      setIsSubmitting(true)
      const response = await apiClient.toggleEmployeeStatus(user.id)
      
      if (response.success) {
        success(`User "${user.name}" has been ${user.isActive ? 'deactivated' : 'activated'} successfully.`)
        await loadData() // Refresh data
      } else {
        showError('Failed to toggle user status')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      showError('An error occurred while toggling user status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (user: User) => {
    const confirmed = await confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`, {
      title: 'Delete User',
      type: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })
    if (confirmed) {
      try {
        setIsSubmitting(true)
        const response = await apiClient.deleteEmployee(user.id)
        
        if (response.success) {
          success(`User "${user.name}" has been deleted successfully.`)
          await loadData() // Refresh data
        } else {
          showError('Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        showError('An error occurred while deleting user')
      } finally {
        setIsSubmitting(false)
      }
    }
  }


  const handlePasswordSubmit = async (newPassword: string) => {
    if (!actionUser) return
    
    try {
      setIsSubmitting(true)
      const response = await apiClient.resetEmployeePassword(actionUser.id, newPassword)
      
      if (response.success) {
        success(`Password reset for ${actionUser.name}`)
      } else {
        showError('Failed to reset password')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      showError('An error occurred while resetting password')
    } finally {
      setIsSubmitting(false)
      setIsEditPasswordOpen(false)
      setActionUser(null)
    }
  }

  const handleGoalSubmit = async (newGoal: number) => {
    if (!actionUser) return
    
    try {
      setIsSubmitting(true)
      const response = await apiClient.updateEmployeeGoal(actionUser.id, newGoal)
      
      if (response.success) {
        success(`Weekly goal for "${actionUser.name}" has been updated to ${newGoal} hours.`)
        await loadData() // Refresh data
      } else {
        showError('Failed to update weekly goal')
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      showError('An error occurred while updating weekly goal')
    } finally {
      setIsSubmitting(false)
      setIsEditGoalOpen(false)
      setActionUser(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading users...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadData} className="bg-[#6812F7] hover:bg-[#5a0fd4]">
            <RefreshCw className="w-4 h-4 mr-2" />
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
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats?.totalUsers || 0}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats?.activeUsers || 0}</p>
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
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats?.adminUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Meeting Goals</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats?.usersMeetingGoals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts, roles, and time tracking</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            className="bg-[#6812F7] hover:bg-[#5a0fd4]"
            onClick={handleAddUser}
          >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
                </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  {filteredUsers.some(user => user.role === 'employee') && (
                    <>
                      <TableHead>Weekly Goal</TableHead>
                      <TableHead>Progress</TableHead>
                    </>
                  )}
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-[#6812F7] to-[#9253F0] text-white">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900">{user.email}</span>
                        </div>
                        {user.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-500">{user.phone}</span>
                        </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.department || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(user.isActive)}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    {filteredUsers.some(u => u.role === 'employee') && (
                      <>
                        <TableCell>
                          {user.role === 'employee' ? (
                            <div className="flex items-center">
                              <Target className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm text-gray-900">{user.weeklyGoal}h</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.role === 'employee' ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className={getGoalProgressColor(user.goalProgress || 0)}>
                                  {formatHours(user.currentWeekHours || 0)}
                                </span>
                                <span className="text-gray-500">
                                  {user.goalProgress?.toFixed(1)}%
                                </span>
                              </div>
                              <Progress 
                                value={Math.min(user.goalProgress || 0, 100)} 
                                className="h-2"
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{formatDate(user.lastActive || null)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUserClick(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-[#6812F7] hover:bg-[#5a0fd4]"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleChangePassword(user)}>
                              <Settings className="w-4 h-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            {user.role === 'employee' && (
                              <DropdownMenuItem onClick={() => handleChangeGoal(user)}>
                                <Target className="w-4 h-4 mr-2" />
                                Edit Goal
                            </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                              {user.isActive ? (
                                <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first user'
            }
          </p>
          {!searchTerm && filterRole === 'all' && filterStatus === 'all' && (
            <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          )}
        </div>
      )}

      {/* User Detail Modal */}
      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information and time tracking
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="time-tracking">Time Tracking</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  {/* User Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Name</label>
                          <p className="text-lg font-semibold">{selectedUser.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-lg">{selectedUser.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Role</label>
                          <Badge variant="outline" className={getRoleColor(selectedUser.role)}>
                            {selectedUser.role}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <Badge variant="outline" className={getStatusColor(selectedUser.isActive)}>
                            {selectedUser.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Department</label>
                          <p className="text-lg">{selectedUser.department || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-lg">{selectedUser.phone || 'N/A'}</p>
                        </div>
                        {selectedUser.role === 'employee' && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Weekly Goal</label>
                            <p className="text-lg font-semibold">{selectedUser.weeklyGoal} hours</p>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-gray-500">Join Date</label>
                          <p className="text-lg">{formatDate(selectedUser.createdAt)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="time-tracking" className="space-y-4">
                  {/* Time Entries */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Time Entries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getUserTimeEntries(selectedUser.id).map((entry) => (
                          <div key={entry.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{entry.project}</h3>
                                <p className="text-sm text-gray-600">{entry.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(entry.date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-lg">
                                  {formatHours(entry.hours + (entry.minutes / 60))}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {entry.hours}h {entry.minutes}m
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {getUserTimeEntries(selectedUser.id).length === 0 && (
                          <p className="text-center text-gray-500 py-8">No time entries found</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics" className="space-y-4">
                  {/* User Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUser.role === 'employee' && (
                      <Card>
                        <CardHeader>
                          <CardTitle>This Week</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Hours Worked</span>
                              <span className="font-semibold">{formatHours(selectedUser.currentWeekHours || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Goal</span>
                              <span className="font-semibold">{selectedUser.weeklyGoal}h</span>
                            </div>
                            <Progress 
                              value={Math.min(selectedUser.goalProgress || 0, 100)} 
                              className="h-2"
                            />
                            <div className="text-center">
                              <span className={`text-sm font-semibold ${getGoalProgressColor(selectedUser.goalProgress || 0)}`}>
                                {selectedUser.goalProgress?.toFixed(1)}% Complete
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Project Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {projectDistribution.slice(0, 3).map((project) => (
                            <div key={project.project} className="flex justify-between items-center">
                              <span className="text-sm">{project.project}</span>
                              <span className="text-sm font-semibold">{formatHours(project.totalHours)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <div className="flex-shrink-0 flex justify-end space-x-2 pt-4 border-t bg-white">
            <Button variant="outline" onClick={() => setIsUserDetailOpen(false)}>
              Close
            </Button>
            <Button 
              className="bg-[#6812F7] hover:bg-[#5a0fd4]"
              onClick={() => {
                if (selectedUser) {
                  handleEditUser(selectedUser)
                  setIsUserDetailOpen(false)
                }
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit/Add User Form Modal */}
      <Dialog open={isEditUserOpen || isAddUserOpen} onOpenChange={(open) => {
        if (!open) {
          setIsEditUserOpen(false)
          setIsAddUserOpen(false)
          setEditingUser(null)
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Update user information and settings' 
                : 'Create a new user account with appropriate permissions'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input 
                  placeholder="Enter full name" 
                  value={userForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input 
                  placeholder="Enter email address" 
                  type="email" 
                  value={userForm.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input 
                  placeholder="Enter phone number" 
                  value={userForm.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                  value={userForm.department}
                  onChange={(e) => handleFormChange('department', e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                  value={userForm.role}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {userForm.role === 'employee' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Goal (hours)
                  </label>
                  <Input 
                    placeholder="40" 
                    type="number" 
                    min="1" 
                    max="80"
                    value={userForm.weeklyGoal}
                    onChange={(e) => handleFormChange('weeklyGoal', parseInt(e.target.value) || 40)}
                  />
                </div>
              )}
            </div>

            {!editingUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <Input 
                  placeholder="Enter password (min 6 characters)" 
                  type="password" 
                  value={userForm.password}
                  onChange={(e) => handleFormChange('password', e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={userForm.isActive}
                onChange={(e) => handleFormChange('isActive', e.target.checked)}
                className="h-4 w-4 text-[#6812F7] focus:ring-[#6812F7] border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active User
              </label>
            </div>

            {editingUser && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Password Reset
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        To reset the user's password, use the "Reset Password" action in the user menu.
                        This form only updates user information and settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditUserOpen(false)
                  setIsAddUserOpen(false)
                  setEditingUser(null)
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#6812F7] hover:bg-[#5a0fd4]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingUser ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingUser ? 'Update User' : 'Create User'
                )}
              </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>


    {/* Reset Password Modal */}
    <Dialog open={isEditPasswordOpen} onOpenChange={(open) => {
      setIsEditPasswordOpen(open)
      if (!open) setActionUser(null)
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset password for {actionUser?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <Input 
              type="password"
              placeholder="Enter new password (min 6 characters)"
              onChange={(e) => {
                const newPassword = e.target.value
                if (newPassword.length >= 6) {
                  handlePasswordSubmit(newPassword)
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The user will need to log in with this new password.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Edit Weekly Goal Modal */}
    <Dialog open={isEditGoalOpen} onOpenChange={(open) => {
      setIsEditGoalOpen(open)
      if (!open) setActionUser(null)
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Weekly Goal</DialogTitle>
          <DialogDescription>
            Change the weekly goal for {actionUser?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Goal: <span className="font-semibold">{actionUser?.weeklyGoal} hours/week</span>
            </label>
            <Input 
              type="number"
              min="1"
              max="80"
              placeholder="Enter new weekly goal (1-80 hours)"
              value={goalForm.weeklyGoal}
              onChange={(e) => {
                const newGoal = parseInt(e.target.value) || 0
                setGoalForm({ weeklyGoal: newGoal })
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Weekly goal must be between 1 and 80 hours
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-800">
              <strong>Note:</strong> This will update the user's weekly target for time tracking.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditGoalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleGoalSubmit(goalForm.weeklyGoal)}
              disabled={isSubmitting || goalForm.weeklyGoal < 1 || goalForm.weeklyGoal > 80}
            >
              {isSubmitting ? 'Saving...' : 'Save Goal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}
