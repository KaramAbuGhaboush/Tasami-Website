'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useContactAdmin, type ContactMessage } from '@/hooks/useContactAdmin'
import { useNotification } from '@/hooks/useNotification'
import { Pagination } from '@/components/ui/pagination'
import { 
  Search,
  Filter,
  MessageSquare,
  Mail,
  Phone,
  Building,
  DollarSign,
  Calendar,
  Eye,
  Trash2,
  RefreshCw,
  TestTube,
  Loader2,
  CheckCircle,
  Clock,
  Reply,
  Archive
} from 'lucide-react'

export function ContactPage() {
  const { success, error: showError, confirm } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterService, setFilterService] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)

  const {
    messages,
    pagination,
    loading,
    error,
    updating,
    deleting,
    testingEmail,
    fetchMessages,
    updateMessage,
    deleteMessage,
    testEmail,
    clearError
  } = useContactAdmin()

  const services = Array.from(new Set(messages.map(msg => msg.service).filter(Boolean)))
  const statusOptions = ['new', 'read', 'replied', 'closed']

  // Fetch messages with current filters and pagination
  const loadMessages = async () => {
    const params: any = {
      page: currentPage,
      limit: pageSize
    }
    
    if (filterStatus !== 'all') {
      params.status = filterStatus
    }
    
    if (filterService !== 'all') {
      params.service = filterService
    }
    
    if (searchTerm.trim()) {
      params.search = searchTerm.trim()
    }
    
    await fetchMessages(params)
  }

  // Load messages when filters or pagination change
  useEffect(() => {
    loadMessages()
  }, [currentPage, pageSize, filterStatus, filterService])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1) // Reset to first page when searching
      } else {
        loadMessages()
      }
    }, 500) // 500ms delay

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleStatusUpdate = async (messageId: string, newStatus: string) => {
    const message = messages.find(m => m.id === messageId)
    const result = await updateMessage(messageId, { status: newStatus as any })
    if (result.success) {
      const statusLabels: Record<string, string> = {
        new: 'new',
        read: 'read',
        replied: 'replied',
        closed: 'closed'
      }
      const statusLabel = statusLabels[newStatus] || newStatus
      success(`Message status has been updated to "${statusLabel}".`)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    const messageSubject = message?.subject || 'this message'
    
    const confirmed = await confirm(`Are you sure you want to delete message "${messageSubject}"? This action cannot be undone.`, {
      title: 'Delete Message',
      type: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })
    if (confirmed) {
      const result = await deleteMessage(messageId)
      if (result.success) {
        success(`Message "${messageSubject}" has been deleted successfully.`)
      }
    }
  }

  const handlePreviewMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    setIsPreviewDialogOpen(true)
  }

  const handleTestEmail = async () => {
    const result = await testEmail()
    if (result.success) {
      success('Email test successful!')
    } else {
      showError(`Email test failed: ${result.message}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'read': return 'bg-green-100 text-green-700 border-green-200'
      case 'replied': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />
      case 'read': return <CheckCircle className="w-4 h-4" />
      case 'replied': return <Reply className="w-4 h-4" />
      case 'closed': return <Archive className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading contact messages...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <p className="text-red-600">{error}</p>
            <Button variant="outline" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

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
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-gray-900">{messages.filter(m => m.status === 'new').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Reply className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-gray-900">{messages.filter(m => m.status === 'replied').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TestTube className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Email Status</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                  className="mt-1"
                >
                  {testingEmail ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Test Email'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-gray-600">Manage and respond to customer inquiries</p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadMessages}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
          >
            <option value="all">All Services</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
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
                  <TableHead>Service</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{message.name}</p>
                        {message.email && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {message.email}
                          </div>
                        )}
                        {message.phone && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Phone className="w-3 h-3 mr-1" />
                            {message.phone}
                          </div>
                        )}
                        {message.company && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Building className="w-3 h-3 mr-1" />
                            {message.company}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{message.service}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        {message.budget}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getStatusColor(message.status)}>
                          <div className="flex items-center">
                            {getStatusIcon(message.status)}
                            <span className="ml-1">{message.status}</span>
                          </div>
                        </Badge>
                        <select
                          value={message.status}
                          onChange={(e) => handleStatusUpdate(message.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-[#6812F7] focus:border-transparent"
                          disabled={updating}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(message.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          title="View Message" 
                          onClick={() => handlePreviewMessage(message)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700" 
                          title="Delete Message"
                          onClick={() => handleDeleteMessage(message.id)}
                          disabled={deleting}
                        >
                          {deleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
                Show:
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-3 py-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} messages
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.pages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Empty State */}
      {messages.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' || filterService !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No contact messages have been received yet'
            }
          </p>
        </div>
      )}

      {/* Message Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              View and manage this contact message
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* Message Header */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedMessage.name}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{selectedMessage.service}</Badge>
                      <Badge variant="outline" className={getStatusColor(selectedMessage.status)}>
                        {selectedMessage.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Received: {formatDate(selectedMessage.createdAt)}</p>
                    <p>Updated: {formatDate(selectedMessage.updatedAt)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {selectedMessage.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{selectedMessage.email}</span>
                    </div>
                  )}
                  {selectedMessage.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{selectedMessage.phone}</span>
                    </div>
                  )}
                  {selectedMessage.company && (
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Company:</span>
                      <span className="ml-2">{selectedMessage.company}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Budget:</span>
                    <span className="ml-2">{selectedMessage.budget}</span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Message</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t bg-white">
            <div className="flex space-x-2">
              <select
                value={selectedMessage?.status || 'new'}
                onChange={(e) => selectedMessage && handleStatusUpdate(selectedMessage.id, e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
                disabled={updating}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
                Close
              </Button>
              {selectedMessage && (
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    handleDeleteMessage(selectedMessage.id)
                    setIsPreviewDialogOpen(false)
                  }}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete Message
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}