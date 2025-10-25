import { useContextMenuBase } from './useContextMenuBase'
import { useContextMenuHandlers } from './useContextMenuHandlers'
import { useCloseContextMenu } from './useCloseContextMenu'
import { useContextMenuEffects } from './useContextMenuEffects'

interface UseContextMenuResult {
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    itemId: string | null;
    itemName: string;
  };
  contextMenuRef: React.RefObject<HTMLDivElement | null>; 
  openContextMenu: (event: React.MouseEvent, itemId: string, itemName: string) => void;
  closeContextMenu: () => void;
  handleDoubleTap: (event: React.MouseEvent | React.TouchEvent, itemId: string, itemName: string) => void;
  handleDoubleClick: (event: React.MouseEvent, itemId: string, itemName: string) => void;
  handleContextMenu: (event: React.MouseEvent, itemId: string, itemName: string) => void;
}

export const useContextMenu = (): UseContextMenuResult => {
  const base = useContextMenuBase();

  const handlers = useContextMenuHandlers(base);
  const closeMenu = useCloseContextMenu(base);

  useContextMenuEffects(base);

  return {
    contextMenu: base.contextMenu,
    contextMenuRef: base.contextMenuRef,
    openContextMenu: handlers.openContextMenu,
    closeContextMenu: closeMenu.closeContextMenu,
    handleDoubleTap: handlers.handleDoubleTap,
    handleDoubleClick: handlers.handleDoubleClick,
    handleContextMenu: handlers.handleContextMenu
  };
};