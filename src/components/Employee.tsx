import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  TrendingUp, 
  Target,
  Clock4,
  CheckCircle,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { TimeEntry, NewEntry } from '@/hooks/useEmployee'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

interface EmployeeProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  timeEntries: TimeEntry[];
  newEntry: NewEntry;
  setNewEntry: (entry: NewEntry) => void;
  totalHoursThisWeek: number;
  totalHoursThisMonth: number;
  todayEntries: TimeEntry[];
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshEntries: () => Promise<void>;
  weeklyGoal: number;
  updateWeeklyGoal: (goal: number) => Promise<void>;
  deleteTimeEntry: (id: string) => Promise<void>;
  updateTimeEntry: (id: string, entryData: {
    date?: string;
    hours?: number;
    minutes?: number;
    project?: string;
    description?: string;
  }) => Promise<void>;
}

export function Employee({
  selectedDate,
  setSelectedDate,
  timeEntries,
  newEntry,
  setNewEntry,
  totalHoursThisWeek,
  totalHoursThisMonth,
  todayEntries,
  handleSubmit,
  loading,
  error,
  refreshEntries,
  weeklyGoal,
  updateWeeklyGoal,
  deleteTimeEntry,
  updateTimeEntry
}: EmployeeProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
  const [editForm, setEditForm] = useState({
    hours: '',
    minutes: '',
    project: '',
    description: ''
  })

  const handleEditClick = (entry: TimeEntry) => {
    setEditingEntry(entry)
    setEditForm({
      hours: entry.hours.toString(),
      minutes: entry.minutes.toString(),
      project: entry.project,
      description: entry.description
    })
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingEntry) return
    
    if (!editForm.hours || !editForm.minutes || !editForm.project || !editForm.description) {
      return
    }

    try {
      await updateTimeEntry(editingEntry.id, {
        hours: parseInt(editForm.hours),
        minutes: parseInt(editForm.minutes),
        project: editForm.project,
        description: editForm.description
      })
      
      setIsEditModalOpen(false)
      setEditingEntry(null)
      setEditForm({ hours: '', minutes: '', project: '', description: '' })
    } catch (err) {
      console.error('Error updating time entry:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F3FF] via-white to-[#DFC7FE]/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Time Tracking</h1>
                <p className="text-sm text-gray-500">Track your working hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-100 text-green-700">
                <CheckCircle className="w-4 h-4 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-lg flex items-center justify-center">
                      <Clock4 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Today</p>
                      <p className="text-xl font-bold">{todayEntries.reduce((total, entry) => total + entry.hours + (entry.minutes / 60), 0).toFixed(1)}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-xl font-bold">{totalHoursThisMonth.toFixed(1)}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weekly Goal</p>
                      <p className="text-xl font-bold">{weeklyGoal}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Target</p>
                      <p className="text-xl font-bold">{weeklyGoal * 4}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Entry Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Log Time Entry</span>
                </CardTitle>
                <CardDescription>
                  Record your working hours for {format(selectedDate, 'MMMM dd, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(selectedDate, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          initialFocus
                          modifiers={{
                            hasEntries: (date) => {
                              return timeEntries.some(entry => 
                                entry.date.toDateString() === date.toDateString()
                              )
                            }
                          }}
                          modifiersClassNames={{
                            hasEntries: "text-purple-600 font-semibold"
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Input */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hours">Hours</Label>
                      <Input
                        id="hours"
                        type="number"
                        min="0"
                        max="24"
                        value={newEntry.hours}
                        onChange={(e) => setNewEntry({ ...newEntry, hours: e.target.value })}
                        placeholder="8"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minutes">Minutes</Label>
                      <Input
                        id="minutes"
                        type="number"
                        min="0"
                        max="59"
                        value={newEntry.minutes}
                        onChange={(e) => setNewEntry({ ...newEntry, minutes: e.target.value })}
                        placeholder="30"
                      />
                    </div>
                  </div>

                  {/* Project */}
                  <div className="space-y-2">
                    <Label htmlFor="project">Project</Label>
                    <Input
                      id="project"
                      value={newEntry.project}
                      onChange={(e) => setNewEntry({ ...newEntry, project: e.target.value })}
                      placeholder="Website Development"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">What did you work on?</Label>
                    <Textarea
                      id="description"
                      value={newEntry.description}
                      onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                      placeholder="Describe the tasks you completed..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#6812F7] to-[#9253F0] hover:from-[#5a0fd4] hover:to-[#7d42e6] disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {loading ? 'Logging...' : 'Log Time Entry'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Weekly Goal Management - Admin Only */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Weekly Goal Management</span>
                  </CardTitle>
                  <CardDescription>
                    Set weekly working hours goal (Admin only)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="weekly-goal">Hours per week</Label>
                      <Input
                        id="weekly-goal"
                        type="number"
                        min="1"
                        max="80"
                        value={weeklyGoal}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          if (value >= 1 && value <= 80) {
                            updateWeeklyGoal(value)
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Current: {weeklyGoal}h/week</p>
                      <p>Monthly target: {weeklyGoal * 4}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Time Entries History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Time Entries</span>
                </CardTitle>
                <CardDescription>
                  Your recent time entries and work history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="today" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This Week</TabsTrigger>
                    <TabsTrigger value="all">All Time</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="today" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {todayEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">
                              {entry.hours}h {entry.minutes}m
                            </TableCell>
                            <TableCell>{entry.project}</TableCell>
                            <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditClick(entry)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this time entry?')) {
                                      deleteTimeEntry(entry.id)
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="week" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timeEntries
                          .filter(entry => {
                            const weekStart = startOfWeek(new Date())
                            const weekEnd = endOfWeek(new Date())
                            return entry.date >= weekStart && entry.date <= weekEnd
                          })
                          .map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>{format(entry.date, 'MMM dd')}</TableCell>
                              <TableCell className="font-medium">
                                {entry.hours}h {entry.minutes}m
                              </TableCell>
                              <TableCell>{entry.project}</TableCell>
                              <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="all" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timeEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{format(entry.date, 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="font-medium">
                              {entry.hours}h {entry.minutes}m
                            </TableCell>
                            <TableCell>{entry.project}</TableCell>
                            <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pt-1 pb-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border w-full"
                  modifiers={{
                    hasEntries: (date) => {
                      return timeEntries.some(entry => 
                        entry.date.toDateString() === date.toDateString()
                      )
                    }
                  }}
                  modifiersClassNames={{
                    hasEntries: "text-purple-600 font-semibold"
                  }}
                />
              </CardContent>
            </Card>


            {/* Weekly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Weekly Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Hours</span>
                    <span className="font-semibold">{totalHoursThisWeek.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Goal</span>
                    <span className="font-semibold">{weeklyGoal}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-semibold text-orange-600">
                      {Math.max(0, weeklyGoal - totalHoursThisWeek).toFixed(1)}h
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (totalHoursThisWeek / weeklyGoal) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Monthly Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Hours</span>
                    <span className="font-semibold">{totalHoursThisMonth.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Target</span>
                    <span className="font-semibold">{weeklyGoal * 4}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-semibold text-purple-600">
                      {Math.max(0, (weeklyGoal * 4) - totalHoursThisMonth).toFixed(1)}h
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (totalHoursThisMonth / (weeklyGoal * 4)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
            <DialogDescription>
              Make changes to your time entry here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-hours" className="text-right">
                  Hours
                </Label>
                <Input
                  id="edit-hours"
                  type="number"
                  min="0"
                  max="24"
                  value={editForm.hours}
                  onChange={(e) => setEditForm(prev => ({ ...prev, hours: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-minutes" className="text-right">
                  Minutes
                </Label>
                <Input
                  id="edit-minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={editForm.minutes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, minutes: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-project" className="text-right">
                  Project
                </Label>
                <Input
                  id="edit-project"
                  value={editForm.project}
                  onChange={(e) => setEditForm(prev => ({ ...prev, project: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
