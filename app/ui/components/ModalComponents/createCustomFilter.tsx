"use client"

import { useState } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Label } from "@/app/ui/components/StyledComponents/label"
import { Loader2 } from "lucide-react"

interface CreateCustomFilterFormProps {
  onSubmit: (filterName: string) => Promise<boolean>
  onCancel: () => void
  onSuccess: () => void
}

export function CreateCustomFilterForm({
  onSubmit,
  onCancel,
  onSuccess
}: CreateCustomFilterFormProps) {
  const [filterName, setFilterName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!filterName.trim()) {
      setError('El nombre del filtro es obligatorio')
      return
    }

    // Validar que no sea A, B o C (ya existen)
    const upperName = filterName.trim().toUpperCase()
    if (['A', 'B', 'C'].includes(upperName)) {
      setError('Los filtros A, B y C ya existen por defecto')
      return
    }

    setIsSubmitting(true)
    try {
      const success = await onSubmit(filterName.trim())
      if (success) {
        onSuccess()
      } else {
        setError('Este filtro ya existe')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear filtro')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/15 border border-destructive/50 text-destructive-foreground p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="filterName" className="text-foreground">
          Nombre del Filtro
        </Label>
        <Input
          id="filterName"
          placeholder="Nombre del filtro"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="bg-secondary/50 border-border text-white"
          disabled={isSubmitting}
          autoFocus
          maxLength={20}
        />
        <p className="text-xs text-muted-foreground">
          Este filtro buscará empresas con tipo "{filterName || '...'}"
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !filterName.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : (
            'Crear Filtro'
          )}
        </Button>
      </div>
    </form>
  )
}
