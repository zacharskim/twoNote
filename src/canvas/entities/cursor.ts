// TODO: Cursor state management
// - moveCursor(position)
// - getCursorPosition()
// - cursorToTextPosition(textBox, cursorX, cursorY)
// - etc.

export interface Cursor {
  position: number;
  textBoxId: string | null;
}
