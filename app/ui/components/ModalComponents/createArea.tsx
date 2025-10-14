"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Label } from "@/app/ui/components/StyledComponents/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Switch } from "@/app/ui/components/StyledComponents/switch"

interface CreateAreaFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function CreateAreaForm({ onSubmit, onCancel }: CreateAreaFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    state: "activo" as "activo" | "inactivo",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Nombre del Área */}
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium text-foreground">
            Nombre del Área *
          </Label>
          <Input
            id="nombre"
            placeholder="Ej: Recursos Humanos, Tecnología, Ventas..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-secondary/50 border-border text-white"
            required
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label htmlFor="estado" className="text-sm font-medium text-foreground">
            Estado del Área
          </Label>
          <Select 
            value={formData.state} 
            onValueChange={(value: "activo" | "inactivo") => setFormData({ ...formData, state: value })}
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
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!formData.name}
          >
            Crear Área
          </Button>
        </div>
      </div>
    </form>
  )
}