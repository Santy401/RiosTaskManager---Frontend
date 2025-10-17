export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuData {
  itemId: string;
  itemName: string;
}

export type ContextMenuState = ContextMenuPosition & ContextMenuData & {
  visible: boolean;
};