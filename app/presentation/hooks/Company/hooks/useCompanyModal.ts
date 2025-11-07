import { useState } from 'react'

import { CompanyForForm } from '@/app/domain/entities/Company'

import { CompanyFromAPI } from "@/app/domain/entities/Company"

export const useCompanyModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<CompanyForForm | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const convertToFormType = (company: CompanyFromAPI): CompanyForForm => {
    return {
      ...company,
      createdAt: new Date(company.createdAt),
      updatedAt: new Date(company.updatedAt)
    }
  }

  const openCreateModal = () => {
    setEditingCompany(null)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  const openEditModal = (company: CompanyFromAPI) => {
    const companyForForm = convertToFormType(company)
    setEditingCompany(companyForForm)
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCompany(null)
    setIsEditMode(false)
  }

  return {
    isModalOpen,
    editingCompany,
    isEditMode,
    openCreateModal,
    openEditModal,
    closeModal
  }
}