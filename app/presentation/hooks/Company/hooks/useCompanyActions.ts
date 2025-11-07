import * as React from 'react'
import { useCompany } from '@/app/presentation/hooks/Company/useCompany'

export interface CompanyFormData {
  name: string;
  tipo: string;
  nit: string;
  cedula: string;
  dian: string;
  firma: string;
  softwareContable: string;
  usuario: string;
  servidorCorreo: string;
  email: string;
  claveCorreo: string;
  claveCC: string;
  claveSS: string;
  claveICA: string;
  contraseña: string;
}

interface CompanyForForm {
  id: string;
  [key: string]: any;
}

export const useCompanyActions = (
  onSuccess: () => void,
  closeContextMenu: () => void
) => {
  const { createCompany, updateCompany, deleteCompany } = useCompany()
  const [isDuplicating, setIsDuplicating] = React.useState<string | null>(null)

  const handleDuplicateCompany = async (company: any) => {
    try { 
      setIsDuplicating(company.id)
      const { id, createdAt, updatedAt, ...companyData } = company
      await createCompany(companyData)
      onSuccess()
    } catch (error) {
console.error('Error duplicando empresa:', error)
      throw error
    } finally {
      setIsDuplicating(null)
    }
  }

  const handleCreateCompany = async (
    companyData: CompanyFormData,
    isEditMode: boolean,
    editingCompany: CompanyForForm | null
  ) => {
    try {
      if (isEditMode && editingCompany) {
        await updateCompany({ companyId: editingCompany.id, data: companyData })
      } else {
        await createCompany(companyData)
      }
    } catch (error) {
      console.error('Error en operación empresa:', error)
      throw error
    }
  }

  const handleMenuAction = async (
    action: string,
    companyId: string,
    companyName: string,
    companies: any[],
    openEditModal: (company: any) => void,
    isDuplicating?: (id: string) => boolean
  ) => {
    try {
      switch (action) {
        case 'view':
          console.log('👁️ Ver empresa:', companyId)
          break
        case 'edit':
          console.log('✏️ Editar empresa:', companyId)
          const companyToEdit = companies.find(c => c.id === companyId)
          if (companyToEdit) {
            openEditModal(companyToEdit)
          }
          break
        case 'delete':
          if (confirm(`¿Eliminar Empresa "${companyName}"?`)) {
            await deleteCompany(companyId)
            onSuccess()
          }
          break
        case 'duplicate':
          if (isDuplicating && isDuplicating(companyId)) return
          const companyToDuplicate = companies.find(c => c.id === companyId)
          if (companyToDuplicate) {
            await handleDuplicateCompany(companyToDuplicate)
          }
          break
      }
    } catch (error) {
      console.error('Error en acción:', error)
    } finally {
      closeContextMenu()
    }
  }

  return {
    handleCreateCompany,
    handleMenuAction,
    handleDuplicateCompany,
    isDuplicating
  }
}