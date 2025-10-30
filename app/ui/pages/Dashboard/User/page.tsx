"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/components/StyledComponents/card"
import { Badge } from "@/app/ui/components/StyledComponents/badge"
import { CheckCircle2, Clock, AlertCircle, Calendar, Building2, MapPin, LogOut, FileText, User, Shield, Mail, Server, Key, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

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
    tipo: string
    nit: string
    cedula?: string
    dian: string
    firma: string
    softwareContable?: string
    usuario: string
    contraseña: string
    servidorCorreo: string
    email: string
    claveCorreo?: string
    claveCC?: string
    claveSS?: string
    claveICA?: string
  }
  area: {
    id: string
    name: string
  }
}

interface Company {
  id: string
  name: string
  tipo: string
  nit: string
  cedula?: string
  dian: string
  firma: string
  softwareContable?: string
  usuario: string
  contraseña: string
  servidorCorreo: string
  email: string
  claveCorreo?: string
  claveCC?: string
  claveSS?: string
  claveICA?: string
}

export default function UserTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})

  // Función para alternar visibilidad de contraseñas
  const togglePasswordVisibility = (companyId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }))
  }

  // Función para hacer logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        console.log('✅ Logout exitoso')
      }

      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      localStorage.clear()
      sessionStorage.clear()

      router.push('/ui/pages/Login')
    } catch (error) {
      console.error('❌ Error en logout:', error)
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      router.push('/ui/pages/Login')
    }
  }

  const loadUserData = useCallback(async () => {
    try {
      console.log('🔄 Cargando datos del usuario...')
      setError(null)

      // Cargar tareas
      const tasksResponse = await fetch('/api/tasks/my-tasks', {
        method: 'GET',
        credentials: 'include'
      })

      console.log('📥 Tasks response status:', tasksResponse.status)
      
      if (tasksResponse.ok) {
        const userTasks = await tasksResponse.json()
        console.log('✅ Tareas obtenidas:', userTasks.length, 'tareas')
        setTasks(userTasks)

        // Extraer empresas únicas de las tareas
        const uniqueCompanies = userTasks.reduce((acc: Company[], task: Task) => {
          if (task.company && !acc.find(c => c.id === task.company.id)) {
            acc.push(task.company)
          }
          return acc
        }, [])
        
        setCompanies(uniqueCompanies)
        console.log('🏢 Empresas encontradas:', uniqueCompanies.length)
      } else if (tasksResponse.status === 401) {
        console.log('🔐 No autorizado, redirigiendo al login...')
        document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        router.push('/ui/pages/Login')
        return
      } else {
        const errorText = await tasksResponse.text()
        console.error('❌ Error fetching tasks:', tasksResponse.status, errorText)
        setError(`Error al cargar tareas: ${tasksResponse.status}`)
      }
    } catch (error) {
      console.error('💥 Error loading user data:', error)
      setError('Error de conexión al cargar los datos')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void loadUserData()
  }, [loadUserData])

  const markTaskCompleted = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'terminada' })
      })

      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId
              ? { ...task, status: 'terminada' }
              : task
          )
        )
      } else if (response.status === 401) {
        console.log('🔐 Sesión expirada al actualizar tarea')
        document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        router.push('/ui/pages/Login')
      } else {
        console.error('Error updating task:', response.status)
        setError('Error al actualizar la tarea')
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      setError('Error de conexión al actualizar la tarea')
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
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Panel de Usuario</h1>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-[#0A0A0A]">
      {/* Header con título y botón de logout */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Panel de Usuario</h1>
          <p className="text-sm text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? 'tarea asignada' : 'tareas asignadas'} • 
            {companies.length} {companies.length === 1 ? 'empresa' : 'empresas'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout principal: Tareas a la izquierda, Empresas a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna de Tareas - Ocupa 2/3 en desktop */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Mis Tareas</h2>
          
          <div className="space-y-4">
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
                <Card key={task.id} className="bg-card border-border hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-foreground">{task.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(task.status)}
                          {isOverdue(task.dueDate) && task.status !== 'terminada' && (
                            <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                              Vencida
                            </Badge>
                          )}
                        </div>
                      </div>
                      {task.status !== 'terminada' && (
                        <Button
                          onClick={() => void markTaskCompleted(task.id)}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Completar
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
                        <span className="text-foreground">{task.company?.name || 'No especificada'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Área:</span>
                        <span className="text-foreground">{task.area?.name || 'No especificada'}</span>
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

        {/* Columna de Empresas - Ocupa 1/3 en desktop */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">Empresas Asignadas</h2>
          </div>
          
          <div className="space-y-4">
            {companies.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No hay empresas asignadas</h3>
                  <p className="text-muted-foreground">Las empresas aparecerán aquí cuando tengas tareas asignadas.</p>
                </CardContent>
              </Card>
            ) : (
              companies.map((company) => (
                <Card key={company.id} className="bg-card border-border hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {company.name}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit mt-2">
                          {company.tipo}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePasswordVisibility(company.id)}
                        className="flex items-center gap-1"
                      >
                        {showPasswords[company.id] ? (
                          <><EyeOff className="h-4 w-4" /> Ocultar</>
                        ) : (
                          <><Eye className="h-4 w-4" /> Mostrar</>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Información Básica */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Información Básica
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">NIT:</span>
                          <span className="text-foreground font-mono">{company.nit}</span>
                        </div>
                        {company.cedula && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cédula:</span>
                            <span className="text-foreground">{company.cedula}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Clave DIAN:</span>
                          <span className="text-foreground">{company.dian}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Firma Electrónica:</span>
                          <span className="text-foreground">{company.firma}</span>
                        </div>
                      </div>
                    </div>

                    {/* Credenciales de Software */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Credenciales Software
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Usuario:</span>
                          <span className="text-foreground">{company.usuario}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contraseña:</span>
                          <span className="text-foreground font-mono">
                            {showPasswords[company.id] ? company.contraseña : '••••••••'}
                          </span>
                        </div>
                        {company.softwareContable && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Software:</span>
                            <span className="text-foreground">{company.softwareContable}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Configuración de Correo */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Configuración Correo
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Servidor:</span>
                          <span className="text-foreground text-xs">{company.servidorCorreo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="text-foreground">{company.email}</span>
                        </div>
                        {company.claveCorreo && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Clave Correo:</span>
                            <span className="text-foreground font-mono">
                              {showPasswords[company.id] ? company.claveCorreo : '••••••••'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Claves Adicionales */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Claves Adicionales
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {company.claveCC && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Clave CC:</span>
                            <span className="text-foreground font-mono">
                              {showPasswords[company.id] ? company.claveCC : '••••••••'}
                            </span>
                          </div>
                        )}
                        {company.claveSS && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Clave SS:</span>
                            <span className="text-foreground font-mono">
                              {showPasswords[company.id] ? company.claveSS : '••••••••'}
                            </span>
                          </div>
                        )}
                        {company.claveICA && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Clave ICA:</span>
                            <span className="text-foreground font-mono">
                              {showPasswords[company.id] ? company.claveICA : '••••••••'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}