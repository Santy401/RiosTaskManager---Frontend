"use client"

import { useState } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Label } from "@/app/ui/components/StyledComponents/label"
import { Loader2 } from "lucide-react"
import { toast } from "@/app/ui/components/StyledComponents/use-toast"

interface CreateCustomFilterFormProps {
  onSubmit: (filterName: string) => Promise<boolean>
  onCancel: () => void
  onSuccess: () => void
  onDeleteFilter: (filterName: string) => Promise<boolean>
  existingFilters: string[]
  selectedFilter?: string | null
}

export function CreateCustomFilterForm({
  onSubmit,
  onCancel,
  onSuccess,
  onDeleteFilter,
  existingFilters = [],
  selectedFilter = null
}: CreateCustomFilterFormProps) {
  const [filterName, setFilterName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!filterName.trim()) {
      setError('El nombre del filtro es obligatorio')
      return
    }

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

  const handleDeleteFilter = async (filter: string) => {
    if (selectedFilter === filter) {
      toast({
        title: 'No se puede eliminar',
        description: 'No puedes eliminar un filtro que está actualmente en uso. Por favor, selecciona otro filtro primero.',
        variant: 'destructive',
        duration: 5000
      })
      return
    }

    try {
      setIsDeleting(filter)
      const success = await onDeleteFilter(filter)
      if (!success) {
        toast({
          title: 'No se pudo eliminar',
          description: 'No se pudo eliminar el filtro. Asegúrate de que no esté siendo utilizado en ninguna otra parte del sistema.',
          variant: 'destructive',
          duration: 5000
        })
      } else {
        toast({
          title: 'Filtro eliminado',
          description: `El filtro "${filter}" ha sido eliminado correctamente.`,
          duration: 3000
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al intentar eliminar el filtro. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
        duration: 5000
      })
    } finally {
      setIsDeleting('')
    }
  }

  const nonDefaultFilters = existingFilters.filter(f => !['A', 'B', 'C'].includes(f.toUpperCase()))

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        {error && (
          <div className="bg-destructive/15 border border-destructive/50 text-destructive-foreground p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-foreground">Nuevo Filtro:</span>
            <Input
              id="filterName"
              placeholder="Nombre del filtro"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="bg-background text-foreground flex-1"
              disabled={isSubmitting}
              autoFocus
              maxLength={20}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !filterName.trim()}
              size="sm"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Crear'
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Creará un filtro para empresas de tipo: <span className="font-medium">{filterName || '...'}</span>
          </p>
        </div>
      </form>

      <div className="px-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="text-foreground">Filtros existentes ({nonDefaultFilters.length})</span>
          <svg
            className={`h-4 w-4 transition-transform text-foreground ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>

        {showFilters && (
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-2 text-foreground">
            {nonDefaultFilters.length > 0 ? (
              nonDefaultFilters.map((filter) => (
                <div key={filter} className="flex items-center justify-between group p-2 hover:bg-muted/50 rounded">
                  <span className="text-sm">{filter}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 p-0 ${
                      selectedFilter === filter 
                        ? 'text-muted-foreground cursor-not-allowed' 
                        : 'text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFilter(filter)
                    }}
                    disabled={isDeleting === filter || selectedFilter === filter}
                    title={selectedFilter === filter ? 'No se puede eliminar un filtro en uso' : 'Eliminar filtro'}
                  >
                    {isDeleting === filter ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2 text-foreground">No hay filtros personalizados</p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 p-4 pt-4 mt-auto border-t border-border text-foreground">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cerrar
        </Button>
      </div>
    </div>
  )
}
