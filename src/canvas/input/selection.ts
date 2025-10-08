// TODO: Selection handling
// - selectElement(id)
// - multiSelect(ids)
// - clearSelection()
// - isSelected(id)
// - etc.

export const toggleSelection = (
  currentSelection: string[],
  id: string
): string[] => {
  if (currentSelection.includes(id)) {
    return currentSelection.filter((selectedId) => selectedId !== id);
  }
  return [...currentSelection, id];
};

export const getSelectionRange = (
  start: number,
  end: number
): { start: number; end: number } => {
  // TODO: Implement - for text selection
  return { start: 0, end: 0 };
};

export const moveCursorLeft = (position: number, text: string): number => {
  // TODO: Implement - cursor navigation helper
  return 0;
};

export const moveCursorRight = (position: number, text: string): number => {
  // TODO: Implement - cursor navigation helper
  return 0;
};

export const moveCursorUp = (position: number, text: string): number => {
  // TODO: Implement - cursor navigation helper
  return 0;
};

export const moveCursorDown = (position: number, text: string): number => {
  // TODO: Implement - cursor navigation helper
  return 0;
};

export const getWordBoundaries = (
  text: string,
  position: number
): { start: number; end: number } => {
  // TODO: Implement - for double-click word selection
  return { start: 0, end: 0 };
};
