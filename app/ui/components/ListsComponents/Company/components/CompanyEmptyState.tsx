import { Button } from "@/app/ui/components/StyledComponents/button"
import { TableCell, TableRow } from "@/app/ui/components/StyledComponents/table"
import { Building2 } from "lucide-react"

interface CompanyEmptyStateProps {
  openCreateModal: () => void;
}

export function CompanyEmptyState({ openCreateModal }: CompanyEmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={18} className="text-center py-8">
        <div className="flex justify-center items-center">
          <div className="text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron Empresas</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={openCreateModal}
            >
              Crear primera empresa
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}