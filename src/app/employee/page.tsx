'use client'

import { useEmployee } from '@/hooks/useEmployee'
import { Employee } from '@/components/Employee'

export default function EmployeeTimeTracking() {
  const {
    selectedDate,
    setSelectedDate,
    timeEntries,
    newEntry,
    setNewEntry,
    totalHoursThisWeek,
    todayEntries,
    handleSubmit,
    getStatusColor
  } = useEmployee()

  return (
    <Employee
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      timeEntries={timeEntries}
      newEntry={newEntry}
      setNewEntry={setNewEntry}
      totalHoursThisWeek={totalHoursThisWeek}
      todayEntries={todayEntries}
      handleSubmit={handleSubmit}
      getStatusColor={getStatusColor}
    />
  )
}