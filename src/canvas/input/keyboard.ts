// TODO: Keyboard input handling
// - handleKeyPress(event)
// - getShortcut(event) -> 'cmd+z', 'ctrl+c', etc
// - isModifierPressed(event, modifier)
// - etc.

export const isModifierKey = (key: string): boolean => {
  return ["Shift", "Control", "Alt", "Meta"].includes(key);
};

export const getShortcut = (event: KeyboardEvent): string => {
  const parts: string[] = [];
  if (event.ctrlKey || event.metaKey) parts.push("mod");
  if (event.shiftKey) parts.push("shift");
  if (event.altKey) parts.push("alt");
  parts.push(event.key.toLowerCase());
  return parts.join("+");
};

export const handleKeyDown = (event: KeyboardEvent): void => {};

export const isPrintableChar = (key: string): boolean => {
  return key.length === 1 && !isModifierKey(key);
};

export const isNavigationKey = (key: string): boolean => {
  // TODO: Implement - arrow keys, home, end, pageup/down
  return false;
};

export const isDeleteKey = (key: string): boolean => {
  return key === "Backspace" || key === "Delete";
};

export const shouldPreventDefault = (event: KeyboardEvent): boolean => {
  // TODO: Implement - for certain shortcuts
  return false;
};
