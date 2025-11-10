import { useState, useEffect } from 'react'

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  itemId: string | null
  itemName: string
}

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    itemId: null,
    itemName: ""
  })

  const openContextMenu = (event: React.MouseEvent, itemId: string, itemName: string) => {
    event.preventDefault()
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      itemId,
      itemName
    })
  }

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }))
  }

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        closeContextMenu()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [contextMenu.visible])

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu
  }
}
