import { useContextMenuBase } from './useContextMenuBase'
import { useContextMenuHandlers } from './useContextMenuHandlers'
import { useCloseContextMenu } from './useCloseContextMenu';

export const useContextMenu = () => {
  const { contextMenu, contextMenuRef } = useContextMenuBase();
  const { openContextMenu, handleDoubleClick, handleDoubleTap, handleContextMenu } = useContextMenuHandlers();
  const { closeContextMenu } = useCloseContextMenu();

  return {
    contextMenu,
    contextMenuRef,
    openContextMenu,
    closeContextMenu,
    handleDoubleTap,
    handleDoubleClick,
    handleContextMenu
  }
}