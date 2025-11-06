"use client"

import { useCallback, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/components/StyledComponents/avatar"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Badge } from "@/app/ui/components/StyledComponents/badge"
import { Switch } from "@/app/ui/components/StyledComponents/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/components/StyledComponents/table"
import { ChevronLeft, ChevronRight, Building2, Eye, EyeOff, Loader2 } from "lucide-react"
import { SlideModal } from "../../components/ModalComponents/slideModal"
import { Toast, ToastProvider, ToastViewport } from "@/app/ui/components/StyledComponents/toast"
import { CreateCompanyForm } from "../../components/ModalComponents/createCompany"
import { useCompany } from "@/app/presentation/hooks/Company/useCompany"
import { useContextMenu } from '@/app/presentation/hooks/Menu/useContextMenu'
import { ContextMenu } from '@/app/ui/components/ListsComponents/ActionsMenu/ContextMenu'

// Interface para los datos del formulario (sin fechas)
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

// Interface para la empresa que viene de la API (con fechas como string)
interface CompanyFromAPI {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

// Interface para el formulario de edición (con fechas como Date)
interface CompanyForForm {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export function CompanyList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [markCompanies, setMarkCompanies] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customFilters, setCustomFilters] = useState<string[]>(['A', 'B', 'C'])
  const [showAddFilter, setShowAddFilter] = useState(false)
  const [newFilterName, setNewFilterName] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([])
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [editingCompany, setEditingCompany] = useState<CompanyForForm | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showAllPasswords, setShowAllPasswords] = useState(false)
  const itemsPerPage = 10
  const [showToast, setShowToast] = useState(false)

  const { getAllCompany, createCompany, deleteCompany, updateCompany, isDeletingCompany } = useCompany();
  const {
    contextMenu,
    handleDoubleClick,
    handleDoubleTap,
    handleContextMenu,
    closeContextMenu,
    contextMenuRef
  } = useContextMenu()


  const loadCompanies = useCallback(async () => {
    try {
      console.log('🔄 [COMPONENT] Cargando empresas...');
      const companyData = await getAllCompany();
      console.log('✅ [COMPONENT] Empresas cargadas:', companyData);
      setCompanies(companyData)
    } catch (error) {
      console.error('❌ [COMPONENT] Error al cargar empresas:', error)
    }
  }, [getAllCompany]);

  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  const hasCompanies = companies.length > 0

  const togglePasswordVisibility = (companyId: string) => {
    if (showAllPasswords) {
      return
    }

    setShowPasswords(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }))
  }

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

  const maskPassword = (password: string, show: boolean) => {
    if (!password || password === '') return 'No definida'
    return showAllPasswords || show ? password : '•'.repeat(8)
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
    return dian === "Activa" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
  }

  const toggleAllPasswords = () => {
    const newShowAllState = !showAllPasswords
    setShowAllPasswords(newShowAllState)

    if (newShowAllState) {
      setShowPasswords(() => {
        const newState: { [key: string]: boolean } = {}
        companies.forEach(company => {
          newState[company.id] = true
        })
        return newState
      })
    } else {
      setShowPasswords(() => {
        const newState: { [key: string]: boolean } = {}
        companies.forEach(company => {
          newState[company.id] = false
        })
        return newState
      })
    }
  }

  // Función para convertir CompanyFromAPI a CompanyForForm
  const convertToFormType = (company: CompanyFromAPI): CompanyForForm => {
    return {
      ...company,
      createdAt: new Date(company.createdAt),
      updatedAt: new Date(company.updatedAt)
    }
  }

  const handleMenuAction = async (action: string, companyId: string, companyName: string) => {
    try {
      switch (action) {
        case 'view':
          console.log('👁️ Ver empresa:', companyId)
          break
        case 'edit':
          console.log('✏️ Editar empresa:', companyId)
          const companyToEdit = companies.find(company => company.id === companyId)
          if (companyToEdit) {
            const companyForForm = convertToFormType(companyToEdit)
            setEditingCompany(companyForForm)
            setIsEditMode(true)
            setIsModalOpen(true)
          }
          break
        case 'delete':
          if (confirm(`¿Eliminar Empresa "${companyName}"?`)) {
            await deleteCompany(companyId)
            await loadCompanies()
          }
          break
      }
    } catch (error) {
      console.error('Error en acción:', error)
    } finally {
      closeContextMenu()
    }
  }

  const handleCreateCompany = async (companyData: CompanyFormData) => {
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

  const handleCreateSuccess = () => {
    setIsModalOpen(false)
    setEditingCompany(null)
    setIsEditMode(false)
    loadCompanies()
  }

  const filteredCompanies = companies.filter(company => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = company.name.toLowerCase().includes(searchLower) ||
      company.nit.toLowerCase().includes(searchLower) ||
      company.email.toLowerCase().includes(searchLower);

    // Si hay un filtro seleccionado, filtrar SOLO por tipo de empresa
    if (selectedFilter) {
      const filterLower = selectedFilter.toLowerCase();
      const companyTipo = company.tipo?.toLowerCase() || '';

      // Filtrar solo por tipo (coincidencia exacta o primera letra)
      const matchesFilter = companyTipo === filterLower ||
        companyTipo.startsWith(filterLower);

      return matchesSearch && matchesFilter;
    }

    return matchesSearch;
  });
  // Paginación
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)

  const handleAddFilter = () => {
    if (newFilterName.trim() && !customFilters.includes(newFilterName.trim())) {
      setCustomFilters(prev => [...prev, newFilterName.trim()])
      setNewFilterName("")
      setShowAddFilter(false)
    }
  }

  const applyFilter = (filter: string | null) => {
    setSelectedFilter(filter)
  }

  const handleRemoveFilter = (filterToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCustomFilters(prev => prev.filter(filter => filter !== filterToRemove))
    if (selectedFilter === filterToRemove) {
      setSelectedFilter(null)
    }
  }

  const handleNewFilterClick = () => {
    setShowToast(true)
    // Opcional: ocultar el toast después de unos segundos
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <ToastProvider>
      <div className="w-full p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Empresas</h1>
          <p className="text-sm text-muted-foreground">{companies.length} empresas registradas</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Input
              placeholder="Buscar empresa"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs bg-secondary/50 border-border text-white"
            />

            {/* Select de filtros personalizados */}
            <div className="flex items-center gap-2">
              <Select
                value={selectedFilter || "all"}
                onValueChange={(value) => setSelectedFilter(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[200px] bg-secondary/50 border-border text-white">
                  <SelectValue placeholder="Filtrar por..." />
                </SelectTrigger>
                <SelectContent>
                  {/* ✅ Opción "Todos" con valor no vacío */}
                  <SelectItem value="all">
                    <div className="flex items-center justify-between">
                      <span>Todas las empresas</span>
                    </div>
                  </SelectItem>

                  {customFilters.map((filter) => (
                    <SelectItem key={filter} value={filter}>
                      <div className="flex justify-between items-center group w-full">
                        <span className="flex-1">{filter}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground ml-2"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleRemoveFilter(filter, e)
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Botón para agregar nuevo filtro */}
              {showAddFilter ? (
                <div className="flex items-center gap-2 text-white">
                  <Input
                    placeholder="Nuevo filtro..."
                    value={newFilterName}
                    onChange={(e) => setNewFilterName(e.target.value)}
                    className="w-32 bg-secondary/50 border-border text-white"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleAddFilter}
                    disabled={!newFilterName.trim()}
                  >
                    ✓
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddFilter(false)
                      setNewFilterName("")
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewFilterClick}
                >
                  + Nuevo Filtro
                </Button>
              )}
            </div>

            {/* Botón para limpiar filtro */}
            {selectedFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFilter(null)}
                className="text-muted-foreground"
              >
                Limpiar filtro
              </Button>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant={showAllPasswords ? "default" : "outline"}
                size="sm"
                onClick={toggleAllPasswords}
                className={`flex items-center gap-2 ${showAllPasswords ? 'text-black' : 'text-white'}`}
              >
                {showAllPasswords ? <EyeOff className="h-4 w-4 text-black" /> : <Eye className="h-4 w-4" />}
                {showAllPasswords ? 'Ocultar' : 'Mostrar'} Contraseñas
              </Button>
            </div>
          </div>

          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              setEditingCompany(null)
              setIsEditMode(false)
              setIsModalOpen(true)
            }}
          >
            Agregar Empresa
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Logo</TableHead>
                  <TableHead className="text-muted-foreground font-medium">NOMBRE</TableHead>
                  <TableHead className="text-muted-foreground font-medium">TIPO</TableHead>
                  <TableHead className="text-muted-foreground font-medium">NIT</TableHead>
                  <TableHead className="text-muted-foreground font-medium">CÉDULA</TableHead>
                  <TableHead className="text-muted-foreground font-medium">CLAVE DIAN</TableHead>
                  <TableHead className="text-muted-foreground font-medium">FIRMA ELEC.</TableHead>
                  <TableHead className="text-muted-foreground font-medium">SOFTWARE CONTABLE</TableHead>
                  <TableHead className="text-muted-foreground font-medium">USUARIO</TableHead>
                  <TableHead className="text-muted-foreground font-medium">CLAVE SOFTWARE</TableHead>
                  <TableHead className="text-muted-foreground font-medium">SERVIDOR CORREO</TableHead>
                  <TableHead className="text-muted-foreground font-medium">E-MAIL</TableHead>
                  <TableHead className="text-muted-foreground font-medium">CLAVE CORREO</TableHead>
                  <TableHead className="text-muted-foreground font-medium">CLAVE CC</TableHead>
                  <TableHead className="text-muted-foreground font-medium">CLAVE SS</TableHead>
                  <TableHead className="text-muted-foreground font-medium">CLAVE ICA</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Creada</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Actualizada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasCompanies ? (
                  paginatedCompanies.map((company) => {
                    const isDeleting = isDeletingCompany(company.id);

                    return (
                      <TableRow
                        key={company.id}
                        className={`border-border hover:bg-secondary/30 ${isDeleting ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        onContextMenu={(e) => !isDeleting && handleContextMenu(e, company.id, company.name)}
                        onDoubleClick={(e) => !isDeleting && handleDoubleClick(e, company.id, company.name)}
                        onClick={(e) => !isDeleting && handleDoubleTap(e, company.id, company.name)}
                        onTouchStart={(e) => !isDeleting && handleDoubleTap(e, company.id, company.name)}
                      >
                        {/* Logo con loader */}
                        <TableCell>
                          {isDeleting ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                            </div>
                          ) : (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={undefined} />
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                <Building2 className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </TableCell>

                        {/* NOMBRE con estado de eliminación */}
                        <TableCell className="font-medium">
                          {isDeleting ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                              <span className="text-muted-foreground">Eliminando...</span>
                            </div>
                          ) : (
                            <span className="text-foreground">{getDisplayValue(company.name)}</span>
                          )}
                        </TableCell>

                        {/* TIPO */}
                        <TableCell>
                          {isDeleting ? (
                            <div className="h-6 flex items-center">
                              <span className="text-xs text-muted-foreground">-</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              {getDisplayValue(company.tipo)}
                            </Badge>
                          )}
                        </TableCell>

                        {/* NIT */}
                        <TableCell className="text-muted-foreground">
                          {isDeleting ? '-' : getDisplayValue(company.nit)}
                        </TableCell>

                        {/* CÉDULA */}
                        <TableCell className="text-muted-foreground">
                          {isDeleting ? '-' : getDisplayValue(company.cedula)}
                        </TableCell>

                        {/* CLAVE DIAN */}
                        <TableCell>
                          {isDeleting ? (
                            <div className="h-6 flex items-center">
                              <span className="text-xs text-muted-foreground">-</span>
                            </div>
                          ) : (
                            <Badge variant={getDianStatus(company.dian)}
                              className={getDianBadgeClass(company.dian)}>
                              {getDisplayValue(company.dian)}
                            </Badge>
                          )}
                        </TableCell>

                        {/* FIRMA ELEC. */}
                        <TableCell className="text-muted-foreground">
                          {isDeleting ? '-' : getDisplayValue(company.firma)}
                        </TableCell>

                        {/* SOFTWARE CONTABLE */}
                        <TableCell className="text-muted-foreground">
                          {isDeleting ? '-' : getDisplayValue(company.softwareContable)}
                        </TableCell>

                        {/* USUARIO */}
                        <TableCell className="text-muted-foreground">
                          {isDeleting ? '-' : getDisplayValue(company.usuario)}
                        </TableCell>

                        {/* CLAVE SOFTWARE */}
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {isDeleting ? '••••••••' : maskPassword(company.contraseña, showPasswords[company.id])}
                        </TableCell>

                        {/* SERVIDOR CORREO */}
                        <TableCell className="text-muted-foreground">
                          {isDeleting ? '-' : getDisplayValue(company.servidorCorreo)}
                        </TableCell>

                        {/* E-MAIL */}
                        <TableCell className="text-muted-foreground">
                          {isDeleting ? '-' : getDisplayValue(company.email)}
                        </TableCell>

                        {/* CLAVE CORREO */}
                        <TableCell>
                          {isDeleting ? (
                            <span className="text-muted-foreground font-mono text-sm">••••••••</span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground font-mono text-sm">
                                {maskPassword(company.claveCorreo, showPasswords[company.id])}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-transparent"
                                onClick={() => togglePasswordVisibility(company.id)}
                                disabled={showAllPasswords}
                              >
                                {showAllPasswords || showPasswords[company.id] ?
                                  <EyeOff className="h-3 w-3" /> :
                                  <Eye className="h-3 w-3" />
                                }
                              </Button>
                            </div>
                          )}
                        </TableCell>

                        {/* CLAVE CC */}
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {isDeleting ? '••••••••' : maskPassword(company.claveCC, showPasswords[company.id])}
                        </TableCell>

                        {/* CLAVE SS */}
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {isDeleting ? '••••••••' : maskPassword(company.claveSS, showPasswords[company.id])}
                        </TableCell>

                        {/* CLAVE ICA */}
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {isDeleting ? '••••••••' : maskPassword(company.claveICA, showPasswords[company.id])}
                        </TableCell>

                        {/* Fechas */}
                        <TableCell className="text-muted-foreground text-sm">
                          {isDeleting ? '-' : formatDate(company.createdAt)}
                        </TableCell>

                        <TableCell className="text-muted-foreground text-sm">
                          {isDeleting ? '-' : formatDate(company.updatedAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={18} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="text-center text-muted-foreground">
                          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No se encontraron Empresas</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Crear primera empresa
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <ContextMenu
            visible={contextMenu.visible}
            x={contextMenu.x}
            y={contextMenu.y}
            itemId={contextMenu.itemId}
            itemName={contextMenu.itemName}
            onAction={handleMenuAction}
            onClose={closeContextMenu}
            menuRef={contextMenuRef}
            isDeleting={isDeletingCompany}
          />
        </div>

        {/* Pagination - Solo se muestra si hay empresas */}
        {hasCompanies && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCompanies.length)} de {filteredCompanies.length} empresas
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="icon"
                    className={`h-8 w-8 ${currentPage === pageNum ? "" : "text-white"}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}

              {totalPages > 5 && (
                <>
                  <span className="px-2 text-muted-foreground">...</span>
                  <Button
                    variant={currentPage === totalPages ? "default" : "ghost"}
                    size="icon"
                    className={`h-8 w-8 ${currentPage === totalPages ? "" : "text-white"}`}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        )}

        {/* Slide-in Modal */}
        <SlideModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingCompany(null)
            setIsEditMode(false)
          }}
          title={isEditMode ? "Editar empresa" : "Crear nueva empresa"}
        >
          <CreateCompanyForm
            onSubmit={handleCreateCompany}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingCompany(null)
              setIsEditMode(false)
            }}
            onSuccess={handleCreateSuccess}
            editingCompany={editingCompany}
          />
        </SlideModal>
      </div>
      <Toast open={showToast} onOpenChange={setShowToast}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Función en desarrollo
            </p>
            <p className="text-xs text-muted-foreground">
              Los filtros personalizados estarán disponibles pronto
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowToast(false)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      </Toast>

      <ToastViewport />
    </ToastProvider>
  )
}