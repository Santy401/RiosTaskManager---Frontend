import { useState } from 'react'

export const usePasswordVisibility = (companyIds: string[]) => {
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [showAllPasswords, setShowAllPasswords] = useState(false)

  const togglePasswordVisibility = (companyId: string) => {
    if (showAllPasswords) return

    setShowPasswords(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }))
  }

  const toggleAllPasswords = () => {
    const newShowAllState = !showAllPasswords
    setShowAllPasswords(newShowAllState)

    const newState: { [key: string]: boolean } = {}
    companyIds.forEach(id => {
      newState[id] = newShowAllState
    })
    setShowPasswords(newState)
  }

  const maskPassword = (password: string, companyId: string) => {
    if (!password || password === '') return 'No definida'
    const shouldShow = showAllPasswords || showPasswords[companyId]
    return shouldShow ? password : '•'.repeat(8)
  }

  return {
    showPasswords,
    showAllPasswords,
    togglePasswordVisibility,
    toggleAllPasswords,
    maskPassword
  }
}