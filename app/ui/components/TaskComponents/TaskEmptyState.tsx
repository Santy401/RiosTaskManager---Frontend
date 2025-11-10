import { Button } from "@/app/ui/components/StyledComponents/button"
import { Calendar } from "lucide-react"

interface TaskEmptyStateProps {
  onAddTask: () => void
}

export function TaskEmptyState({ onAddTask }: TaskEmptyStateProps) {
  return (
    <div className="text-center text-muted-foreground py-12">
      <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No hay tareas todavía</h3>
      <p className="text-sm mb-4">Comienza creando tu primera tarea</p>
      <Button
        variant="outline"
        onClick={onAddTask}
      >
        Crear primera tarea
      </Button>
    </div>
  )
}
