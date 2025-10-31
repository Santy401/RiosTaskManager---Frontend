"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Label } from "@/app/ui/components/StyledComponents/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Switch } from "@/app/ui/components/StyledComponents/switch"
import { useUser } from "@/app/presentation/hooks/User/useUser"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface AddUserFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  onSuccess?: () => void
}

export function AddUserForm({ onSubmit, onCancel, onSuccess }: AddUserFormProps) {
  const { createUser, isLoading: hookLoading, error: hookError } = useUser()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    password: "",
    verified: false,
    sendEmail: true,
  })
  const [localLoading, setLocalLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isLoading = hookLoading || localLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!formData.name.trim()) {
      setLocalError("El nombre es obligatorio")
      return
    }
    if (!formData.email.trim()) {
      setLocalError("El email es obligatorio")
      return
    }
    if (!formData.password.trim()) {
      setLocalError("La contraseña es obligatoria")
      return
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setLocalError("Por favor ingrese un email válido")
      return
    }

    // Validación de contraseña
    if (formData.password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLocalLoading(true)
    setLocalError(null)
    setSuccess(false)

    try {
      const newUser = await createUser(formData)
      
      // Mostrar estado de éxito
      setSuccess(true)
      
      // Llamar al callback de éxito del padre
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      } else {
        // Si no hay callback de éxito, usar el onSubmit tradicional
        onSubmit(newUser)
        setTimeout(() => {
          onCancel()
        }, 1500)
      }
      
    } catch (err: any) {
      console.error('Error creando usuario:', err)
      setLocalError(err.message || "Error al crear el usuario. Por favor, intenta nuevamente.")
    } finally {
      setLocalLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar errores cuando el usuario empiece a escribir
    if (localError) setLocalError(null)
  }

  const error = hookError || localError

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Estado de éxito */}
        {success && (
          <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-400">Usuario creado exitosamente</p>
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
                <p className="text-sm font-medium text-red-400">Error al crear usuario</p>
                <p className="text-xs text-red-400/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Nombre *
          </Label>
          <Input
            id="name"
            placeholder="Ingrese el nombre del usuario"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isLoading || success}
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isLoading || success}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Contraseña *
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isLoading || success}
          />
          <p className="text-xs text-muted-foreground">
            La contraseña debe tener al menos 6 caracteres
          </p>
        </div>

   
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium text-foreground">
            Rol
          </Label>
          <Select 
            value={formData.role} 
            onValueChange={(value) => handleInputChange("role", value)}
            disabled={isLoading || success}
          >
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">Usuario</SelectItem>
              <SelectItem value="ADMIN">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 border border-border">
          <div className="space-y-0.5">
            <Label htmlFor="verified" className="text-sm font-medium text-foreground cursor-pointer">
              Cuenta Verificada
            </Label>
            <p className="text-xs text-muted-foreground">Marcar esta cuenta como verificada</p>
          </div>
          <Switch
            id="verified"
            checked={formData.verified}
            onCheckedChange={(checked) => handleInputChange("verified", checked)}
            className="data-[state=checked]:bg-emerald-500"
            disabled={isLoading || success}
          />
        </div>

        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 border border-border">
          <div className="space-y-0.5">
            <Label htmlFor="sendEmail" className="text-sm font-medium text-foreground cursor-pointer">
              Enviar Email de Bienvenida
            </Label>
            <p className="text-xs text-muted-foreground">Enviar notificación de creación de cuenta</p>
          </div>
          <Switch
            id="sendEmail"
            checked={formData.sendEmail}
            onCheckedChange={(checked) => handleInputChange("sendEmail", checked)}
            className="data-[state=checked]:bg-emerald-500"
            disabled={isLoading || success}
          />
        </div> */}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-border bg-secondary/20">
        <div className="text-xs text-muted-foreground">
          * Campos obligatorios
        </div>
        <div className="flex items-center gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isLoading}
          >
            {isLoading ? "Cancelando..." : "Cancelar"}
          </Button>
          <Button 
            type="submit" 
            disabled={!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || isLoading || success}
            className="min-w-28"
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
              "Crear Usuario"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}