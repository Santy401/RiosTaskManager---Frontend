"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/components/avatar"
import { Button } from "@/app/ui/components/button"
import { Input } from "@/app/ui/components/input"
import { Badge } from "@/app/ui/components/badge"
import { Switch } from "@/app/ui/components/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/components/table"
import { CheckCircle2, XCircle, Circle, ChevronLeft, ChevronRight, Building2 } from "lucide-react"
import { SlideModal } from "../../components/ModalComponents/slideModal"
import { CreateCompanyForm } from "../../components/ModalComponents/createCompany"

// Sample company data
const companies = [
  {
    id: 1,
    name: "TechCorp Solutions",
    nit: "900.123.456-1",
    email: "contact@techcorp.com",
    dian: "Activa",
    firma: "Digital",
    usuario: "admin@techcorp.com",
    contraseña: "●●●●●●●●",
    servidorCorreo: "smtp.gmail.com",
    tipo: "A",
    created: "28 Aug 24",
  },
  {
    id: 2,
    name: "Global Industries",
    nit: "800.987.654-2",
    email: "info@globalind.com",
    dian: "Inactiva",
    firma: "Tradicional",
    usuario: "contact@globalind.com",
    contraseña: "●●●●●●●●",
    servidorCorreo: "mail.globalind.com",
    tipo: "A",
    created: "15 Jul 24",
  },
  {
    id: 3,
    name: "StartupHub",
    nit: "901.555.789-3",
    email: "hello@startuphub.io",
    dian: "Activa",
    firma: "Digital",
    usuario: "team@startuphub.io",
    contraseña: "●●●●●●●●",
    servidorCorreo: "smtp.office365.com",
    tipo: "B",
    created: "03 Sep 24",
  },
  {
    id: 4,
    name: "Design Studio Pro",
    nit: "802.444.333-4",
    email: "team@designpro.com",
    dian: "Activa",
    firma: "Digital",
    usuario: "designer@designpro.com",
    contraseña: "●●●●●●●●",
    servidorCorreo: "smtp.gmail.com",
    tipo: "C",
    created: "12 Jun 24",
  },
  {
    id: 5,
    name: "HealthTech Systems",
    nit: "903.777.888-5",
    email: "contact@healthtech.sys",
    dian: "Activa",
    firma: "Digital",
    usuario: "admin@healthtech.sys",
    contraseña: "●●●●●●●●",
    servidorCorreo: "smtp.healthtech.sys",
    tipo: "B",
    created: "20 May 24",
  },
]

export function CompanyList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [markCompanies, setMarkCompanies] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 10

  const handleAddCompany = (data: any) => {
    console.log("[v0] New company data:", data)
    setIsModalOpen(false)
    // Here you would typically send the data to your backend
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
                <TableCell className="text-muted-foreground">{company.created}</TableCell>
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
        <CreateCompanyForm onSubmit={handleAddCompany} onCancel={() => setIsModalOpen(false)} />
      </SlideModal>
    </div>
  )
}
