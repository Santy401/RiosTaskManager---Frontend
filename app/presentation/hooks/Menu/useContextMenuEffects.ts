import { useEffect } from "react"
import { useContextMenuBase } from "./useContextMenuBase";
import { useCloseContextMenu } from './useCloseContextMenu'

type ContextMenuBase = ReturnType<typeof useContextMenuBase>;

export const useContextMenuEffects = (base: ContextMenuBase): void => {
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

        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [contextMenu.visible, contextMenuRef, closeContextMenu]);
};