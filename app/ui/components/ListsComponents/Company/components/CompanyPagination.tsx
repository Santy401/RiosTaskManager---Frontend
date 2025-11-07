import { Button } from "@/app/ui/components/StyledComponents/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CompanyPaginationProps {
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  setCurrentPage: (page: number) => void;
}

export function CompanyPagination({
  startIndex,
  itemsPerPage,
  totalItems,
  currentPage,
  totalPages,
  goToPrevPage,
  goToNextPage,
  setCurrentPage
}: CompanyPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} de {totalItems} empresas
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </Button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "ghost"}
              size="icon"
              className={`h-8 w-8 ${currentPage === pageNum ? "" : "text-white"}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </Button>
          )
        })}

        {totalPages > 5 && (
          <>
            <span className="px-2 text-muted-foreground">...</span>
            <Button
              variant={currentPage === totalPages ? "default" : "ghost"}
              size="icon"
              className={`h-8 w-8 ${currentPage === totalPages ? "" : "text-white"}`}
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  )
}