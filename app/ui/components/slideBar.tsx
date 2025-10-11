"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Briefcase,
  SquareCheckBig,
  ListIcon,
} from "lucide-react"

interface SidebarProps {
  isSelected: string
  setIsSelected: (value: string) => void
}

export const SlideBar = ({ isSelected, setIsSelected }: SidebarProps) => {
  const [isListasExpanded, setIsListasExpanded] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [ isLoading ,setIsLoading] = useState(false)

  const handleListasClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
    }
    setIsListasExpanded(!isListasExpanded)
    setIsSelected("listas")
  }

  const menuItems = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "tareas", label: "Dashboard", icon: LayoutDashboard },
    { id: "Tareas", label: "Tareas", icon: ListIcon },
    { id: "listas", label: "Listas", icon: SquareCheckBig, hasSubmenu: true },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ]

  const subMenuItems = [
    { id: "listas-usuarios", label: "Usuarios", icon: Users },
    { id: "listas-empresas", label: "Empresas", icon: Building2 },
    { id: "listas-areas", label: "Áreas", icon: Briefcase },
  ]

const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        console.log('Attempting logout...');

        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        // Redirigir inmediatamente sin esperar respuesta
        window.location.href = '/ui/pages/Login';

    } catch (err) {
        console.error('Logout error:', err);
        // Redirigir incluso si hay error
        window.location.href = '/ui/pages/Login';
    } finally {
        setIsLoading(false);
    }
};

  return (
    <nav
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-screen border-r border-border bg-[#0F0F0F] transition-all duration-300 ease-in-out flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && <span className="font-semibold text-foreground">TaskManager</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-accent rounded-md transition-colors ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = isSelected === item.id || (item.hasSubmenu && isSelected.startsWith("listas-"))

            return (
              <div key={item.id}>
                <li
                  onClick={() => (item.hasSubmenu ? handleListasClick() : setIsSelected(item.id))}
                  className={`${
                    isActive
                      ? "text-foreground bg-accent border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  } cursor-pointer hover:bg-accent/50 px-3 py-2 rounded-md flex items-center gap-3 transition-all group relative`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.hasSubmenu && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isListasExpanded ? "rotate-180" : ""}`}
                        />
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-border">
                      {item.label}
                    </div>
                  )}
                </li>

                {/* Submenu Items */}
                {item.hasSubmenu && isListasExpanded && !isCollapsed && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {subMenuItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      return (
                        <li
                          key={subItem.id}
                          onClick={() => setIsSelected(subItem.id)}
                          className={`${
                            isSelected === subItem.id
                              ? "text-foreground bg-accent border border-border"
                              : "text-muted-foreground hover:text-foreground"
                          } cursor-pointer hover:bg-accent/50 px-3 py-2 rounded-md flex items-center gap-2 text-sm transition-all`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </li>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </ul>
      </div>

      {/* Footer Section */}
      {!isCollapsed && (
        <div className="p-3 border-t border-border">
          <button className="text-xs text-muted-foreground px-3 py-2" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}
    </nav>
  )
}
