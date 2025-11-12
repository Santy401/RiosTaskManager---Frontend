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
  showAddFilter: boolean;
  setShowAddFilter: (show: boolean) => void;
  newFilterName: string;
  setNewFilterName: (name: string) => void;
  onAddFilterClick: () => void;
  handleNewFilterClick: () => void;
  resetFilterInput: () => void;
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
  showAddFilter,
  setShowAddFilter,
  newFilterName,
  setNewFilterName,
  onAddFilterClick,
  handleNewFilterClick,
  resetFilterInput,
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
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

        <CompanyFilters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          customFilters={customFilters}
          onRemoveFilter={onRemoveFilter}
          showAddFilter={false}
          setShowAddFilter={() => {}}
          newFilterName=""
          setNewFilterName={() => {}}
          onAddFilterClick={() => {}}
          handleNewFilterClick={() => {}}
          resetFilterInput={() => {}}
        />
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onOpenFilterModal}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Nuevo Filtro
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