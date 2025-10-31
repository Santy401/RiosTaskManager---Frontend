"use client"

import { useState, useEffect, useCallback } from "react"
import { Avatar, AvatarFallback } from "@/app/ui/components/StyledComponents/avatar"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Badge } from "@/app/ui/components/StyledComponents/badge"
import { Switch } from "@/app/ui/components/StyledComponents/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/components/StyledComponents/table"
import { CheckCircle2, XCircle, Circle, ChevronLeft, ChevronRight, User } from "lucide-react"
import { SlideModal } from "../../ModalComponents/slideModal"
import { AddUserForm } from "../../ModalComponents/createUser"
import { useUser } from "@/app/presentation/hooks/User/useUser"
import { useContextMenu } from '@/app/presentation/hooks/Menu/useContextMenu';
import { ContextMenu } from "../ActionsMenu/ContextMenu"

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  verified?: boolean;
  banned?: boolean;
  created?: string;
  lastActive?: string;
}

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [markEmails, setMarkEmails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])

  const { getAllUsers, isLoading, deleteUser, error } = useUser()
  const {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
    contextMenuRef
  } = useContextMenu()

  const loadUsers = useCallback(async () => {
    try {
      console.log('📋 [TABLE] Cargando usuarios...');
      const usersData = await getAllUsers();
      console.log('✅ [TABLE] Usuarios cargados en estado:', usersData);
      setUsers(usersData);
    } catch (err) {
      console.error('💥 [TABLE] Error cargando usuarios:', err);
    }
  }, [getAllUsers]);

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Verificar si hay usuarios para mostrar
  const hasUsers = filteredUsers.length > 0

  const handleMenuAction = async (action: string, userId: string, userName: string) => {
    try {
      switch (action) {
        case 'view':
          console.log('👁️ Ver usuario:', userId)
          break
        case 'edit':
          console.log('✏️ Editar usuario:', userId)
          break
        case 'delete':
          if (confirm(`¿Eliminar el usuario "${userName}"?`)) {
            await deleteUser(userId)
            await loadUsers()
          }
          break
      }
    } catch (error) {
      console.error('Error en acción:', error)
    } finally {
      closeContextMenu()
    }
  }

  // Manejar el context menu específico para la tabla
  const handleTableContextMenu = (e: React.MouseEvent, userId: string, userName: string) => {
    e.preventDefault() // Esto es crucial para que aparezca el context menu
    handleContextMenu(e, userId, userName)
  }

  const generateColorFromName = (name: string) => {
    const colors = [
      'bg-red-500/20 text-red-400',
      'bg-blue-500/20 text-blue-400',
      'bg-green-500/20 text-green-400',
      'bg-yellow-500/20 text-yellow-400',
      'bg-purple-500/20 text-purple-400',
      'bg-pink-500/20 text-pink-400',
      'bg-indigo-500/20 text-indigo-400',
      'bg-teal-500/20 text-teal-400',
      'bg-orange-500/20 text-orange-400',
      'bg-cyan-500/20 text-cyan-400'
    ];

    // Generar un índice basado en el nombre
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;

    return colors[index];
  };

  const handleAddUser = async () => {
    try {
      // Esta función se ejecutará cuando el formulario tenga éxito
      await loadUsers() // Recargar la lista de usuarios
    } catch (error) {
      console.error('Error actualizando lista de usuarios:', error)
    }
  }

  const handleCreateSuccess = () => {
    // Cerrar el modal después del éxito
    setIsModalOpen(false)
    // Recargar los usuarios
    loadUsers()
  }

  // Paginación
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="w-full p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Usuarios</h1>
        <p className="text-sm text-muted-foreground">{users.length} usuarios han registrado</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Input
            placeholder="Buscar usuario"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs bg-secondary/50 border-border text-white"
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-[170px] bg-secondary/50 border-border text-white">
              <SelectValue placeholder="Filter users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los usuarios</SelectItem>
              <SelectItem value="verified">Verificados</SelectItem>
              <SelectItem value="unverified">No verificados</SelectItem>
              <SelectItem value="banned">Baneados</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              checked={markEmails}
              onCheckedChange={setMarkEmails}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-sm text-foreground">Marcar Emails</span>
          </div>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Agregar Usuario"}
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Avatar</TableHead>
              <TableHead className="text-muted-foreground font-medium">Nombre</TableHead>
              <TableHead className="text-muted-foreground font-medium">Email</TableHead>
              {/* <TableHead className="text-muted-foreground font-medium">Verificado</TableHead>
              <TableHead className="text-muted-foreground font-medium">Baneado</TableHead> */}
              <TableHead className="text-muted-foreground font-medium">Rol</TableHead>
              {/* <TableHead className="text-muted-foreground font-medium">Creado</TableHead>
              <TableHead className="text-muted-foreground font-medium">Activo</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasUsers ? (
              paginatedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-border hover:bg-secondary/30 cursor-context-menu"
                  onContextMenu={(e) => handleTableContextMenu(e, user.id, user.name)}
                >
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={`text-xs ${generateColorFromName(user.name)}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  {/* <TableCell>
                    {user.verified ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    {user.banned ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </TableCell> */}
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                      {user.role}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="text-muted-foreground">{user.created || "N/A"}</TableCell>
                  <TableCell className="text-muted-foreground">{user.lastActive || "N/A"}</TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-center text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No se encontraron usuarios</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Crear primer usuario
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Context Menu */}
        {contextMenu.visible && (
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
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm">Error: {error}</div>
      )}

      {/* Pagination - Solo se muestra si hay usuarios */}
      {hasUsers && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
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

      <SlideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear nuevo usuario"
      >
        <AddUserForm
          onSubmit={handleAddUser}
          onCancel={() => setIsModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </SlideModal>
    </div>
  )
}