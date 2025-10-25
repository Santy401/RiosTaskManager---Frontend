import { useContextMenuBase } from "./useContextMenuBase";

type ContextMenuBase = ReturnType<typeof useContextMenuBase>;

interface UseContextMenuHandlersResult {
    openContextMenu: (event: React.MouseEvent, itemId: string, itemName: string) => void;
    handleDoubleClick: (event: React.MouseEvent, itemId: string, itemName: string) => void;
    handleDoubleTap: (event: React.MouseEvent | React.TouchEvent, itemId: string, itemName: string) => void;
    handleContextMenu: (event: React.MouseEvent, itemId: string, itemName: string) => void;
}

export const useContextMenuHandlers = (base: ContextMenuBase): UseContextMenuHandlersResult => {
    const { setContextMenu, lastTap, setLastTap } = base;

    const openContextMenu = (event: React.MouseEvent, itemId: string, itemName: string) => {
        try {
            console.log('🟢 [CONTEXT MENU] Abriendo menú en:', { x: event.clientX, y: event.clientY, itemId, itemName });
            setContextMenu({
                visible: true,
                x: event.clientX,
                y: event.clientY,
                itemId,
                itemName
            });
        } catch (error) {
            console.error('❌ [CONTEXT MENU] Error abriendo menú contextual:', error);
        }
    };

    const handleDoubleTap = (event: React.MouseEvent | React.TouchEvent, itemId: string, itemName: string) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        if (tapLength < 300 && tapLength > 0) {
            console.log('👆 [CONTEXT MENU] Double tap detectado');
            if ('touches' in event) {
                const touch = event.touches[0];
                const syntheticEvent = {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    preventDefault: () => { }
                } as React.MouseEvent;
                openContextMenu(syntheticEvent, itemId, itemName);
            } else {
                openContextMenu(event as React.MouseEvent, itemId, itemName);
            }
        }

        setLastTap(currentTime);
    };

    const handleDoubleClick = (event: React.MouseEvent, itemId: string, itemName: string) => {
        console.log('🖱️ [CONTEXT MENU] Double click detectado');
        openContextMenu(event, itemId, itemName);
    };

    const handleContextMenu = (event: React.MouseEvent, itemId: string, itemName: string) => {
        console.log('📋 [CONTEXT MENU] Context menu solicitado');
        event.preventDefault();
        openContextMenu(event, itemId, itemName);
    };

    return { openContextMenu, handleDoubleClick, handleDoubleTap, handleContextMenu };
};