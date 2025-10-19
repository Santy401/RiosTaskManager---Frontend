import { useContextMenuBase } from './useContextMenuBase'
import { useContextMenuHandlers } from './useContextMenuHandlers'
import { useCloseContextMenu } from './useCloseContextMenu'
import { useContextMenuEffects } from './useContextMenuEffects'

export const useContextMenu = () => {
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
  }
}