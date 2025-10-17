import { useEffect } from "react"
import { useContextMenuBase } from "./useContextMenuBase";
import { useCloseContextMenu } from './useCloseContextMenu'

export const useContextMenuEffects = () => {
    const { contextMenu, contextMenuRef } = useContextMenuBase();
    const { closeContextMenu } = useCloseContextMenu();

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
}