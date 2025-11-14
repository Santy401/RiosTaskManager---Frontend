"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Label } from "@/app/ui/components/StyledComponents/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Textarea } from "@/app/ui/components/StyledComponents/textarea"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface CreateTaskFormProps {
  onSubmit: (data: any) => Promise<void> | void
  onCancel: () => void
  onSuccess?: () => void
  editingTask?: any | null;
}

// Helper function to get initial form state
const getInitialFormData = (editingTask: any) => ({
  name: editingTask?.name || "",
  description: editingTask?.description || "",
  dueDate: editingTask?.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : "",
  status: editingTask?.status || "pendiente" as "pendiente" | "en_progreso" | "terminada",
  companyId: editingTask?.companyId || editingTask?.company?.id || "",
  areaId: editingTask?.areaId || editingTask?.area?.id || "",
  userId: editingTask?.userId || editingTask?.user?.id || "",
});

export function CreateTaskForm({ onSubmit, onCancel, onSuccess, editingTask }: CreateTaskFormProps) {
  const [formData, setFormData] = useState(() => getInitialFormData(editingTask))

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const [companies, setCompanies] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const hasLoaded = useRef(false);

  // ✅ Cargar datos solo una vez cuando el modal se abre
  useEffect(() => {
    if (hasLoaded.current) return;

    const loadSelectData = async () => {
      setLoadingData(true)
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
        } else {
          console.error('Error cargando empresas:', companiesResponse.status);
        }

        if (areasResponse.ok) {
          const areasData = await areasResponse.json();
          setAreas(areasData);
        } else {
          console.error('Error cargando áreas:', areasResponse.status);
        }

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        } else {
          console.error('Error cargando usuarios:', usersResponse.status);
        }

        hasLoaded.current = true; // ✅ Marcar como cargado

      } catch (error) {
        console.error('Error cargando datos:', error);
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
      } finally {
        setLoadingData(false)
      }
    };

    loadSelectData();
  }, []); // ✅ Solo se ejecuta una vez

  // Update form data when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setFormData(getInitialFormData(editingTask));
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('📅 Fecha que se enviará:', formData.dueDate);
    console.log('📅 Fecha parseada:', new Date(formData.dueDate));

    // Validaciones
    if (!formData.name.trim()) {
      setError("El nombre de la tarea es obligatorio")
      return
    }
    if (!formData.description.trim()) {
      setError("La descripción es obligatoria")
      return
    }
    if (!formData.dueDate) {
      setError("La fecha de vencimiento es obligatoria")
      return
    }
    if (!formData.companyId) {
      setError("Debe seleccionar una empresa")
      return
    }
    if (!formData.areaId) {
      setError("Debe seleccionar un área")
      return
    }
    if (!formData.userId) {
      setError("Debe seleccionar un usuario responsable")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const submitData = {
        ...formData,
        dueDate: new Date(formData.dueDate),
        // Para modo edición, incluir el ID
        ...(editingTask?.id && { id: editingTask.id })
      }

      await onSubmit(submitData)

      // Mostrar estado de éxito
      setSuccess(true)

      // Esperar un momento para mostrar el éxito y luego cerrar
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 1500)

    } catch (err: any) {
      console.error('Error creando tarea:', err)
      setError(err.message || "Error al crear la tarea. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error cuando el usuario empiece a escribir/seleccionar
    if (error) setError(null)
  }

  const isFormValid = formData.name.trim() &&
    formData.description.trim() &&
    formData.dueDate &&
    formData.companyId &&
    formData.areaId &&
    formData.userId

  const isSubmitting = isLoading || loadingData

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto max-h-[70vh]">
        {/* Estado de éxito */}
        {success && (
          <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-400">
                  {editingTask ? "Tarea actualizada exitosamente" : "Tarea creada exitosamente"}
                </p>
                <p className="text-xs text-emerald-400/80">Redirigiendo...</p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && !success && (
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-400">
                  {editingTask ? "Error al actualizar tarea" : "Error al crear tarea"}
                </p>
                <p className="text-xs text-red-400/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading de datos */}
        {loadingData && (
          <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-400">Cargando datos...</p>
                <p className="text-xs text-blue-400/80">Por favor espere</p>
              </div>
            </div>
          </div>
        )}

        {/* Nombre de la Tarea */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Nombre de la Tarea *
          </Label>
          <Input
            id="name"
            placeholder="Ingrese el nombre de la tarea"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isSubmitting || success}
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
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="bg-secondary/50 border-border text-white min-h-[100px] resize-none"
            required
            disabled={isSubmitting || success}
          />
        </div>

        {/* Fecha de Vencimiento */}
        <div className="space-y-2">
          <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
            Fecha de Vencimiento *
          </Label>
          <div className="relative">
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className="bg-secondary/50 border-border text-white [color-scheme:dark] cursor-pointer opacity-0 absolute inset-0 w-full h-full z-10"
              required
              disabled={isSubmitting || success}
            />
            <div className="bg-secondary/50 border border-border rounded-md px-3 py-2 text-white text-sm h-10 flex items-center cursor-pointer">
              {formData.dueDate 
                ? new Date(formData.dueDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                : 'DD/MM/YYYY'
              }
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium text-foreground">
            Estado
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: "pendiente" | "en_progreso" | "terminada") => handleInputChange("status", value)}
            disabled={isSubmitting || success}
          >
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
            onValueChange={(value) => handleInputChange("companyId", value)}
            disabled={isSubmitting || success}
          >
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue placeholder={loadingData ? "Cargando empresas..." : "Seleccione una empresa"} />
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
            onValueChange={(value) => handleInputChange("areaId", value)}
            disabled={isSubmitting || success}
          >
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue placeholder={loadingData ? "Cargando áreas..." : "Seleccione un área"} />
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
            onValueChange={(value) => handleInputChange("userId", value)}
            disabled={isSubmitting || success}
          >
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue placeholder={loadingData ? "Cargando usuarios..." : "Seleccione un usuario"} />
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cancelando..." : "Cancelar"}
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-32"
            disabled={!isFormValid || isSubmitting || success}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {editingTask ? "Actualizando..." : "Creando..."}
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {editingTask ? "Actualizada" : "Creada"}
              </>
            ) : editingTask ? (
              "Actualizar Tarea"
            ) : (
              "Crear Tarea"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}