// TODO: Image entity operations
// - createImage(x, y, src, id)
// - moveImage(image, x, y)
// - resizeImage(image, width, height)
// - etc.

export interface Image {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
