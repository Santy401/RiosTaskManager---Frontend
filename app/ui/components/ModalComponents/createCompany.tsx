"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Label } from "@/app/ui/components/StyledComponents/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Switch } from "@/app/ui/components/StyledComponents/switch"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface CreateCompanyFormProps {
  onSubmit: (data: any) => Promise<void> | void
  onCancel: () => void
  onSuccess?: () => void
}

export function CreateCompanyForm({ onSubmit, onCancel, onSuccess }: CreateCompanyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    tipo: "A",
    nit: "",
    cedula: "",
    dian: "Activa",
    firma: "Digital",
    softwareContable: "",
    usuario: "",
    contraseña: "",
    servidorCorreo: "",
    email: "",
    claveCorreo: "",
    claveCC: "",
    claveSS: "",
    claveICA: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!formData.name.trim()) {
      setError("El nombre de la empresa es obligatorio")
      return
    }
    if (!formData.nit.trim()) {
      setError("El NIT es obligatorio")
      return
    }
    if (!formData.email.trim()) {
      setError("El email corporativo es obligatorio")
      return
    }
    if (!formData.usuario.trim()) {
      setError("El usuario administrador es obligatorio")
      return
    }
    if (!formData.contraseña.trim()) {
      setError("La contraseña es obligatoria")
      return
    }
    if (!formData.servidorCorreo.trim()) {
      setError("El servidor de correo es obligatorio")
      return
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingrese un email corporativo válido")
      return
    }
    if (!emailRegex.test(formData.usuario)) {
      setError("Por favor ingrese un usuario administrador válido")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Ejecutar la función onSubmit
      await onSubmit(formData)

      // Mostrar estado de éxito
      setSuccess(true)

      // Esperar un momento para mostrar el éxito y luego cerrar
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 1500)

    } catch (err: any) {
      console.error('Error creando empresa:', err)
      setError(err.message || "Error al crear la empresa. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError(null)
  }

  // Función para formatear NIT automáticamente
  const handleNitChange = (value: string) => {
    // Remover caracteres no numéricos excepto puntos y guiones
    const cleaned = value.replace(/[^\d.-]/g, '')
    setFormData(prev => ({ ...prev, nit: cleaned }))
    if (error) setError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto max-h-[70vh]">
        {/* Estado de éxito */}
        {success && (
          <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-400">Empresa creada exitosamente</p>
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
                <p className="text-sm font-medium text-red-400">Error al crear empresa</p>
                <p className="text-xs text-red-400/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Nombre de la Empresa *
          </Label>
          <Input
            id="name"
            placeholder="Ingrese el nombre de la empresa"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isLoading || success}
          />
        </div>

        {/* NIT Field */}
        <div className="space-y-2">
          <Label htmlFor="nit" className="text-sm font-medium text-foreground">
            NIT *
          </Label>
          <Input
            id="nit"
            placeholder="900.123.456-1"
            value={formData.nit}
            onChange={(e) => handleNitChange(e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isLoading || success}
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Corporativo *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@empresa.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isLoading || success}
          />
        </div>

        {/* Usuario Field */}
        <div className="space-y-2">
          <Label htmlFor="usuario" className="text-sm font-medium text-foreground">
            Usuario Administrador *
          </Label>
          <Input
            id="usuario"
            type="email"
            placeholder="admin@empresa.com"
            value={formData.usuario}
            onChange={(e) => handleInputChange("usuario", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isLoading || success}
          />
        </div>

        {/* Contraseña Field */}
        <div className="space-y-2">
          <Label htmlFor="contraseña" className="text-sm font-medium text-foreground">
            Contraseña *
          </Label>
          <Input
            id="contraseña"
            type="password"
            placeholder="Contraseña de acceso"
            value={formData.contraseña}
            onChange={(e) => handleInputChange("contraseña", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isLoading || success}
          />
        </div>

        {/* Servidor Correo Field */}
        <div className="space-y-2">
          <Label htmlFor="servidorCorreo" className="text-sm font-medium text-foreground">
            Servidor de Correo *
          </Label>
          <Input
            id="servidorCorreo"
            placeholder="smtp.gmail.com"
            value={formData.servidorCorreo}
            onChange={(e) => handleInputChange("servidorCorreo", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            required
            disabled={isLoading || success}
          />
        </div>

        {/* Tipo Field */}
        <div className="space-y-2">
          <Label htmlFor="tipo" className="text-sm font-medium text-foreground">
            Tipo de Empresa
          </Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => handleInputChange("tipo", value)}
            disabled={isLoading || success}
          >
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Tipo A</SelectItem>
              <SelectItem value="B">Tipo B</SelectItem>
              <SelectItem value="C">Tipo C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DIAN Status */}
        <div className="space-y-2">
          <Label htmlFor="dian" className="text-sm font-medium text-foreground">
            Estado DIAN
          </Label>
          <Select
            value={formData.dian}
            onValueChange={(value) => handleInputChange("dian", value)}
            disabled={isLoading || success}
          >
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activa">Activa</SelectItem>
              <SelectItem value="Inactiva">Inactiva</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cedula Field */}
        <div className="space-y-2">
          <Label htmlFor="cedula" className="text-sm font-medium text-foreground">
            Cédula
          </Label>
          <Input
            id="cedula"
            placeholder="Número de cédula"
            value={formData.cedula}
            onChange={(e) => handleInputChange("cedula", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            disabled={isLoading || success}
          />
        </div>

        {/* Software Contable Field */}
        <div className="space-y-2">
          <Label htmlFor="softwareContable" className="text-sm font-medium text-foreground">
            Software Contable
          </Label>
          <Input
            id="softwareContable"
            placeholder="Nombre del software contable"
            value={formData.softwareContable}
            onChange={(e) => handleInputChange("softwareContable", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            disabled={isLoading || success}
          />
        </div>

        {/* Clave Correo Field */}
        <div className="space-y-2">
          <Label htmlFor="claveCorreo" className="text-sm font-medium text-foreground">
            Clave Correo
          </Label>
          <Input
            id="claveCorreo"
            type="password"
            placeholder="Contraseña del correo"
            value={formData.claveCorreo}
            onChange={(e) => handleInputChange("claveCorreo", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            disabled={isLoading || success}
          />
        </div>

        {/* Clave CC Field */}
        <div className="space-y-2">
          <Label htmlFor="claveCC" className="text-sm font-medium text-foreground">
            Clave CC
          </Label>
          <Input
            id="claveCC"
            type="password"
            placeholder="Clave CC"
            value={formData.claveCC}
            onChange={(e) => handleInputChange("claveCC", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            disabled={isLoading || success}
          />
        </div>

        {/* Clave SS Field */}
        <div className="space-y-2">
          <Label htmlFor="claveSS" className="text-sm font-medium text-foreground">
            Clave SS
          </Label>
          <Input
            id="claveSS"
            type="password"
            placeholder="Clave SS"
            value={formData.claveSS}
            onChange={(e) => handleInputChange("claveSS", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            disabled={isLoading || success}
          />
        </div>

        {/* Clave ICA Field */}
        <div className="space-y-2">
          <Label htmlFor="claveICA" className="text-sm font-medium text-foreground">
            Clave ICA
          </Label>
          <Input
            id="claveICA"
            type="password"
            placeholder="Clave ICA"
            value={formData.claveICA}
            onChange={(e) => handleInputChange("claveICA", e.target.value)}
            className="bg-secondary/50 border-border text-white"
            disabled={isLoading || success}
          />
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-28"
            disabled={!formData.name.trim() || !formData.nit.trim() || !formData.email.trim() ||
              !formData.usuario.trim() || !formData.contraseña.trim() || !formData.servidorCorreo.trim() ||
              isLoading || success}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creando...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Creada
              </>
            ) : (
              "Crear Empresa"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}