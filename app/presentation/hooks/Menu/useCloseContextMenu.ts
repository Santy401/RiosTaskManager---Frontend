import { useContextMenuBase } from "./useContextMenuBase";

export const useCloseContextMenu = () => {
    const { setContextMenu } = useContextMenuBase();
    
    const closeContextMenu = () => {
        setContextMenu((prev: any) => ({ ...prev, visible: false }))
    }

    return { closeContextMenu }
}