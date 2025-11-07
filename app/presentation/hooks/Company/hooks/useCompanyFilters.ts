import { useState, useMemo } from 'react'
import { CompanyFromAPI } from '@/app/domain/entities/Company'

export const useCompanyFilters = (companies: CompanyFromAPI[]) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [customFilters, setCustomFilters] = useState<string[]>(['A', 'B', 'C'])

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = 
        company.name.toLowerCase().includes(searchLower) ||
        company.nit.toLowerCase().includes(searchLower) ||
        company.email.toLowerCase().includes(searchLower)

      if (selectedFilter) {
        const filterLower = selectedFilter.toLowerCase()
        const companyTipo = company.tipo?.toLowerCase() || ''
        const matchesFilter = 
          companyTipo === filterLower || 
          companyTipo.startsWith(filterLower)
        return matchesSearch && matchesFilter
      }

      return matchesSearch
    })
  }, [companies, searchQuery, selectedFilter])

  const handleAddFilter = (filterName: string) => {
    if (filterName.trim() && !customFilters.includes(filterName.trim())) {
      setCustomFilters(prev => [...prev, filterName.trim()])
      return true
    }
    return false
  }

  const handleRemoveFilter = (filterToRemove: string) => {
    setCustomFilters(prev => prev.filter(filter => filter !== filterToRemove))
    if (selectedFilter === filterToRemove) {
      setSelectedFilter(null)
    }
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    customFilters,
    filteredCompanies,
    handleAddFilter,
    handleRemoveFilter
  }
}