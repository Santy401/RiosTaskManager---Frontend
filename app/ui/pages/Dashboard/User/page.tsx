"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/components/StyledComponents/card"
import { Badge } from "@/app/ui/components/StyledComponents/badge"
import { CheckCircle2, Clock, AlertCircle, Calendar, Building2, MapPin } from "lucide-react"

interface Task {
  id: string
  name: string
  description: string
  status: 'pendiente' | 'en_progreso' | 'terminada'
  dueDate: string
  createdAt: string
  company: {
    id: string
    name: string
  }
  area: {
    id: string
    name: string
  }
}

interface User {
  name?: string
  email: string
  role: string
}

export default function UserTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const loadUserTasks = useCallback(async () => {
    try {
      // Get user info from token
      const token = document.cookie.split(';').find(c => c.trim().startsWith('auth-token='))
      if (token) {
        const tokenValue = token.split('=')[1]
        const payload = JSON.parse(atob(tokenValue.split('.')[1]))
        setUser(payload)
      }

      // Fetch user's tasks
      const response = await fetch('/api/tasks/my-tasks')
      if (response.ok) {
        const userTasks = await response.json()
        setTasks(userTasks)
      }
    } catch (error) {
      console.error('Error loading user tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUserTasks()
  }, [loadUserTasks])

  const markTaskCompleted = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'terminada' })
      })

      if (response.ok) {
        // Update local state
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId
              ? { ...task, status: 'terminada' }
              : task
          )
        )
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'terminada':
        return <Badge className="bg-green-500/20 text-green-400">Completada</Badge>
      case 'en_progreso':
        return <Badge className="bg-blue-500/20 text-blue-400">En Progreso</Badge>
      case 'pendiente':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pendiente</Badge>
      default:
        return <Badge variant="secondary">Desconocido</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Mis Tareas</h1>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Mis Tareas</h1>
        <p className="text-sm text-muted-foreground">
          {tasks.length} tareas asignadas
        </p>
      </div>

      {user && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium text-foreground">{user.name || 'Usuario'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rol</p>
                <p className="font-medium text-foreground">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No tienes tareas asignadas</h3>
              <p className="text-muted-foreground">Las tareas que se te asignen aparecerán aquí.</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-foreground">{task.name}</CardTitle>
                    {getStatusBadge(task.status)}
                  </div>
                  {task.status !== 'terminada' && (
                    <Button
                      onClick={() => void markTaskCompleted(task.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Marcar como Completada
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{task.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Empresa:</span>
                    <span className="text-foreground">{task.company.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Área:</span>
                    <span className="text-foreground">{task.area.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Fecha límite:</span>
                    <span className={`font-medium ${isOverdue(task.dueDate) && task.status !== 'terminada' ? 'text-red-400' : 'text-foreground'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                    {isOverdue(task.dueDate) && task.status !== 'terminada' && (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Creada:</span>
                    <span className="text-foreground">{formatDate(task.createdAt)}</span>
                  </div>
                </div>

                {task.status === 'terminada' && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-medium">Tarea completada</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}