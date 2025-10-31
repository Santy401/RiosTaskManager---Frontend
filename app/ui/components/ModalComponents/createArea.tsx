"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Label } from "@/app/ui/components/StyledComponents/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface CreateAreaFormProps {
  onSubmit: (data: any) => Promise<void> | void
  onCancel: () => void
  onSuccess?: () => void
  editingArea?: Area | null;
}

export function CreateAreaForm({ onSubmit, onCancel, onSuccess }: CreateAreaFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    state: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError("El nombre del área es obligatorio")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const submissionData = {
        ...formData,
        state: formData.state ? 'activo' : 'inactivo'
      };

      // Ejecutar la función onSubmit (que debería ser async)
      await onSubmit(submissionData)

      // Mostrar estado de éxito
      setSuccess(true)

      // Esperar un momento para mostrar el éxito y luego cerrar
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 1000)

    } catch (err: any) {
      console.error('Error creando área:', err)
      setError(err.message || "Error al crear el área. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      // Special handling for state field
      if (field === 'state') {
        return {
          ...prev,
          [field]: value === 'activo' || value === true
        };
      }
      return { ...prev, [field]: value };
    });
    if (error) setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Estado de éxito */}
        {success && (
          <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-400">Área creada exitosamente</p>
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
                <p className="text-sm font-medium text-red-400">Error al crear área</p>
                <p className="text-xs text-red-400/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nombre del Área */}
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium text-foreground">
            Nombre del Área *
          </Label>
          <Input
            id="nombre"
            placeholder="Ej: Recursos Humanos, Tecnología, Ventas..."
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isLoading || success}
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label htmlFor="estado" className="text-sm font-medium text-foreground">
            Estado del Área
          </Label>
          <Select
            value={formData.state ? "activo" : "inactivo"}
            onValueChange={(value: "activo" | "inactivo") =>
              handleInputChange("state", value === "activo")
            }
            disabled={isLoading || success}
          >
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Activo</span>
                </div>
              </SelectItem>
              <SelectItem value="inactivo">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Inactivo</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Las áreas inactivas no estarán disponibles para asignación
          </p>
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
            disabled={isLoading}
          >
            {isLoading ? "Cancelando..." : "Cancelar"}
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-24"
            disabled={!formData.name.trim() || isLoading || success}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creando...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Creado
              </>
            ) : (
              "Crear Área"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}