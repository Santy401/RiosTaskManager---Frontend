"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/components/StyledComponents/avatar"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Badge } from "@/app/ui/components/StyledComponents/badge"
import { Switch } from "@/app/ui/components/StyledComponents/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/components/StyledComponents/table"
import { CheckCircle2, XCircle, Circle, ChevronLeft, ChevronRight, Building2, EllipsisVertical } from "lucide-react"
import { SlideModal } from "../../components/ModalComponents/slideModal"
import { CreateCompanyForm } from "../../components/ModalComponents/createCompany"
import { useCompany } from "@/app/presentation/hooks/Company/useCompany"
import CompanyActionsMenu from "./ActionsMenu/CompanyActionsMenu"

interface Company {
  id: string;
  name: string;
  nit: string;
  email: string;
  dian: string;
  firma: string;
  usuario: string;
  servidorCorreo: string;
  tipo: string;
  contraseña: string;
}

export function CompanyList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [markCompanies, setMarkCompanies] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const itemsPerPage = 10

  const { getAllCompay, isLoading, createCompany, deleteCompany } = useCompany();

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      console.log('🔄 [COMPONENT] Cargando empresas...');
      const companyData = await getAllCompay();
      console.log('✅ [COMPONENT] Empresas cargadas:', companyData);
      setCompanies(companyData)
    } catch (error) {
      console.error('❌ [COMPONENT] Error al cargar empresas:', error)
    }
  }

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
              <SelectItem value="verified">A</SelectItem>
              <SelectItem value="unverified">B</SelectItem>
              <SelectItem value="active">C</SelectItem>
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
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsModalOpen(true)}>
          Agregar Empresa
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Logo</TableHead>
              <TableHead className="text-muted-foreground font-medium">Nombre</TableHead>
              <TableHead className="text-muted-foreground font-medium">Nit</TableHead>
              <TableHead className="text-muted-foreground font-medium">Email</TableHead>
              <TableHead className="text-muted-foreground font-medium">Dian</TableHead>
              <TableHead className="text-muted-foreground font-medium">Firma</TableHead>
              <TableHead className="text-muted-foreground font-medium">Usuario</TableHead>
              <TableHead className="text-muted-foreground font-medium">Contraseña</TableHead>
              <TableHead className="text-muted-foreground font-medium">Servidor Correo</TableHead>
              <TableHead className="text-muted-foreground font-medium">Tipo</TableHead>
              <TableHead className="text-muted-foreground font-medium">Creada</TableHead>
              <TableHead className="text-muted-foreground font-medium"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id} className="border-border hover:bg-secondary/30">
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      <Building2 className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-foreground">{company.name}</TableCell>
                <TableCell className="text-muted-foreground">{company.nit}</TableCell>
                <TableCell className="text-muted-foreground">{company.email}</TableCell>
                <TableCell>
                  <Badge variant={company.dian === "Activa" ? "default" : "secondary"} className={company.dian === "Activa" ? "bg-emerald-500/20 text-emerald-400" : ""}>
                    {company.dian}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{company.firma}</TableCell>
                <TableCell className="text-muted-foreground">{company.usuario}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{company.contraseña}</TableCell>
                <TableCell className="text-muted-foreground">{company.servidorCorreo}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {company.tipo}
                  </Badge>
                </TableCell>
                {/* <TableCell className="text-muted-foreground">{company.created || 'na'}</TableCell> */}
                <TableCell>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const newOpenMenuId = openMenuId === company.id ? null : company.id;
                        setOpenMenuId(newOpenMenuId);
                      }}
                      className="p-1 rounded hover:bg-secondary/50 transition-colors"
                    >
                      <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {/* Menú flotante para este usuario */}
                    {openMenuId === company.id && (
                      <CompanyActionsMenu
                        companyId={company.id}
                        isOpen={true}
                        onClose={() => setOpenMenuId(null)}
                        onCompanyDeleted={loadCompanies}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select defaultValue="10">
            <SelectTrigger className="w-[70px] bg-secondary/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="icon"
              className={`h-8 w-8 ${currentPage === page ? "" : "text-white"}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <span className="px-2 text-muted-foreground">...</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
            {Math.ceil(companies.length / itemsPerPage)}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(currentPage + 1)}>
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Slide-in Modal */}
      <SlideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear nueva empresa">
        <CreateCompanyForm onSubmit={createCompany} onCancel={() => setIsModalOpen(false)} />
      </SlideModal>
    </div>
  )
}
