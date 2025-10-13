"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/components/StyledComponents/avatar"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Badge } from "@/app/ui/components/StyledComponents/badge"
import { Switch } from "@/app/ui/components/StyledComponents/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/components/StyledComponents/table"
import { CheckCircle2, XCircle, Circle, ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react"
import { SlideModal } from "../../ModalComponents/slideModal"
import { AddUserForm } from "../../ModalComponents/createUser"
import { useUser } from "@/app/presentation/hooks/User/useUser"
import UserActionsMenu from "./UserActionsMenu"

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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)

  const { getAllUsers, isLoading, error } = useUser()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      console.log('📋 [TABLE] Cargando usuarios...');
      const usersData = await getAllUsers();
      console.log('✅ [TABLE] Usuarios cargados en estado:', usersData);
      setUsers(usersData);
    } catch (err) {
      console.error('💥 [TABLE] Error cargando usuarios:', err);
    }
  };

  const handleAddUser = async (data: any) => {
    try {
      await loadUsers()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error creando usuario:', err)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              <TableHead className="text-muted-foreground font-medium">Verificado</TableHead>
              <TableHead className="text-muted-foreground font-medium">Baneado</TableHead>
              <TableHead className="text-muted-foreground font-medium">Rol</TableHead>
              <TableHead className="text-muted-foreground font-medium">Creado</TableHead>
              <TableHead className="text-muted-foreground font-medium">Activo</TableHead>
              <TableHead className="text-muted-foreground font-medium"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-border hover:bg-secondary/30">
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-foreground text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.created || "N/A"}</TableCell>
                <TableCell className="text-muted-foreground">{user.lastActive || "N/A"}</TableCell>
                <TableCell>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const newOpenMenuId = openMenuId === user.id ? null : user.id;

                        if (newOpenMenuId) {
                          setMenuPosition({
                            top: rect.bottom + window.scrollY,
                            left: rect.left + window.scrollX,
                          });
                        }

                        setOpenMenuId(newOpenMenuId);
                      }}
                      className="p-1 rounded hover:bg-secondary/50 transition-colors"
                    >
                      <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {/* Menú flotante para este usuario */}
                    {openMenuId === user.id && menuPosition && (
                      <UserActionsMenu
                        userId={user.id}
                        isOpen={true}
                        onClose={() => setOpenMenuId(null)}
                        onUserDeleted={loadUsers} 
                        position={menuPosition}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {error && (
        <div className="text-red-500 text-sm">Error: {error}</div>
      )}

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
            24
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(currentPage + 1)}>
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      <SlideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crea un nuevo usuario">
        <AddUserForm onSubmit={handleAddUser} onCancel={() => setIsModalOpen(false)} />
      </SlideModal>
    </div>
  )
}