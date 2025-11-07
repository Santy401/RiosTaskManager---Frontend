import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Eye, EyeOff } from "lucide-react"
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
  openCreateModal
}: CompanyControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <Input
          placeholder="Buscar empresa"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs bg-secondary/50 border-border text-white"
        />

        <CompanyFilters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          customFilters={customFilters}
          onRemoveFilter={onRemoveFilter}
          showAddFilter={showAddFilter}
          setShowAddFilter={setShowAddFilter}
          newFilterName={newFilterName}
          setNewFilterName={setNewFilterName}
          onAddFilterClick={onAddFilterClick}
          handleNewFilterClick={handleNewFilterClick}
          resetFilterInput={resetFilterInput}
        />

        {selectedFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFilter(null)}
            className="text-muted-foreground"
          >
            Limpiar filtro
          </Button>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant={showAllPasswords ? "default" : "outline"}
            size="sm"
            onClick={toggleAllPasswords}
            className={`flex items-center gap-2 ${showAllPasswords ? 'text-black' : 'text-white'}`}
          >
            {showAllPasswords ? <EyeOff className="h-4 w-4 text-black" /> : <Eye className="h-4 w-4" />}
            {showAllPasswords ? 'Ocultar' : 'Mostrar'} Contraseñas
          </Button>
        </div>
      </div>

      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={openCreateModal}
      >
        Agregar Empresa
      </Button>
    </div>
  )
}