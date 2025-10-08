// TODO: Coordinate transformations
// - screenToCanvas(screenX, screenY)
// - canvasToScreen(canvasX, canvasY)
// - applyZoom(point, zoomLevel)
// - etc.

import type { Point } from "./hitDetection";

export const screenToCanvas = (
  screenX: number,
  screenY: number,
  canvasRect: DOMRect
): Point => ({
  x: screenX - canvasRect.left,
  y: screenY - canvasRect.top,
});
