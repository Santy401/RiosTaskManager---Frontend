import { Button } from "@/app/ui/components/StyledComponents/button"
import { RefreshCw } from "lucide-react"

interface TaskHeaderProps {
  taskCount: number
  onRefresh: () => void
  isLoading: boolean
}

export function TaskHeader({ taskCount, onRefresh, isLoading }: TaskHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Tareas</h1>
          <p className="text-sm text-muted-foreground">
            {taskCount} tareas registradas
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 text-white"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>
    </div>
  )
}
