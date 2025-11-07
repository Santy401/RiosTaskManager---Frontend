import { useCompany } from '@/app/presentation/hooks/Company/useCompany'

interface CompanyFormData {
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
    openEditModal: (company: any) => void
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
      }
    } catch (error) {
      console.error('Error en acción:', error)
    } finally {
      closeContextMenu()
    }
  }

  return {
    handleCreateCompany,
    handleMenuAction
  }
}