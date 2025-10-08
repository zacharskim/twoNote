// TODO: Layout utilities
// - snapToGrid(x, y, gridSize)
// - distributeEvenly(elements)
// - alignElements(elements, alignment)
// - etc.

export const snapToGrid = (x: number, y: number, gridSize: number) => ({
  x: Math.round(x / gridSize) * gridSize,
  y: Math.round(y / gridSize) * gridSize,
});
