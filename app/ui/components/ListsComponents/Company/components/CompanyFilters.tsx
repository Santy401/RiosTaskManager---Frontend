import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"

interface CompanyFiltersProps {
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
}

export function CompanyFilters({
  selectedFilter,
  setSelectedFilter,
  customFilters,
  onRemoveFilter,
  showAddFilter,
  newFilterName,
  setShowAddFilter,
  setNewFilterName,
  onAddFilterClick,
  handleNewFilterClick,
  resetFilterInput
}: CompanyFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedFilter || "all"}
        onValueChange={(value) => setSelectedFilter(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[150px] bg-secondary/50 border-border text-white">
          <SelectValue placeholder="Filtrar por..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center justify-between">
              <span>Todas las empresas</span>
            </div>
          </SelectItem>

          {customFilters.map((filter) => (
            <SelectItem key={filter} value={filter}>
              <div className="flex justify-between items-center group w-full">
                <span className="flex-1">{filter}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground ml-2"
                  onClick={(e) => onRemoveFilter(filter, e)}
                >
                  ×
                </Button>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}