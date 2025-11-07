import { Button } from "@/app/ui/components/StyledComponents/button"
import { Toast } from "@/app/ui/components/StyledComponents/toast"

interface CompanyToastProps {
  showToast: boolean;
  setShowToast: (show: boolean) => void;
}

export function CompanyToast({ showToast, setShowToast }: CompanyToastProps) {
  return (
    <Toast open={showToast} onOpenChange={setShowToast}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            Función en desarrollo
          </p>
          <p className="text-xs text-muted-foreground">
            Los filtros personalizados estarán disponibles pronto
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowToast(false)}
          className="h-6 w-6 p-0"
        >
          ×
        </Button>
      </div>
    </Toast>
  )
}