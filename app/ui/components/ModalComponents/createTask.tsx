"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Label } from "@/app/ui/components/StyledComponents/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Textarea } from "@/app/ui/components/StyledComponents/textarea"
import { useCompany } from "@/app/presentation/hooks/Company/useCompany"
import { useArea } from "@/app/presentation/hooks/Area/useArea"
import { useUser } from "@/app/presentation/hooks/User/useUser"

interface CreateTaskFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any // Para modo edición
}

export function CreateTaskForm({ onSubmit, onCancel, initialData }: CreateTaskFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "pendiente" as "pendiente" | "en_progreso" | "terminada",
    companyId: "",
    areaId: "",
    userId: "",
  })

  const { getAllCompay: getAllCompanies, isLoading: companiesLoading } = useCompany();
  const { getAllAreas: getAllAreas, isLoading: areasLoading } = useArea();
  const { getAllUsers, isLoading: usersLoading } = useUser();

  const [companies, setCompanies] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const hasLoaded = useRef(false);

  // ✅ Cargar datos solo una vez cuando el modal se abre
  useEffect(() => {
    if (hasLoaded.current) return;

    const loadSelectData = async () => {
      try {
        // ✅ Hacer las llamadas en paralelo
        const [companiesResponse, areasResponse, usersResponse] = await Promise.all([
          fetch('/api/admin/companies', { credentials: 'include' }),
          fetch('/api/admin/areas', { credentials: 'include' }),
          fetch('/api/admin/users', { credentials: 'include' })
        ]);

        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          setCompanies(companiesData);
        }

        if (areasResponse.ok) {
          const areasData = await areasResponse.json();
          setAreas(areasData);
        }

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

        hasLoaded.current = true; // ✅ Marcar como cargado

      } catch (error) {
        console.error('Error cargando datos:', error);
        // ✅ Mantener datos mock en caso de error
      }
    };

    loadSelectData();
  }, []); // ✅ Solo se ejecuta una vez

  // ✅ Cargar datos iniciales para edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
        status: initialData.status || "pendiente",
        companyId: initialData.companyId || initialData.company?.id || "",
        areaId: initialData.areaId || initialData.area?.id || "",
        userId: initialData.userId || initialData.user?.id || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      dueDate: new Date(formData.dueDate),
      // Para modo edición, incluir el ID
      ...(initialData?.id && { id: initialData.id })
    }

    onSubmit(submitData)
  }

  const isLoading = companiesLoading || areasLoading || usersLoading;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Nombre de la Tarea */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Nombre de la Tarea *
          </Label>
          <Input
            id="name"
            placeholder="Ingrese el nombre de la tarea"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-foreground">
            Descripción *
          </Label>
          <Textarea
            id="description"
            placeholder="Describa los detalles de la tarea..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-secondary/50 border-border text-white min-h-[100px] resize-none"
            required
          />
        </div>

        {/* Fecha de Vencimiento */}
        <div className="space-y-2">
          <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
            Fecha de Vencimiento *
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium text-foreground">
            Estado
          </Label>
          <Select value={formData.status} onValueChange={(value: "pendiente" | "en_progreso" | "terminada") => setFormData({ ...formData, status: value })}>
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Pendiente</span>
                </div>
              </SelectItem>
              <SelectItem value="en_progreso">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>En Progreso</span>
                </div>
              </SelectItem>
              <SelectItem value="terminada">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Terminada</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Empresa */}
        <div className="space-y-2">
          <Label htmlFor="companyId" className="text-sm font-medium text-foreground">
            Empresa *
          </Label>
          <Select
            value={formData.companyId}
            onValueChange={(value) => setFormData({ ...formData, companyId: value })}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue placeholder={isLoading ? "Cargando empresas..." : "Seleccione una empresa"} />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Área */}
        <div className="space-y-2">
          <Label htmlFor="areaId" className="text-sm font-medium text-foreground">
            Área *
          </Label>
          <Select
            value={formData.areaId}
            onValueChange={(value) => setFormData({ ...formData, areaId: value })}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue placeholder={isLoading ? "Cargando áreas..." : "Seleccione un área"} />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Usuario Responsable */}
        <div className="space-y-2">
          <Label htmlFor="userId" className="text-sm font-medium text-foreground">
            Usuario Responsable *
          </Label>
          <Select
            value={formData.userId}
            onValueChange={(value) => setFormData({ ...formData, userId: value })}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue placeholder={isLoading ? "Cargando usuarios..." : "Seleccione un usuario"} />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground">({user.email})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          * Campos obligatorios
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="hover:bg-secondary"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!formData.name || !formData.description || !formData.dueDate || !formData.companyId || !formData.areaId || !formData.userId || isLoading}
          >
            {initialData ? "Actualizar Tarea" : "Crear Tarea"}
          </Button>
        </div>
      </div>
    </form>
  )
}