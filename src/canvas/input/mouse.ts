// TODO: Mouse input handling
// - handleClick(event)
// - handleDrag(event)
// - getMouseButton(event) -> 'left', 'right', 'middle'
// - etc.

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
