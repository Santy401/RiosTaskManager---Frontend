import { useState } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/app/ui/components/StyledComponents/alert-dialog"
import { Loader2, X } from "lucide-react"

interface CompanyFiltersProps {
  selectedFilter: string | null;
  setSelectedFilter: (filter: string | null) => void;
  customFilters: string[];
  onRemoveFilter: (filter: string, e: React.MouseEvent) => void;
  resetFilterInput: () => void;
}

export function CompanyFilters({
  selectedFilter,
  setSelectedFilter,
  customFilters,
  onRemoveFilter,
}: CompanyFiltersProps) {
  const [filterToRemove, setFilterToRemove] = useState<string | null>(null)
  const [isRemoving, setIsRemoving] = useState(false)
  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedFilter || "all"}
        onValueChange={(value) => setSelectedFilter(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-fit bg-secondary/50 border-border text-white">
          <SelectValue placeholder="Filtrar por..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center justify-between">
              <span>Todas las empresas</span>
            </div>
          </SelectItem>

          {customFilters.map((filter) => {
            const isDefaultFilter = ['A', 'B', 'C'].includes(filter.toUpperCase())
            return (
              <SelectItem key={filter} value={filter}>
                <div className="flex justify-between items-center w-full">
                  <span className="flex-1">{filter}</span>
                  {!isDefaultFilter && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 opacity-70 hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground ml-2 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFilterToRemove(filter)
                      }}
                      disabled={isRemoving}
                    >
                      {isRemoving && filterToRemove === filter ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      <AlertDialog open={!!filterToRemove} onOpenChange={(open) => !open && setFilterToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar filtro?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar el filtro "{filterToRemove}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isRemoving}
              onClick={async (e) => {
                if (!filterToRemove) return
                try {
                  setIsRemoving(true)
                  await new Promise(resolve => onRemoveFilter(filterToRemove, e as unknown as React.MouseEvent))
                  setFilterToRemove(null)
                } finally {
                  setIsRemoving(false)
                }
              }}
            >
              {isRemoving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Filtro'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}