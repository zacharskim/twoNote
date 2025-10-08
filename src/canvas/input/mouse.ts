// TODO: Mouse input handling
// - handleClick(event)
// - handleDrag(event)
// - getMouseButton(event) -> 'left', 'right', 'middle'
// - etc.

// handleClick
// handleMove
// handleDrag

export type MouseButton = "left" | "right" | "middle";

export const getMouseButton = (event: MouseEvent): MouseButton => {
  switch (event.button) {
    case 0:
      return "left";
    case 1:
      return "middle";
    case 2:
      return "right";
    default:
      return "left";
  }
};

export const handleMouseDown = (event: MouseEvent, canvas: HTMLCanvasElement): void => {};

export const handleMouseUp = (event: MouseEvent, canvas: HTMLCanvasElement): void => {};

export const handleMouseMove = (event: MouseEvent, canvas: HTMLCanvasElement): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
};

export const getCanvasPosition = (event: MouseEvent, canvas: HTMLCanvasElement): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

export const isDoubleClick = (lastClickTime: number, currentTime: number, threshold = 300): boolean => {
  // TODO: Implement - detect double-clicks
  return false;
};

export const getClickPosition = (event: MouseEvent): { x: number; y: number } => {
  // TODO: Implement - extract x, y coords
  return { x: 0, y: 0 };
};

export const isDragging = (
  startPos: { x: number; y: number },
  currentPos: { x: number; y: number },
  threshold = 5
): boolean => {
  // TODO: Implement - check if movement exceeds drag threshold
  return false;
};
