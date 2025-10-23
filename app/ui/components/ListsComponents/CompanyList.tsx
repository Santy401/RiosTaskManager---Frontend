"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/components/StyledComponents/avatar"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Badge } from "@/app/ui/components/StyledComponents/badge"
import { Switch } from "@/app/ui/components/StyledComponents/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/components/StyledComponents/table"
import { CheckCircle2, XCircle, Circle, ChevronLeft, ChevronRight, Building2, EllipsisVertical, Eye, EyeOff } from "lucide-react"
import { SlideModal } from "../../components/ModalComponents/slideModal"
import { CreateCompanyForm } from "../../components/ModalComponents/createCompany"
import { useCompany } from "@/app/presentation/hooks/Company/useCompany"
import { useContextMenu } from '@/app/presentation/hooks/Menu/useContextMenu'
import { ContextMenu } from '@/app/ui/components/ListsComponents/ActionsMenu/ContextMenu'

interface Company {
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

export function CompanyList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [markCompanies, setMarkCompanies] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showAllPasswords, setShowAllPasswords] = useState(false)
  const itemsPerPage = 10

  const { getAllCompany, isLoading, createCompany, deleteCompany, updateCompany } = useCompany();
  const {
    contextMenu,
    handleDoubleClick,
    handleDoubleTap,
    handleContextMenu,
    closeContextMenu,
    contextMenuRef
  } = useContextMenu()

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      console.log('🔄 [COMPONENT] Cargando empresas...');
      const companyData = await getAllCompany();
      console.log('✅ [COMPONENT] Empresas cargadas:', companyData);
      setCompanies(companyData)
    } catch (error) {
      console.error('❌ [COMPONENT] Error al cargar empresas:', error)
    }
  }

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
      setShowPasswords(prev => {
        const newState: { [key: string]: boolean } = {}
        companies.forEach(company => {
          newState[company.id] = true
        })
        return newState
      })
    } else {
      setShowPasswords(prev => {
        const newState: { [key: string]: boolean } = {}
        companies.forEach(company => {
          newState[company.id] = false
        })
        return newState
      })
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
          // Encuentra la empresa a editar
          const companyToEdit = companies.find(company => company.id === companyId)
          if (companyToEdit) {
            setEditingCompany(companyToEdit)
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

  const handleCreateCompany = async (companyData: any) => {
    try {
      if (isEditMode && editingCompany) {
        // Modo edición
        await updateCompany({ companyId: editingCompany.id, data: companyData })
      } else {
        // Modo creación
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

  // Filtrar empresas basado en la búsqueda
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.nit.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Paginación
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)

  return (
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
          <Select defaultValue="all">
            <SelectTrigger className="w-[170px] bg-secondary/50 border-border text-white">
              <SelectValue placeholder="Filtrar empresas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las empresas</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="inactive">Inactivas</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              checked={markCompanies}
              onCheckedChange={setMarkCompanies}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-sm text-foreground">Marcar Empresas</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showAllPasswords ? "default" : "outline"}
              size="sm"
              onClick={toggleAllPasswords}
              className="flex items-center gap-2"
            >
              {showAllPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                paginatedCompanies.map((company) => (
                  <TableRow key={company.id} className="border-border hover:bg-secondary/30"
                    onContextMenu={(e) => handleContextMenu(e, company.id, company.name)}
                    onDoubleClick={(e) => handleDoubleClick(e, company.id, company.name)}
                    onClick={(e) => handleDoubleTap(e, company.id, company.name)}
                    onTouchStart={(e) => handleDoubleTap(e, company.id, company.name)}
                  >
                    {/* Logo */}
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    {/* NOMBRE */}
                    <TableCell className="font-medium text-foreground">{getDisplayValue(company.name)}</TableCell>

                    {/* TIPO */}
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getDisplayValue(company.tipo)}
                      </Badge>
                    </TableCell>

                    {/* NIT */}
                    <TableCell className="text-muted-foreground">{getDisplayValue(company.nit)}</TableCell>

                    {/* CÉDULA */}
                    <TableCell className="text-muted-foreground">{getDisplayValue(company.cedula)}</TableCell>

                    {/* CLAVE DIAN */}
                    <TableCell>
                      <Badge variant={getDianStatus(company.dian)}
                        className={getDianBadgeClass(company.dian)}>
                        {getDisplayValue(company.dian)}
                      </Badge>
                    </TableCell>

                    {/* FIRMA ELEC. */}
                    <TableCell className="text-muted-foreground">{getDisplayValue(company.firma)}</TableCell>

                    {/* SOFTWARE CONTABLE */}
                    <TableCell className="text-muted-foreground">
                      {getDisplayValue(company.softwareContable)}
                    </TableCell>

                    {/* USUARIO */}
                    <TableCell className="text-muted-foreground">{getDisplayValue(company.usuario)}</TableCell>

                    {/* CLAVE SOFTWARE */}
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {maskPassword(company.contraseña, showPasswords[company.id])}
                    </TableCell>

                    {/* SERVIDOR CORREO */}
                    <TableCell className="text-muted-foreground">{getDisplayValue(company.servidorCorreo)}</TableCell>

                    {/* E-MAIL */}
                    <TableCell className="text-muted-foreground">{getDisplayValue(company.email)}</TableCell>

                    {/* CLAVE CORREO */}
                    <TableCell>
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
                    </TableCell>

                    {/* CLAVE CC */}
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {maskPassword(company.claveCC, showPasswords[company.id])}
                    </TableCell>

                    {/* CLAVE SS */}
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {maskPassword(company.claveSS, showPasswords[company.id])}
                    </TableCell>

                    {/* CLAVE ICA */}
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {maskPassword(company.claveICA, showPasswords[company.id])}
                    </TableCell>

                    {/* Fechas */}
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(company.createdAt)}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(company.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
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
          editingCompany={editingCompany} // ← Agrega esta prop
        />
      </SlideModal>
    </div>
  )
}