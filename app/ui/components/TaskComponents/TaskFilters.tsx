import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Switch } from "@/app/ui/components/StyledComponents/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Loader2, ArrowUpDown } from "lucide-react"
import type { SortOption } from "@/app/presentation/hooks/Task/hooks/useTaskFilters"

interface TaskFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterStatus: string
  setFilterStatus: (status: string) => void
  showOnlyActive: boolean
  setShowOnlyActive: (show: boolean) => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  isLoading: boolean
  onAddTask: () => void
}

export function TaskFilters({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  showOnlyActive,
  setShowOnlyActive,
  sortBy,
  setSortBy,
  isLoading,
  onAddTask
}: TaskFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <Input
          placeholder="Buscar tarea, descripción, empresa, área o responsable"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md bg-secondary/50 border-border text-white"
          disabled={isLoading}
        />
        <Select value={filterStatus} onValueChange={setFilterStatus} disabled={isLoading}>
          <SelectTrigger className="w-[180px] bg-secondary/50 border-border text-white">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="en_progreso">En Progreso</SelectItem>
            <SelectItem value="terminada">Terminada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)} disabled={isLoading}>
          <SelectTrigger className="w-[200px] bg-secondary/50 border-border text-white">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin ordenar</SelectItem>
            <SelectItem value="date-asc">Más próxima</SelectItem>
            <SelectItem value="date-desc">Más lejana</SelectItem>
            <SelectItem value="name-asc">A → Z</SelectItem>
            <SelectItem value="name-desc">Z → A</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 hidden">
          <Switch 
            className="data-[state=checked]:bg-emerald-500" 
            disabled={isLoading}
            checked={showOnlyActive}
            onCheckedChange={setShowOnlyActive}
          />
        </div>
      </div>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={onAddTask}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Cargando...
          </>
        ) : (
          "Agregar Tarea"
        )}
      </Button>
    </div>
  )
}
