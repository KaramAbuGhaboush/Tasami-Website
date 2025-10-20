'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Search,
  Filter,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Reply,
  Archive,
  Star
} from 'lucide-react'

export function ContactPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const contactMessages = [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      subject: 'Partnership Opportunity',
      message: 'We are interested in partnering with your company for our upcoming AI project. Could we schedule a call to discuss potential collaboration?',
      status: 'new',
      priority: 'high',
      receivedDate: '2024-01-15T10:30:00Z',
      source: 'Website Contact Form',
      tags: ['Partnership', 'AI', 'Business']
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.j@startup.io',
      phone: '+1 (555) 987-6543',
      subject: 'Service Inquiry',
      message: 'I would like to know more about your automation services. We are a growing startup looking to streamline our operations.',
      status: 'replied',
      priority: 'medium',
      receivedDate: '2024-01-14T14:20:00Z',
      source: 'Email',
      tags: ['Automation', 'Startup', 'Services']
    },
    { 
      id: 3, 
      name: 'Mike Chen', 
      email: 'mike.chen@enterprise.com',
      phone: '+1 (555) 456-7890',
      subject: 'Technical Support',
      message: 'We are experiencing issues with the dashboard you developed for us. The analytics are not updating correctly.',
      status: 'in_progress',
      priority: 'high',
      receivedDate: '2024-01-13T09:15:00Z',
      source: 'Support Ticket',
      tags: ['Support', 'Technical', 'Dashboard']
    }
  ]

  const priorities = ['low', 'medium', 'high']
  const statuses = ['new', 'replied', 'in_progress', 'closed']

  const filteredMessages = contactMessages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'replied': return 'bg-green-100 text-green-700 border-green-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{contactMessages.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-gray-900">{contactMessages.filter(m => m.status === 'replied').length}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{contactMessages.filter(m => m.status === 'new').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">{contactMessages.filter(m => m.priority === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
          <p className="text-gray-600">Manage incoming messages and customer inquiries</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </Button>
          <Button variant="outline" size="sm">
            <Reply className="w-4 h-4 mr-2" />
            Bulk Reply
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search messages..."
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
            {statuses.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
          >
            <option value="all">All Priority</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <p className="font-medium text-gray-900">{message.name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{message.email}</p>
                        <p className="text-sm text-gray-500">{message.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{message.subject}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{message.message}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{message.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(message.priority)}>
                        {message.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(message.status)}>
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(message.receivedDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Message Details</DialogTitle>
                              <DialogDescription>
                                View and reply to this message
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                  <p className="text-sm text-gray-900">{message.name} ({message.email})</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                  <p className="text-sm text-gray-900">{message.phone}</p>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <p className="text-sm text-gray-900">{message.subject}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{message.message}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reply</label>
                                <Textarea placeholder="Type your reply here..." rows={4} />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline">Save Draft</Button>
                                <Button className="bg-[#6812F7] hover:bg-[#5a0fd4]">Send Reply</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" className="bg-[#6812F7] hover:bg-[#5a0fd4]">
                          <Reply className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <XCircle className="w-4 h-4" />
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
      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No contact messages have been received yet'
            }
          </p>
        </div>
      )}
    </div>
  )
}
