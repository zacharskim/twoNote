import { TextBox } from "@/types/canvas";

// Pure functions for geometric calculations

export interface Point {
  x: number;
  y: number;
}

/**
 * Checks if a point is inside a text box
 */
export const isPointInBox = (point: Point, box: TextBox): boolean => {
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height
  );
};

/**
 * Finds the first text box that contains a point (top to bottom)
 */
export const findBoxAtPoint = (
  point: Point,
  boxes: TextBox[]
): TextBox | undefined => {
  // Search from end to start (top-most rendered box first)
  for (let i = boxes.length - 1; i >= 0; i--) {
    if (isPointInBox(point, boxes[i])) {
      return boxes[i];
    }
  }
  return undefined;
};

/**
 * Calculates the offset between a point and a box's origin
 */
export const calculateOffset = (point: Point, box: TextBox): Point => ({
  x: point.x - box.x,
  y: point.y - box.y,
});

/**
 * Calculates a new position given a point and an offset
 */
export const calculateNewPosition = (point: Point, offset: Point): Point => ({
  x: point.x - offset.x,
  y: point.y - offset.y,
});
