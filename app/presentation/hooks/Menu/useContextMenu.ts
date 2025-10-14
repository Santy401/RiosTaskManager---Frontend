import { useState, useRef, useEffect } from 'react'

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  itemId: string | null;
  itemName: string;
}

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    itemId: null,
    itemName: ""
  })
  
  const [lastTap, setLastTap] = useState(0)
  const contextMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        closeContextMenu()
      }
    }

    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [contextMenu.visible])

  const openContextMenu = (event: React.MouseEvent, itemId: string, itemName: string) => {
    try {
      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        itemId,
        itemName
      })
    } catch (error) {
      console.error('Error abriendo menú contextual:', error)
    }
  }

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }))
  }

  const handleDoubleTap = (event: React.MouseEvent | React.TouchEvent, itemId: string, itemName: string) => {
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTap

    if (tapLength < 300 && tapLength > 0) {
      if ('touches' in event) {
        const touch = event.touches[0]
        const syntheticEvent = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          preventDefault: () => {}
        } as React.MouseEvent
        openContextMenu(syntheticEvent, itemId, itemName)
      } else {
        openContextMenu(event as React.MouseEvent, itemId, itemName)
      }
    }
    
    setLastTap(currentTime)
  }

  const handleDoubleClick = (event: React.MouseEvent, itemId: string, itemName: string) => {
    openContextMenu(event, itemId, itemName)
  }

  const handleContextMenu = (event: React.MouseEvent, itemId: string, itemName: string) => {
    event.preventDefault()
    openContextMenu(event, itemId, itemName)
  }

  return {
    contextMenu,
    contextMenuRef,
    openContextMenu,
    closeContextMenu,
    handleDoubleTap,
    handleDoubleClick,
    handleContextMenu
  }
}