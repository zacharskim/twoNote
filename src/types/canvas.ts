export interface TextBox {
  id: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasState {
  textBoxes: TextBox[];
  selectedId: string | null;
  editingId: string | null;
  cursorPosition: number;
}

export interface DragState {
  isDragging: boolean;
  offsetX: number;
  offsetY: number;
}
