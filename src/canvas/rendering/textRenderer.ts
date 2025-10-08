import { Graphics, Text, TextStyle, Container } from "pixi.js";
import { TextBox } from "@/types/canvas";

// Pure configuration objects
export const TEXT_STYLE = new TextStyle({
  fontWeight: "400",
  fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, monospace',
  fontSize: 16,
  fill: 0xe5e7eb,
  wordWrap: true,
  wordWrapWidth: 280,
});

export const COLORS = {
  boxBg: 0x262626,
  boxBorder: 0x404040,
  boxBorderSelected: 0x60a5fa,
  text: 0xe5e7eb,
  cursor: 0x86efac,
} as const;

export const BOX_PADDING = 10;

/**
 * Creates a Graphics object for a text box background
 */
export const createBoxBackground = (
  width: number,
  height: number,
  isSelected: boolean
): Graphics => {
  const bg = new Graphics();

  // Fill
  bg.rect(0, 0, width, height);
  bg.fill(COLORS.boxBg);

  // Border
  bg.stroke({
    width: 2,
    color: isSelected ? COLORS.boxBorderSelected : COLORS.boxBorder,
  });

  return bg;
};

/**
 * Creates a Text object for text box content
 */
export const createTextObject = (content: string): Text => {
  const text = new Text({
    text: content || "Type here...",
    style: TEXT_STYLE,
  });

  text.x = BOX_PADDING;
  text.y = BOX_PADDING;

  return text;
};

/**
 * Creates a complete text box container
 */
export const createTextBoxContainer = (
  textBox: TextBox,
  isSelected: boolean
): Container => {
  const container = new Container();
  container.x = textBox.x;
  container.y = textBox.y;

  // Add background
  const bg = createBoxBackground(textBox.width, textBox.height, isSelected);
  container.addChild(bg);

  // Add text
  const text = createTextObject(textBox.content);
  container.addChild(text);

  // Store text box ID for reference
  container.label = textBox.id;

  // Make interactive
  container.eventMode = "static";
  container.cursor = "pointer";

  return container;
};

/**
 * Updates an existing container's position
 */
export const updateContainerPosition = (
  container: Container,
  x: number,
  y: number
): void => {
  container.x = x;
  container.y = y;
};

/**
 * Updates an existing container's content
 */
export const updateContainerContent = (
  container: Container,
  content: string
): void => {
  const textChild = container.children[1] as Text;
  if (textChild) {
    textChild.text = content || "Type here...";
  }
};

/**
 * Updates an existing container's selection state
 */
export const updateContainerSelection = (
  container: Container,
  textBox: TextBox,
  isSelected: boolean
): void => {
  // Remove old background
  container.removeChildAt(0);

  // Add new background with updated selection state
  const bg = createBoxBackground(textBox.width, textBox.height, isSelected);
  container.addChildAt(bg, 0);
};
