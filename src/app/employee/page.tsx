'use client'

import { useEmployee } from '@/hooks/useEmployee'
import { Employee } from '@/components/Employee'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function EmployeeTimeTracking() {
  const {
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
  } = useEmployee()

  return (
    <ProtectedRoute requiredRole="employee">
      <Employee
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        timeEntries={timeEntries}
        newEntry={newEntry}
        setNewEntry={setNewEntry}
        totalHoursThisWeek={totalHoursThisWeek}
        totalHoursThisMonth={totalHoursThisMonth}
        todayEntries={todayEntries}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
        refreshEntries={refreshEntries}
        weeklyGoal={weeklyGoal}
        updateWeeklyGoal={updateWeeklyGoal}
        deleteTimeEntry={deleteTimeEntry}
        updateTimeEntry={updateTimeEntry}
      />
    </ProtectedRoute>
  )
}