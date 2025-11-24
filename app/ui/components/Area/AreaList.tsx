"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/components/StyledComponents/avatar"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/components/StyledComponents/table"
import { ChevronLeft, ChevronRight, MapPin, Loader2 } from "lucide-react"
import { SlideModal } from "../ModalComponents/slideModal"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useContextMenu } from "@/app/presentation/hooks/Menu/useContextMenu"
import { useAreaFilters } from "@/app/presentation/hooks/Area/hooks/useAreaFilters"
import { useAreaActions } from "@/app/presentation/hooks/Area/hooks/useAreaActions"
import { ContextMenu } from "../ListsComponents/ActionsMenu/ContextMenu"
import { CreateAreaForm } from "../ModalComponents/createArea"

export function AreaList() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    handleAddAreaClick,
    handleCreateArea,
    handleCreateSuccess,
    isLoading,
    isDeletingArea,
    handleMenuAction,
    isEditMode,
    setIsEditMode,
    isModalOpen,
    setIsModalOpen,
    editingArea,
    setEditingArea,
    closeContextMenu,
    areas
  } = useAreaActions()

  const { filteredAreas, searchQuery, setSearchQuery } = useAreaFilters(areas)

  const {
    contextMenu,
    handleDoubleClick,
    handleDoubleTap,
    handleContextMenu,
    contextMenuRef
  } = useContextMenu()

  const hasAreas = filteredAreas.length > 0

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <div className="w-full p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Áreas</h1>
          <p className="text-sm text-muted-foreground">{filteredAreas.length} áreas registradas</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Input
              placeholder="Buscar área"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md bg-secondary/50 border-border text-white"
            />
            {/* <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-[180px] bg-secondary/50 border-border text-white">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="activo">Activas</SelectItem>
              <SelectItem value="inactivo">Inactivas</SelectItem>
            </SelectContent>
          </Select> */}
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAddAreaClick}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Agregar Área"}
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Icono</TableHead>
                <TableHead className="text-muted-foreground font-medium">Nombre del Área</TableHead>
                {/* <TableHead className="text-muted-foreground font-medium">Estado</TableHead> */}
                <TableHead className="text-muted-foreground font-medium">Fecha Creación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasAreas ? (
                filteredAreas.map((area) => {
                  const isDeleting = isDeletingArea(area.id);

                  return (
                    <TableRow
                      key={area.id}
                      className={`border-border hover:bg-secondary/30 ${isDeleting ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      onContextMenu={(e) => !isDeleting && handleContextMenu(e, area.id, area.name)}
                      onDoubleClick={(e) => !isDeleting && handleDoubleClick(e, area.id, area.name)}
                      onClick={(e) => !isDeleting && handleDoubleTap(e, area.id, area.name)}
                      onTouchStart={(e) => !isDeleting && handleDoubleTap(e, area.id, area.name)}
                    >
                      <TableCell>
                        {isDeleting ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                          </div>
                        ) : (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt={`Icono de ${area.name}`} />
                            <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                              <MapPin className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {isDeleting ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            <span className="text-muted-foreground">Eliminando...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{area.name}</span>
                          </div>
                        )}
                      </TableCell>
                      {/* <TableCell>
                      {isDeleting ? (
                        <div className="h-6 flex items-center">
                          <span className="text-xs text-muted-foreground">-</span>
                        </div>
                      ) : (
                        <Badge
                          variant={area.state === "activo" ? "default" : "secondary"}
                          className={
                            area.state === "activo"
                              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }
                        >
                          {area.state === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      )}
                    </TableCell> */}
                      <TableCell className="text-muted-foreground">
                        {isDeleting ? '-' : new Date(area.createdAt).toLocaleDateString('es-ES')}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No se encontraron áreas</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleAddAreaClick}
                      >
                        Crear primera área
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ContextMenu
            visible={contextMenu.visible}
            x={contextMenu.x}
            y={contextMenu.y}
            itemId={contextMenu.itemId}
            itemName={contextMenu.itemName}
            onAction={handleMenuAction}
            onClose={closeContextMenu}
            menuRef={contextMenuRef}
            isDeleting={isDeletingArea}
          />
        </div>

        {hasAreas && (
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
              <span className="text-sm text-muted-foreground">
                Mostrando {Math.min(filteredAreas.length, itemsPerPage)} de {filteredAreas.length} áreas
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
                {Math.ceil(filteredAreas.length / itemsPerPage)}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(filteredAreas.length / itemsPerPage)}
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <div className="text-foreground">Cargando áreas...</div>
          </div>
        )}

        <SlideModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingArea(null)
            setIsEditMode(false)
          }}
          title={isEditMode ? "Editar área" : "Crear nueva área"}
        >
          <CreateAreaForm
            onSubmit={handleCreateArea}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingArea(null)
              setIsEditMode(false)
            }}
            onSuccess={handleCreateSuccess}
            editingArea={editingArea}
          />
        </SlideModal>
      </div>
    </>
  )
}