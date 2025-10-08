// TODO: Image rendering with PixiJS
// - createImageContainer(image)
// - updateImagePosition(container, x, y)
// - updateImageSize(container, width, height)
// - etc.

import { Container, Sprite, Texture } from "pixi.js";
import type { Image } from "@/canvas/entities/image";

export const createImageContainer = async (
  image: Image
): Promise<Container> => {
  const container = new Container();
  const texture = await Texture.from(image.src);
  const sprite = new Sprite(texture);

  sprite.width = image.width;
  sprite.height = image.height;

  container.addChild(sprite);
  container.x = image.x;
  container.y = image.y;
  container.label = image.id;

  return container;
};
