import { useState } from 'react'
import { addDays, subDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns'

export interface TimeEntry {
  id: number;
  date: Date;
  hours: number;
  minutes: number;
  description: string;
  project: string;
  status: string;
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
  todayEntries: TimeEntry[];
  handleSubmit: (e: React.FormEvent) => void;
  getStatusColor: (status: string) => string;
}

export function useEmployee(): UseEmployeeReturn {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: 1,
      date: new Date(),
      hours: 8,
      minutes: 30,
      description: 'Frontend development and bug fixes',
      project: 'Website Redesign',
      status: 'completed'
    },
    {
      id: 2,
      date: subDays(new Date(), 1),
      hours: 7,
      minutes: 45,
      description: 'Database optimization and API integration',
      project: 'Backend Development',
      status: 'completed'
    },
    {
      id: 3,
      date: subDays(new Date(), 2),
      hours: 6,
      minutes: 15,
      description: 'Code review and team meeting',
      project: 'Code Review',
      status: 'completed'
    }
  ])
  const [newEntry, setNewEntry] = useState<NewEntry>({
    hours: '',
    minutes: '',
    description: '',
    project: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEntry.hours && newEntry.minutes && newEntry.description) {
      const entry: TimeEntry = {
        id: timeEntries.length + 1,
        date: selectedDate,
        hours: parseInt(newEntry.hours),
        minutes: parseInt(newEntry.minutes),
        description: newEntry.description,
        project: newEntry.project || 'General Work',
        status: 'completed'
      }
      setTimeEntries([entry, ...timeEntries])
      setNewEntry({ hours: '', minutes: '', description: '', project: '' })
    }
  }

  const totalHoursThisWeek = timeEntries
    .filter(entry => {
      const weekStart = startOfWeek(new Date())
      const weekEnd = endOfWeek(new Date())
      return entry.date >= weekStart && entry.date <= weekEnd
    })
    .reduce((total, entry) => total + entry.hours + (entry.minutes / 60), 0)

  const todayEntries = timeEntries.filter(entry => isSameDay(entry.date, selectedDate))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'overtime': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
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
    todayEntries,
    handleSubmit,
    getStatusColor
  }
}
