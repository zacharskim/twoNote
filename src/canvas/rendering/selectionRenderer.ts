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
 * Calculates selection rectangles for rendering
 * Returns array of rectangles (one per line if multi-line selection)
 */
export const calculateSelectionRects = (
  text: Text,
  selection: TextSelection,
  content: string
): Array<{ x: number; y: number; width: number; height: number }> => {
  if (selection.start === selection.end) {
    return []; // No selection
  }

  const fontSize = (text.style.fontSize as number) || 16;
  const lineHeight = fontSize * 1.2;

  // Get text before selection start to find starting position
  const textBeforeStart = content.substring(0, selection.start);
  const linesBeforeStart = textBeforeStart.split("\n");
  const startLineIndex = linesBeforeStart.length - 1;
  const startLineText = linesBeforeStart[startLineIndex] || "";

  // Get text before selection end
  const textBeforeEnd = content.substring(0, selection.end);
  const linesBeforeEnd = textBeforeEnd.split("\n");
  const endLineIndex = linesBeforeEnd.length - 1;

  const rects: Array<{ x: number; y: number; width: number; height: number }> = [];

  // Single line selection
  if (startLineIndex === endLineIndex) {
    const selectedText = content.substring(selection.start, selection.end);

    // Measure width of text before selection on this line
    const tempTextBefore = new Text({
      text: startLineText,
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

    rects.push({
      x: text.x + startX,
      y: text.y + (startLineIndex * lineHeight),
      width,
      height: lineHeight
    });
  } else {
    // Multi-line selection - handle first line, middle lines, last line
    const lines = content.split("\n");

    // First line (from selection start to end of line)
    const firstLineRemainingText = lines[startLineIndex].substring(startLineText.length);
    const tempTextBefore = new Text({
      text: startLineText,
      style: text.style
    });
    const firstLineStartX = tempTextBefore.width;
    tempTextBefore.destroy();

    const tempFirstLineRemaining = new Text({
      text: firstLineRemainingText,
      style: text.style
    });
    const firstLineWidth = tempFirstLineRemaining.width;
    tempFirstLineRemaining.destroy();

    rects.push({
      x: text.x + firstLineStartX,
      y: text.y + (startLineIndex * lineHeight),
      width: firstLineWidth,
      height: lineHeight
    });

    // Middle lines (entire line selected)
    for (let i = startLineIndex + 1; i < endLineIndex; i++) {
      const tempLineText = new Text({
        text: lines[i],
        style: text.style
      });
      const lineWidth = tempLineText.width;
      tempLineText.destroy();

      rects.push({
        x: text.x,
        y: text.y + (i * lineHeight),
        width: lineWidth,
        height: lineHeight
      });
    }

    // Last line (from start of line to selection end)
    const lastLineText = linesBeforeEnd[endLineIndex] || "";
    const tempLastLine = new Text({
      text: lastLineText,
      style: text.style
    });
    const lastLineWidth = tempLastLine.width;
    tempLastLine.destroy();

    rects.push({
      x: text.x,
      y: text.y + (endLineIndex * lineHeight),
      width: lastLineWidth,
      height: lineHeight
    });
  }

  return rects;
};

/**
 * Creates Graphics object for selection highlight
 */
export const createSelectionGraphics = (
  rects: Array<{ x: number; y: number; width: number; height: number }>
): Graphics => {
  const graphics = new Graphics();

  rects.forEach((rect) => {
    graphics.rect(rect.x, rect.y, rect.width, rect.height);
    graphics.fill({ color: SELECTION_CONFIG.color, alpha: SELECTION_CONFIG.alpha });
  });

  return graphics;
};

/**
 * Updates selection graphics in a container
 * Removes old selection if exists and adds new one
 */
export const updateSelectionInContainer = (
  container: Container,
  rects: Array<{ x: number; y: number; width: number; height: number }>,
  selectionChildIndex?: number
): number | undefined => {
  // Remove old selection if exists
  if (selectionChildIndex !== undefined && container.children[selectionChildIndex]) {
    container.removeChildAt(selectionChildIndex);
  }

  // No selection to render
  if (rects.length === 0) {
    return undefined;
  }

  // Add new selection (insert at index 0 so it's behind text and caret)
  const selectionGraphics = createSelectionGraphics(rects);
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
  const rects = calculateSelectionRects(text, selection, content);
  return updateSelectionInContainer(container, rects, selectionChildIndex);
};
