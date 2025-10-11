"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/ui/components/button"
import { Input } from "@/app/ui/components/input"
import { Label } from "@/app/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/select"
import { Switch } from "@/app/ui/components/switch"
import { useUser } from "@/app/presentation/hooks/User/useUser"

interface AddUserFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function AddUserForm({ onSubmit, onCancel }: AddUserFormProps) {
  const { createUser, isLoading, error } = useUser()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    password: "",
    verified: false,
    sendEmail: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const newUser = await createUser({
        name: formData.name,
        email: formData.email,
        role: formData.role ? formData.role.toLowerCase() : 'user',
        password: formData.password,
      })

      // Llamar a onSubmit para notificar éxito (ej. cerrar modal o refrescar lista)
      onSubmit(newUser)

      // Resetear formulario
      setFormData({
        name: "",
        email: "",
        role: "USER",
        password: "",
        verified: false,
        sendEmail: true,
      })
    } catch (err) {
      // El error ya se maneja en el hook, pero podemos agregar lógica adicional aquí si es necesario
      console.error('Error en submit:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Nombre
          </Label>
          <Input
            id="name"
            placeholder="Enter user name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* Role Field */}
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium text-foreground">
            Rol
          </Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verified Toggle */}
        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 border border-border">
          <div className="space-y-0.5">
            <Label htmlFor="verified" className="text-sm font-medium text-foreground cursor-pointer">
              Verified Account
            </Label>
            <p className="text-xs text-muted-foreground">Mark this account as verified</p>
          </div>
          <Switch
            id="verified"
            checked={formData.verified}
            onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>

        {/* Send Email Toggle */}
        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 border border-border">
          <div className="space-y-0.5">
            <Label htmlFor="sendEmail" className="text-sm font-medium text-foreground cursor-pointer">
              Send Welcome Email
            </Label>
            <p className="text-xs text-muted-foreground">Send account creation notification</p>
          </div>
          <Switch
            id="sendEmail"
            checked={formData.sendEmail}
            onCheckedChange={(checked) => setFormData({ ...formData, sendEmail: checked })}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-3 p-6 border-t border-border bg-background">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  )
}