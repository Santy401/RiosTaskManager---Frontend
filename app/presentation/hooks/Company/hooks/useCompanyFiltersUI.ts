import { useState } from 'react'

export const useCompanyFiltersUI = () => {
  const [showAddFilter, setShowAddFilter] = useState(false)
  const [newFilterName, setNewFilterName] = useState("")
  const [showToast, setShowToast] = useState(false)

  const handleNewFilterClick = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const resetFilterInput = () => {
    setShowAddFilter(false)
    setNewFilterName("")
  }

  return {
    showAddFilter,
    setShowAddFilter,
    newFilterName,
    setNewFilterName,
    showToast,
    setShowToast,
    handleNewFilterClick,
    resetFilterInput
  }
}