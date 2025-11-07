import { useState, useMemo } from 'react'

interface PaginationConfig {
  itemsPerPage?: number
}

export const useCompanyPagination = <T,>(
  items: T[], 
  config: PaginationConfig = {}
) => {
  const { itemsPerPage = 10 } = config
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage

  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, startIndex + itemsPerPage)
  }, [items, startIndex, itemsPerPage])

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return {
    currentPage,
    totalPages,
    startIndex,
    itemsPerPage,
    paginatedCompanies: paginatedItems,
    goToNextPage,
    goToPrevPage,
    goToPage,
    setCurrentPage
  }
}