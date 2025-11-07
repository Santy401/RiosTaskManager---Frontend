import { useState, useCallback, useEffect } from 'react'
import { useCompany } from '@/app/presentation/hooks/Company/useCompany'

import { CompanyFromAPI } from "@/app/domain/entities/Company"

export const useCompanyData = () => {
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([])
  const { getAllCompany, isDeletingCompany } = useCompany()

  const loadCompanies = useCallback(async () => {
    try {
      console.log('🔄 [COMPONENT] Cargando empresas...')
      const companyData = await getAllCompany()
      console.log('✅ [COMPONENT] Empresas cargadas:', companyData)
      setCompanies(companyData)
    } catch (error) {
      console.error('❌ [COMPONENT] Error al cargar empresas:', error)
    }
  }, [getAllCompany])

  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  return {
    companies,
    loadCompanies,
    isDeletingCompany,
    hasCompanies: companies.length > 0
  }
}