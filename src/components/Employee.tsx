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
import { format } from 'date-fns'
import { TimeEntry, NewEntry } from '@/hooks/useEmployee'

interface EmployeeProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  timeEntries: TimeEntry[];
  newEntry: NewEntry;
  setNewEntry: (entry: NewEntry) => void;
  totalHoursThisWeek: number;
  todayEntries: TimeEntry[];
  handleSubmit: (e: React.FormEvent) => void;
  getStatusColor: (status: string) => string;
}

export function Employee({
  selectedDate,
  setSelectedDate,
  timeEntries,
  newEntry,
  setNewEntry,
  totalHoursThisWeek,
  todayEntries,
  handleSubmit,
  getStatusColor
}: EmployeeProps) {
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
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <p className="text-sm text-gray-600">This Week</p>
                      <p className="text-xl font-bold">{totalHoursThisWeek.toFixed(1)}h</p>
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
                      <p className="text-sm text-gray-600">Goal</p>
                      <p className="text-xl font-bold">40h</p>
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

                  <Button type="submit" className="w-full bg-gradient-to-r from-[#6812F7] to-[#9253F0] hover:from-[#5a0fd4] hover:to-[#7d42e6]">
                    <Clock className="w-4 h-4 mr-2" />
                    Log Time Entry
                  </Button>
                </form>
              </CardContent>
            </Card>

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
                          <TableHead>Status</TableHead>
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
                              <Badge className={getStatusColor(entry.status)}>
                                {entry.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
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
                          <TableHead>Status</TableHead>
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
                              <TableCell>
                                <Badge className={getStatusColor(entry.status)}>
                                  {entry.status}
                                </Badge>
                              </TableCell>
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
                          <TableHead>Status</TableHead>
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
                            <TableCell>
                              <Badge className={getStatusColor(entry.status)}>
                                {entry.status}
                              </Badge>
                            </TableCell>
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
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Start Timer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
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
                    <span className="font-semibold">40h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-semibold text-orange-600">
                      {Math.max(0, 40 - totalHoursThisWeek).toFixed(1)}h
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (totalHoursThisWeek / 40) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
