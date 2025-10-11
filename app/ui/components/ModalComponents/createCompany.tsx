"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/ui/components/button"
import { Input } from "@/app/ui/components/input"
import { Label } from "@/app/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/select"
import { Switch } from "@/app/ui/components/switch"

interface CreateCompanyFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function CreateCompanyForm({ onSubmit, onCancel }: CreateCompanyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    nit: "",
    email: "",
    dian: "Activa",
    firma: "Digital",
    usuario: "",
    contraseña: "",
    servidorCorreo: "",
    tipo: "A",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Nombre de la Empresa
          </Label>
          <Input
            id="name"
            placeholder="Ingrese el nombre de la empresa"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* NIT Field */}
        <div className="space-y-2">
          <Label htmlFor="nit" className="text-sm font-medium text-foreground">
            NIT
          </Label>
          <Input
            id="nit"
            placeholder="900.123.456-1"
            value={formData.nit}
            onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Corporativo
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@empresa.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* Usuario Field */}
        <div className="space-y-2">
          <Label htmlFor="usuario" className="text-sm font-medium text-foreground">
            Usuario Administrador
          </Label>
          <Input
            id="usuario"
            type="email"
            placeholder="admin@empresa.com"
            value={formData.usuario}
            onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* Contraseña Field */}
        <div className="space-y-2">
          <Label htmlFor="contraseña" className="text-sm font-medium text-foreground">
            Contraseña
          </Label>
          <Input
            id="contraseña"
            type="password"
            placeholder="Contraseña de acceso"
            value={formData.contraseña}
            onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* Servidor Correo Field */}
        <div className="space-y-2">
          <Label htmlFor="servidorCorreo" className="text-sm font-medium text-foreground">
            Servidor de Correo
          </Label>
          <Input
            id="servidorCorreo"
            placeholder="smtp.gmail.com"
            value={formData.servidorCorreo}
            onChange={(e) => setFormData({ ...formData, servidorCorreo: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* Tipo Field */}
        <div className="space-y-2">
          <Label htmlFor="tipo" className="text-sm font-medium text-foreground">
            Tipo de Empresa
          </Label>
          <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
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
          <Select value={formData.dian} onValueChange={(value) => setFormData({ ...formData, dian: value })}>
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activa">Activa</SelectItem>
              <SelectItem value="Inactiva">Inactiva</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Firma Type */}
        <div className="space-y-2">
          <Label htmlFor="firma" className="text-sm font-medium text-foreground">
            Tipo de Firma
          </Label>
          <Select value={formData.firma} onValueChange={(value) => setFormData({ ...formData, firma: value })}>
            <SelectTrigger className="bg-secondary/50 border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Digital">Digital</SelectItem>
              <SelectItem value="Tradicional">Tradicional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} className="hover:bg-secondary">
          Cancelar
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Crear Empresa
        </Button>
      </div>
    </form>
  )
}
