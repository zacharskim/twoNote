import { Graphics, Text, Container } from "pixi.js";
import type { TextSelection } from "@/canvas/input/selection";

/**
 * Selection rendering configuration
 */
export const SELECTION_CONFIG = {
  color: 0x3b82f6, // Blue
  alpha: 0.3
} as const;

/**
 * Calculates selection rectangle for rendering
 * Currently only supports single-line selection
 */
export const calculateSelectionRect = (
  text: Text,
  selection: TextSelection,
  content: string
): { x: number; y: number; width: number; height: number } | null => {
  if (selection.start === selection.end) {
    return null; // No selection
  }

  const fontSize = (text.style.fontSize as number) || 16;
  const lineHeight = fontSize * 1.2;

  // Handle backward selection (when end < start)
  const leftEdge = Math.min(selection.start, selection.end);
  const rightEdge = Math.max(selection.start, selection.end);

  // Get the selected text
  const selectedText = content.substring(leftEdge, rightEdge);

  // Get text before selection to find starting x position
  const textBeforeSelection = content.substring(0, leftEdge);

  // Measure width of text before selection
  const tempTextBefore = new Text({
    text: textBeforeSelection,
    style: text.style
  });
  const startX = tempTextBefore.width;
  tempTextBefore.destroy();

  // Measure width of selected text
  const tempTextSelected = new Text({
    text: selectedText,
    style: text.style
  });
  const width = tempTextSelected.width;
  tempTextSelected.destroy();

  return {
    x: text.x + startX,
    y: text.y,
    width,
    height: lineHeight
  };
};

/**
 * Creates Graphics object for selection highlight
 */
export const createSelectionGraphics = (rect: { x: number; y: number; width: number; height: number }): Graphics => {
  const graphics = new Graphics();

  graphics.rect(rect.x, rect.y, rect.width, rect.height);
  graphics.fill({ color: SELECTION_CONFIG.color, alpha: SELECTION_CONFIG.alpha });

  return graphics;
};

/**
 * Updates selection graphics in a container
 * Removes old selection if exists and adds new one
 */
export const updateSelectionInContainer = (
  container: Container,
  rect: { x: number; y: number; width: number; height: number } | null,
  selectionChildIndex?: number
): number | undefined => {
  // Remove old selection if exists - find it by label
  const existingSelection = container.children.find((child) => child.label === "selection");
  if (existingSelection) {
    container.removeChild(existingSelection);
    existingSelection.destroy();
  }

  // No selection to render
  if (!rect) {
    return undefined;
  }

  // Add new selection (insert at index 0 so it's behind text and caret)
  const selectionGraphics = createSelectionGraphics(rect);
  selectionGraphics.label = "selection"; // Label it so we can find it later
  container.addChildAt(selectionGraphics, 0);

  return 0; // Always at index 0
};

/**
 * Renders selection highlight
 * This is a convenience function that combines calculation and rendering
 */
export const renderSelection = (
  container: Container,
  text: Text,
  selection: TextSelection,
  content: string,
  selectionChildIndex?: number
): number | undefined => {
  const rect = calculateSelectionRect(text, selection, content);
  return updateSelectionInContainer(container, rect, selectionChildIndex);
};
