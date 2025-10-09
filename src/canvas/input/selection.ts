/**
 * Text selection handling
 * Manages text selection ranges (different from cursor position)
 */

export interface TextSelection {
  start: number; // Start position of selection
  end: number; // End position of selection
  textBoxId: string | null; // ID of text box being selected
}

/**
 * Creates an empty selection
 */
export const createSelection = (textBoxId: string | null = null): TextSelection => ({
  start: 0,
  end: 0,
  textBoxId,
});

/**
 * Creates a selection from start to end position
 */
export const createSelectionRange = (
  start: number,
  end: number,
  textBoxId: string | null = null
): TextSelection => ({
  start: Math.min(start, end),
  end: Math.max(start, end),
  textBoxId,
});

/**
 * Checks if selection is empty (no text selected)
 */
export const isSelectionEmpty = (selection: TextSelection): boolean => {
  return selection.start === selection.end;
};

/**
 * Gets the selected text from content
 */
export const getSelectedText = (selection: TextSelection, text: string): string => {
  if (isSelectionEmpty(selection)) return "";
  return text.substring(selection.start, selection.end);
};

/**
 * Clears selection (sets start = end)
 */
export const clearSelection = (selection: TextSelection): TextSelection => ({
  ...selection,
  end: selection.start,
});

/**
 * Expands selection to include a character at position
 */
export const extendSelection = (
  selection: TextSelection,
  position: number
): TextSelection => ({
  ...selection,
  end: position,
});

/**
 * Gets word boundaries at a given position (for double-click selection)
 */
export const getWordBoundaries = (
  text: string,
  position: number
): { start: number; end: number } => {
  // Find start of word (move left until whitespace or start)
  let start = position;
  while (start > 0 && !/\s/.test(text[start - 1])) {
    start--;
  }

  // Find end of word (move right until whitespace or end)
  let end = position;
  while (end < text.length && !/\s/.test(text[end])) {
    end++;
  }

  return { start, end };
};

/**
 * Selects word at position (for double-click)
 */
export const selectWordAt = (
  position: number,
  text: string,
  textBoxId: string | null = null
): TextSelection => {
  const { start, end } = getWordBoundaries(text, position);
  return createSelectionRange(start, end, textBoxId);
};

/**
 * Selects entire line at position (for triple-click)
 */
export const selectLineAt = (
  position: number,
  text: string,
  textBoxId: string | null = null
): TextSelection => {
  // Find start of line
  let start = position;
  while (start > 0 && text[start - 1] !== "\n") {
    start--;
  }

  // Find end of line
  let end = position;
  while (end < text.length && text[end] !== "\n") {
    end++;
  }

  return createSelectionRange(start, end, textBoxId);
};

/**
 * Selects all text
 */
export const selectAll = (
  text: string,
  textBoxId: string | null = null
): TextSelection => {
  return createSelectionRange(0, text.length, textBoxId);
};

// ============================================================================
// Element selection (for selecting text boxes, images, etc.)
// ============================================================================

/**
 * Toggles element in selection array
 */
export const toggleSelection = (
  currentSelection: string[],
  id: string
): string[] => {
  if (currentSelection.includes(id)) {
    return currentSelection.filter((selectedId) => selectedId !== id);
  }
  return [...currentSelection, id];
};

/**
 * Checks if element is selected
 */
export const isElementSelected = (
  currentSelection: string[],
  id: string
): boolean => {
  return currentSelection.includes(id);
};

/**
 * Clears element selection
 */
export const clearElementSelection = (): string[] => {
  return [];
};
