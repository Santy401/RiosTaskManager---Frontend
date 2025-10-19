import { useEffect } from "react"
import { useContextMenuBase } from "./useContextMenuBase";
import { useCloseContextMenu } from './useCloseContextMenu'

export const useContextMenuEffects = (base: ReturnType<typeof useContextMenuBase>) => {
    const { contextMenu, contextMenuRef } = base;
    const { closeContextMenu } = useCloseContextMenu(base);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                closeContextMenu();
            }
        };

        if (contextMenu.visible) {
            console.log('📌 [CONTEXT MENU] Agregando listener para click fuera');
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [contextMenu.visible, contextMenuRef, closeContextMenu]);
};