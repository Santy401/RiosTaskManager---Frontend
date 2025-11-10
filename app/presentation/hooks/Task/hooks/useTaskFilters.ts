import { useState, useMemo } from 'react'
import type { Task } from '../type'

export type SortOption = 'none' | 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc'

export function useTaskFilters(tasks: Task[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showOnlyActive, setShowOnlyActive] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("none")

  const filteredTasks = useMemo(() => {
    // Primero filtramos
    let result = tasks.filter(task => {
      const matchesSearch = 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.area?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === "all" || task.status === filterStatus
      const matchesActive = !showOnlyActive || task.status !== 'terminada'

      return matchesSearch && matchesStatus && matchesActive
    })

    // Luego ordenamos
    if (sortBy !== 'none') {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'date-asc':
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          case 'date-desc':
            return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'name-desc':
            return b.name.localeCompare(a.name)
          default:
            return 0
        }
      })
    }

    return result
  }, [tasks, searchQuery, filterStatus, showOnlyActive, sortBy])

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    showOnlyActive,
    setShowOnlyActive,
    sortBy,
    setSortBy,
    filteredTasks
  }
}
