import { useRef, useState } from "react"

interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    itemId: string | null;
    itemName: string;
}

interface UseContextMenuBaseResult {
    contextMenu: ContextMenuState;
    setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;
    contextMenuRef: React.RefObject<HTMLDivElement | null>;
    lastTap: number;
    setLastTap: React.Dispatch<React.SetStateAction<number>>;
}

export const useContextMenuBase = (): UseContextMenuBaseResult => {
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