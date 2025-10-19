import { useContextMenuBase } from "./useContextMenuBase";

export const useCloseContextMenu = (base: ReturnType<typeof useContextMenuBase>) => {
    const { setContextMenu } = base;

    const closeContextMenu = () => {
        console.log('🔴 [CONTEXT MENU] Cerrando menú');
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            itemId: null,
            itemName: ""
        });
    };

    return {
        closeContextMenu
    };
};