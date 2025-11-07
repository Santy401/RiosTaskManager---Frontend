export const useCompanyUtils = () => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      console.log(error)
      return 'Fecha inválida'
    }
  }

  const getDisplayValue = (value: string | null | undefined): string => {
    if (!value || value === '' || value === null || value === undefined) {
      return 'N/A'
    }
    return value
  }

  const getDianStatus = (dian: string) => {
    if (!dian || dian === '') return 'secondary'
    return dian === "Activa" ? "default" : "secondary"
  }

  const getDianBadgeClass = (dian: string) => {
    if (!dian || dian === '') return "bg-gray-500/20 text-gray-400"
    return dian === "Activa" 
      ? "bg-emerald-500/20 text-emerald-400" 
      : "bg-red-500/20 text-red-400"
  }

  return {
    formatDate,
    getDisplayValue,
    getDianStatus,
    getDianBadgeClass
  }
}