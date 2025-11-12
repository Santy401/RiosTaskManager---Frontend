import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Eye, EyeOff, Filter, Plus } from "lucide-react"
import { CompanyFilters } from "./CompanyFilters"

interface CompanyControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string | null;
  setSelectedFilter: (filter: string | null) => void;
  customFilters: string[];
  onRemoveFilter: (filter: string, e: React.MouseEvent) => void;
  showAllPasswords: boolean;
  toggleAllPasswords: () => void;
  openCreateModal: () => void;
  onOpenFilterModal: () => void;
}

export function CompanyControls({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  customFilters,
  onRemoveFilter,
  showAllPasswords,
  toggleAllPasswords,
  openCreateModal,
  onOpenFilterModal
}: CompanyControlsProps) {
  return (
    <div className="space-y-4">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <Input
          placeholder="Buscar empresa por nombre, NIT o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[300px] bg-secondary/50 border-border text-white"
        />
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAllPasswords}
          title={showAllPasswords ? "Ocultar contraseñas" : "Mostrar contraseñas"}
        >
          {showAllPasswords ? (
            <EyeOff className="h-4 w-4 text-white" />
          ) : (
            <Eye className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>

        <CompanyFilters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          customFilters={customFilters}
          onRemoveFilter={onRemoveFilter}
          resetFilterInput={() => {}}
        />
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onOpenFilterModal}
          className="gap-2 bg-secondary/50 border-border text-white hover:bg-secondary/70"
        >
          <Filter className="h-4 w-4 text-white" />
          Opciones De Filtro
        </Button>

        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          onClick={openCreateModal}
        >
          <Plus className="h-4 w-4" />
          Agregar Empresa
        </Button>
      </div>
    </div>

  </div>
  )
}