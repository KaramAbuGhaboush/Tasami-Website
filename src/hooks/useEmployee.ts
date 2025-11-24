import { useState, useEffect } from 'react'
import { addDays, subDays, startOfWeek, endOfWeek, isSameDay, startOfMonth, endOfMonth } from 'date-fns'
import { apiClient } from '@/lib/api'

export interface TimeEntry {
  id: string;
  date: Date;
  hours: number;
  minutes: number;
  description: string;
  project: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewEntry {
  hours: string;
  minutes: string;
  description: string;
  project: string;
}

export interface UseEmployeeReturn {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  timeEntries: TimeEntry[];
  setTimeEntries: (entries: TimeEntry[]) => void;
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

export function useEmployee(): UseEmployeeReturn {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [newEntry, setNewEntry] = useState<NewEntry>({
    hours: '',
    minutes: '',
    description: '',
    project: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [weeklyGoal, setWeeklyGoal] = useState(40)

  // Load time entries and user profile on component mount
  useEffect(() => {
    loadTimeEntries()
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response = await apiClient.getUserProfile()
      if (response.success) {
        setWeeklyGoal(response.data.user.weeklyGoal)
      }
    } catch (err) {
      console.error('Error loading user profile:', err)
    }
  }

  const loadTimeEntries = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getTimeEntries({ filter: 'all' })
      if (response.success && response.data?.items) {
        const entries = response.data.items.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt)
        }))
        setTimeEntries(entries)
      } else {
        console.warn('No time entries data received:', response)
        setTimeEntries([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load time entries')
      console.error('Error loading time entries:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshEntries = async () => {
    await loadTimeEntries()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEntry.hours || !newEntry.minutes || !newEntry.description) {
      setError('Please fill in all required fields')
      return
    }

    // Check if selected date is in the future
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today
    if (selectedDate > today) {
      setError('Cannot add time entries for future dates')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const entryData = {
        date: selectedDate.toISOString(),
        hours: parseInt(newEntry.hours),
        minutes: parseInt(newEntry.minutes),
        project: newEntry.project || 'General Work',
        description: newEntry.description
      }

      const response = await apiClient.createTimeEntry(entryData)
      if (response.success && response.data) {
        const newTimeEntry = {
          ...response.data,
          date: new Date(response.data.date),
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt)
        }
        setTimeEntries([newTimeEntry, ...timeEntries])
        setNewEntry({ hours: '', minutes: '', description: '', project: '' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create time entry')
      console.error('Error creating time entry:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalHoursThisWeek = timeEntries
    .filter(entry => {
      const weekStart = startOfWeek(new Date())
      const weekEnd = endOfWeek(new Date())
      return entry.date >= weekStart && entry.date <= weekEnd
    })
    .reduce((total, entry) => total + entry.hours + (entry.minutes / 60), 0)

  const totalHoursThisMonth = timeEntries
    .filter(entry => {
      const monthStart = startOfMonth(new Date())
      const monthEnd = endOfMonth(new Date())
      return entry.date >= monthStart && entry.date <= monthEnd
    })
    .reduce((total, entry) => total + entry.hours + (entry.minutes / 60), 0)

  const todayEntries = timeEntries.filter(entry => isSameDay(entry.date, selectedDate))

  const updateWeeklyGoal = async (goal: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.updateWeeklyGoal(goal)
      if (response.success) {
        setWeeklyGoal(response.data.user.weeklyGoal)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update weekly goal')
      console.error('Error updating weekly goal:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteTimeEntry = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.deleteTimeEntry(id)
      if (response.success) {
        await loadTimeEntries() // Refresh the list
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete time entry')
      console.error('Error deleting time entry:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateTimeEntry = async (id: string, entryData: {
    date?: string;
    hours?: number;
    minutes?: number;
    project?: string;
    description?: string;
  }) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.updateTimeEntry(id, entryData)
      if (response.success) {
        await loadTimeEntries() // Refresh the list
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update time entry')
      console.error('Error updating time entry:', err)
    } finally {
      setLoading(false)
    }
  }


  return {
    selectedDate,
    setSelectedDate,
    timeEntries,
    setTimeEntries,
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
  }
}
