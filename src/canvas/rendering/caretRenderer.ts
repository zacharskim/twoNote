import { Graphics, Text, Container } from "pixi.js";
import { COLORS } from "./textRenderer";

/**
 * Caret rendering configuration
 */
export const CARET_CONFIG = {
  width: 1,
  color: COLORS.cursor,
  blinkInterval: 530 // ms - standard text editor blink rate
} as const;

/**
 * Caret state for animation
 */
export interface CaretState {
  visible: boolean;
  lastBlinkTime: number;
  isBlinking: boolean;
}

/**
 * Creates initial caret state
 */
export const createCaretState = (): CaretState => ({
  visible: true,
  lastBlinkTime: Date.now(),
  isBlinking: true
});

/**
 * Updates caret visibility based on blink timing
 */
export const updateCaretBlink = (state: CaretState, currentTime: number): CaretState => {
  if (!state.isBlinking) {
    return { ...state, visible: true };
  }

  const elapsed = currentTime - state.lastBlinkTime;

  if (elapsed >= CARET_CONFIG.blinkInterval) {
    return {
      visible: !state.visible,
      lastBlinkTime: currentTime,
      isBlinking: true
    };
  }

  return state;
};

/**
 * Resets caret to visible state (e.g., after user input)
 */
export const resetCaretBlink = (state: CaretState): CaretState => ({
  visible: true,
  lastBlinkTime: Date.now(),
  isBlinking: true
});

/**
 * Stops caret blinking (e.g., when not editing)
 */
export const stopCaretBlink = (state: CaretState): CaretState => ({
  ...state,
  visible: false,
  isBlinking: false
});

/**
 * Calculates caret position from text position and content
 * Returns x, y coordinates relative to the text container
 */
export const calculateCaretPosition = (
  text: Text,
  cursorPosition: number,
  content: string
): { x: number; y: number; height: number } => {
  // Get the text before cursor
  const textBeforeCursor = content.substring(0, cursorPosition);

  // Split by newlines to get the current line
  const lines = textBeforeCursor.split("\n");
  const currentLineIndex = lines.length - 1;
  const currentLineText = lines[currentLineIndex] || "";

  // Create a temporary Text object to measure width
  // We need to use the same style as the actual text for accurate measurements
  const tempText = new Text({
    text: currentLineText,
    style: text.style
  });

  const textWidth = tempText.width;

  // Calculate position
  const fontSize = (text.style.fontSize as number) || 16;
  const lineHeight = fontSize * 1.2; // Typical line height multiplier

  // Caret should extend slightly above and below the text
  const caretPadding = 2; // Extra pixels on top and bottom
  const caretHeight = fontSize + caretPadding * 2;

  // Position relative to the text object (which starts at text.x, text.y)
  const x = text.x + textWidth;
  const y = text.y + (currentLineIndex * lineHeight) - caretPadding;

  // Clean up
  tempText.destroy();

  return {
    x,
    y,
    height: caretHeight
  };
};

/**
 * Creates a Graphics object for the caret
 */
export const createCaretGraphics = (x: number, y: number, height: number, visible: boolean): Graphics => {
  const caret = new Graphics();

  if (visible) {
    caret.rect(x, y, CARET_CONFIG.width, height);
    caret.fill(CARET_CONFIG.color);
  }

  return caret;
};

/**
 * Updates caret graphics in a container
 * Removes old caret if exists and adds new one
 */
export const updateCaretInContainer = (
  container: Container,
  x: number,
  y: number,
  height: number,
  visible: boolean,
  caretChildIndex?: number
): number => {
  // Remove old caret if exists
  if (caretChildIndex !== undefined && container.children[caretChildIndex]) {
    container.removeChildAt(caretChildIndex);
  }

  // Add new caret
  const caret = createCaretGraphics(x, y, height, visible);
  const index = container.addChild(caret);

  return container.children.indexOf(caret);
};

/**
 * Renders caret at a specific text position
 * This is a convenience function that combines position calculation and rendering
 */
export const renderCaret = (
  container: Container,
  text: Text,
  cursorPosition: number,
  content: string,
  caretState: CaretState,
  caretChildIndex?: number
): number => {
  const { x, y, height } = calculateCaretPosition(text, cursorPosition, content);
  console.log("hello", x, y, height);
  return updateCaretInContainer(container, x, y, height, caretState.visible, caretChildIndex);
};
