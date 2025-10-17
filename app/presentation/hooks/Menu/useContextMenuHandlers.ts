import { useContextMenuBase } from "./useContextMenuBase";

export const useContextMenuHandlers = () => {
    const { setContextMenu, lastTap, setLastTap } = useContextMenuBase();

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

    const handleDoubleTap = (event: React.MouseEvent | React.TouchEvent, itemId: string, itemName: string) => {
        const currentTime = new Date().getTime()
        const tapLength = currentTime - lastTap

        if (tapLength < 300 && tapLength > 0) {
            if ('touches' in event) {
                const touch = event.touches[0]
                const syntheticEvent = {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    preventDefault: () => { }
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

    return { openContextMenu, handleDoubleClick, handleDoubleTap, handleContextMenu }
}