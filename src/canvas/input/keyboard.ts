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
