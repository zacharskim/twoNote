// HiDPI canvas setup following https://web.dev/articles/canvas-hidipi
export const setupHiDPICanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D | null => {
  const dpr = window.devicePixelRatio || 1;

  // Set canvas backing store dimensions (actual pixel dimensions)
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  // Set canvas display size (CSS pixels)
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Scale all drawing operations by the device pixel ratio
  ctx.scale(dpr, dpr);

  return ctx;
};
