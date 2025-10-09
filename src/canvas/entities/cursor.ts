/**
 * Cursor state management
 * Handles cursor position tracking and movement logic
 */

export interface Cursor {
  position: number; // Character index in the text
  textBoxId: string | null; // ID of the text box being edited
}

/**
 * Creates a new cursor at position 0
 */
export const createCursor = (textBoxId: string | null = null): Cursor => ({
  position: 0,
  textBoxId,
});

/**
 * Sets cursor to a specific position
 */
export const setCursorPosition = (cursor: Cursor, position: number): Cursor => ({
  ...cursor,
  position: Math.max(0, position),
});

/**
 * Sets cursor to a specific text box
 */
export const setCursorTextBox = (cursor: Cursor, textBoxId: string | null): Cursor => ({
  ...cursor,
  textBoxId,
  position: 0, // Reset position when switching text boxes
});

/**
 * Moves cursor left by one character
 */
export const moveCursorLeft = (cursor: Cursor, text: string): Cursor => {
  if (cursor.position <= 0) return cursor;
  return { ...cursor, position: cursor.position - 1 };
};

/**
 * Moves cursor right by one character
 */
export const moveCursorRight = (cursor: Cursor, text: string): Cursor => {
  if (cursor.position >= text.length) return cursor;
  return { ...cursor, position: cursor.position + 1 };
};

/**
 * Moves cursor to start of previous line
 */
export const moveCursorUp = (cursor: Cursor, text: string): Cursor => {
  const lines = text.split("\n");
  const { lineIndex, columnIndex } = getLineAndColumn(cursor.position, text);

  // Already on first line
  if (lineIndex === 0) {
    return { ...cursor, position: 0 };
  }

  // Move to previous line, same column (or end of line if shorter)
  const prevLine = lines[lineIndex - 1];
  const newColumn = Math.min(columnIndex, prevLine.length);
  const newPosition = getPositionFromLineColumn(lineIndex - 1, newColumn, lines);

  return { ...cursor, position: newPosition };
};

/**
 * Moves cursor to start of next line
 */
export const moveCursorDown = (cursor: Cursor, text: string): Cursor => {
  const lines = text.split("\n");
  const { lineIndex, columnIndex } = getLineAndColumn(cursor.position, text);

  // Already on last line
  if (lineIndex === lines.length - 1) {
    return { ...cursor, position: text.length };
  }

  // Move to next line, same column (or end of line if shorter)
  const nextLine = lines[lineIndex + 1];
  const newColumn = Math.min(columnIndex, nextLine.length);
  const newPosition = getPositionFromLineColumn(lineIndex + 1, newColumn, lines);

  return { ...cursor, position: newPosition };
};

/**
 * Moves cursor to start of current line
 */
export const moveCursorToLineStart = (cursor: Cursor, text: string): Cursor => {
  const { lineIndex } = getLineAndColumn(cursor.position, text);
  const lines = text.split("\n");
  const newPosition = getPositionFromLineColumn(lineIndex, 0, lines);

  return { ...cursor, position: newPosition };
};

/**
 * Moves cursor to end of current line
 */
export const moveCursorToLineEnd = (cursor: Cursor, text: string): Cursor => {
  const { lineIndex } = getLineAndColumn(cursor.position, text);
  const lines = text.split("\n");
  const newPosition = getPositionFromLineColumn(lineIndex, lines[lineIndex].length, lines);

  return { ...cursor, position: newPosition };
};

/**
 * Moves cursor to start of text
 */
export const moveCursorToStart = (cursor: Cursor): Cursor => ({
  ...cursor,
  position: 0,
});

/**
 * Moves cursor to end of text
 */
export const moveCursorToEnd = (cursor: Cursor, text: string): Cursor => ({
  ...cursor,
  position: text.length,
});

/**
 * Moves cursor by word (left)
 */
export const moveCursorWordLeft = (cursor: Cursor, text: string): Cursor => {
  if (cursor.position === 0) return cursor;

  let pos = cursor.position - 1;

  // Skip whitespace
  while (pos > 0 && /\s/.test(text[pos])) {
    pos--;
  }

  // Skip word characters
  while (pos > 0 && !/\s/.test(text[pos - 1])) {
    pos--;
  }

  return { ...cursor, position: pos };
};

/**
 * Moves cursor by word (right)
 */
export const moveCursorWordRight = (cursor: Cursor, text: string): Cursor => {
  if (cursor.position === text.length) return cursor;

  let pos = cursor.position;

  // Skip word characters
  while (pos < text.length && !/\s/.test(text[pos])) {
    pos++;
  }

  // Skip whitespace
  while (pos < text.length && /\s/.test(text[pos])) {
    pos++;
  }

  return { ...cursor, position: pos };
};

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Gets line and column index from character position
 */
export const getLineAndColumn = (
  position: number,
  text: string
): { lineIndex: number; columnIndex: number } => {
  const textBeforeCursor = text.substring(0, position);
  const lines = textBeforeCursor.split("\n");

  return {
    lineIndex: lines.length - 1,
    columnIndex: lines[lines.length - 1].length,
  };
};

/**
 * Gets character position from line and column indices
 */
export const getPositionFromLineColumn = (
  lineIndex: number,
  columnIndex: number,
  lines: string[]
): number => {
  let position = 0;

  // Add lengths of all previous lines (including newlines)
  for (let i = 0; i < lineIndex; i++) {
    position += lines[i].length + 1; // +1 for newline
  }

  // Add column offset on current line
  position += columnIndex;

  return position;
};
