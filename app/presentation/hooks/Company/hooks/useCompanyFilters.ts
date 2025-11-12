import { useState, useMemo, useEffect, useCallback } from 'react'
import { CompanyFromAPI } from '@/app/domain/entities/Company'

export const useCompanyFilters = (companies: CompanyFromAPI[]) => {
  // ========== CÓDIGO ORIGINAL (NO TOCAR) ==========
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [customFilters, setCustomFilters] = useState<string[]>([])
  const [isLoadingFilters, setIsLoadingFilters] = useState(true)

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

  const loadFiltersFromDB = useCallback(async () => {
    try {
      setIsLoadingFilters(true);
      const response = await fetch('/api/admin/custom-filters?entity=company');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const dbFilters = await response.json();
      
      // If no filters in DB, initialize with default filters
      if (!dbFilters || dbFilters.length === 0) {
        console.log('No filters found, initializing with defaults...');
        const defaultFilters = ['A', 'B', 'C'];
        
        // Save default filters to DB
        const savePromises = defaultFilters.map(async (filter) => {
          try {
            const saveResponse = await fetch('/api/admin/custom-filters', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: filter,
                field: 'tipo',
                value: filter,
                entity: 'company'
              })
            });
            
            if (!saveResponse.ok) {
              console.error('Failed to save default filter:', filter);
              return null;
            }
            
            const savedFilter = await saveResponse.json();
            return savedFilter.value;
          } catch (error) {
            console.error('Error saving default filter:', filter, error);
            return null;
          }
        });
        
        const savedFilters = (await Promise.all(savePromises)).filter(Boolean);
        setCustomFilters(savedFilters.length > 0 ? savedFilters : defaultFilters);
      } else {
        // Use filters from DB
        const filterValues = dbFilters.map((f: any) => f.value);
        setCustomFilters(filterValues);
      }
    } catch (error) {
      console.error('Error loading filters from DB:', error);
      // Fallback to default filters if there's an error
      setCustomFilters(['A', 'B', 'C']);
    } finally {
      setIsLoadingFilters(false);
    }
  }, []);

  // Load filters on mount
  useEffect(() => {
    loadFiltersFromDB();
  }, [loadFiltersFromDB]);

  const handleAddFilterWithDB = async (filterName: string) => {
    const trimmedName = filterName.trim();
    
    // Don't add empty filters
    if (!trimmedName) return false;
    
    // Don't add duplicate filters
    if (customFilters.includes(trimmedName)) {
      return false;
    }
    
    try {
      const response = await fetch('/api/admin/custom-filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          field: 'tipo',
          value: trimmedName,
          entity: 'company'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newFilter = await response.json();
      
      // Update local state
      setCustomFilters(prev => [...prev, newFilter.value]);
      return true;
      
    } catch (error) {
      console.error('Error saving filter to DB:', error);
      // Even if DB save fails, add it to the local state
      setCustomFilters(prev => [...prev, trimmedName]);
      return true;
    }
  }

  const handleRemoveFilterWithDB = async (filterToRemove: string) => {
    // First remove from local state
    handleRemoveFilter(filterToRemove)
    
    try {
      // First, get all filters to find the ID of the one to delete
      const response = await fetch('/api/admin/custom-filters?entity=company')
      if (!response.ok) {
        throw new Error(`Failed to fetch filters: ${response.status}`)
      }
      
      const dbFilters = await response.json()
      const filterInDB = dbFilters.find((f: any) => f.value === filterToRemove)
      
      if (filterInDB) {
        const deleteResponse = await fetch(`/api/admin/custom-filters/${filterInDB.id}`, {
          method: 'DELETE'
        })
        
        if (!deleteResponse.ok) {
          throw new Error(`Failed to delete filter: ${deleteResponse.status}`)
        }
        
        // Refresh filters from DB to ensure consistency
        await loadFiltersFromDB();
      }
    } catch (error) {
      console.error('Error removing filter from DB:', error)
    }
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    customFilters,
    filteredCompanies,
    handleAddFilter: handleAddFilterWithDB,
    handleRemoveFilter: handleRemoveFilterWithDB,
    loadFiltersFromDB,
    isLoadingFilters
  }
}
