import { ContextMenuState } from "@/app/domain/entities/Menu"
import { useRef, useState } from "react"

export const useContextMenuBase = () => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        visible: false,
        x: 0,
        y: 0,
        itemId: null,
        itemName: ""
    })

    const [lastTap, setLastTap] = useState(0)
    const contextMenuRef = useRef<HTMLDivElement>(null)

    return {
        contextMenu,
        setContextMenu,
        contextMenuRef,
        lastTap,
        setLastTap
    }
}