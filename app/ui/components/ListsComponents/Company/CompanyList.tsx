"use client"

import { CompanyHeader } from './components/CompanyHeader'
import { CompanyControls } from './components/CompanyControls'
import { CompanyTable } from './components/CompanyTable'
import { CompanyPagination } from './components/CompanyPagination'
import { CompanyToast } from './components/CompanyToast'

import { SlideModal } from "../../ModalComponents/slideModal"
import { ToastProvider, ToastViewport } from "@/app/ui/components/StyledComponents/toast"
import { CreateCompanyForm } from "../../ModalComponents/createCompany"
import { ContextMenu } from '@/app/ui/components/ListsComponents/ActionsMenu/ContextMenu'

import { useContextMenu } from '@/app/presentation/hooks/Menu/useContextMenu'
import { useCompanyData } from '@/app/presentation/hooks/Company/hooks/useCompanyData'
import { useCompanyFilters } from '@/app/presentation/hooks/Company/hooks/useCompanyFilters'
import { useCompanyPagination } from '@/app/presentation/hooks/Company/hooks/useCompanyPagination'
import { usePasswordVisibility } from '@/app/presentation/hooks/Company/hooks/usePasswordVisibility'
import { useCompanyModal } from '@/app/presentation/hooks/Company/hooks/useCompanyModal'
import { useCompanyActions } from '@/app/presentation/hooks/Company/hooks/useCompanyActions'
import { useCompanyFiltersUI } from '@/app/presentation/hooks/Company/hooks/useCompanyFiltersUI'
import { useCompanyUtils } from '@/app/presentation/hooks/Company/hooks/useCompanyUtils'

import { CompanyFormData } from '@/app/domain/entities/Company'

export function CompanyList() {
  const { companies, loadCompanies, isDeletingCompany, hasCompanies } = useCompanyData()

  const {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    customFilters,
    filteredCompanies,
    handleAddFilter,
    handleRemoveFilter
  } = useCompanyFilters(companies)

  const {
    currentPage,
    totalPages,
    startIndex,
    itemsPerPage,
    paginatedCompanies,
    goToNextPage,
    goToPrevPage,
    setCurrentPage
  } = useCompanyPagination(filteredCompanies, { itemsPerPage: 10 })

  const {
    showPasswords,
    showAllPasswords,
    togglePasswordVisibility,
    toggleAllPasswords,
    maskPassword
  } = usePasswordVisibility(companies.map(c => c.id))

  const {
    isModalOpen,
    editingCompany,
    isEditMode,
    openCreateModal,
    openEditModal,
    closeModal
  } = useCompanyModal()

  const {
    contextMenu,
    handleDoubleClick,
    handleDoubleTap,
    handleContextMenu,
    closeContextMenu,
    contextMenuRef
  } = useContextMenu()

  const { handleCreateCompany, handleMenuAction } = useCompanyActions(
    loadCompanies,
    closeContextMenu
  )

  const {
    setShowAddFilter,
    newFilterName,
    setNewFilterName,
    showToast,
    setShowToast,
    handleNewFilterClick,
    resetFilterInput
  } = useCompanyFiltersUI()

  const { formatDate, getDisplayValue, getDianStatus, getDianBadgeClass } = useCompanyUtils()

  const handleCreateSuccess = () => {
    closeModal()
    loadCompanies()
  }

  const onMenuAction = (action: string, companyId: string, companyName: string) => {
    handleMenuAction(action, companyId, companyName, companies, openEditModal)
  }

  const onSubmitCompany = (companyData: CompanyFormData) => {
    return handleCreateCompany(companyData, isEditMode, editingCompany)
  }

  const onAddFilterClick = () => {
    const success = handleAddFilter(newFilterName)
    if (success) {
      resetFilterInput()
    }
  }

  const onRemoveFilter = (filter: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleRemoveFilter(filter)
  }

  return (
    <ToastProvider>
      <div className="w-full p-6 space-y-6">
        <CompanyHeader totalCompanies={companies.length} />

        <CompanyControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          customFilters={customFilters}
          onRemoveFilter={onRemoveFilter}
          setShowAddFilter={setShowAddFilter}
          newFilterName={newFilterName}
          setNewFilterName={setNewFilterName}
          onAddFilterClick={onAddFilterClick}
          handleNewFilterClick={handleNewFilterClick}
          resetFilterInput={resetFilterInput}
          showAllPasswords={showAllPasswords}
          toggleAllPasswords={toggleAllPasswords}
          openCreateModal={openCreateModal} showAddFilter={false}        />

        <CompanyTable
          hasCompanies={hasCompanies}
          paginatedCompanies={paginatedCompanies}
          isDeletingCompany={isDeletingCompany}
          showPasswords={showPasswords}
          showAllPasswords={showAllPasswords}
          togglePasswordVisibility={togglePasswordVisibility}
          maskPassword={maskPassword}
          formatDate={formatDate}
          getDisplayValue={getDisplayValue}
          getDianStatus={getDianStatus}
          getDianBadgeClass={getDianBadgeClass}
          handleContextMenu={handleContextMenu}
          handleDoubleClick={handleDoubleClick}
          handleDoubleTap={handleDoubleTap}
          openCreateModal={openCreateModal}
        />

        <ContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          itemId={contextMenu.itemId}
          itemName={contextMenu.itemName}
          onAction={onMenuAction}
          onClose={closeContextMenu}
          menuRef={contextMenuRef}
          isDeleting={isDeletingCompany}
        />

        {hasCompanies && (
          <CompanyPagination
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            totalItems={filteredCompanies.length}
            currentPage={currentPage}
            totalPages={totalPages}
            goToPrevPage={goToPrevPage}
            goToNextPage={goToNextPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        <SlideModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={isEditMode ? "Editar empresa" : "Crear nueva empresa"}
        >
          <CreateCompanyForm
            onSubmit={onSubmitCompany}
            onCancel={closeModal}
            onSuccess={handleCreateSuccess}
            editingCompany={editingCompany}
          />
        </SlideModal>
      </div>

      <CompanyToast showToast={showToast} setShowToast={setShowToast} />
      <ToastViewport />
    </ToastProvider>
  )
}
