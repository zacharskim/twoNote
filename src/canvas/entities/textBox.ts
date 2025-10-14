import type { TextBox } from "@/types/canvas";

// Pure functions for text box operations

/**
 * Creates a new text box at the specified position
 */
export const createTextBox = (
  x: number,
  y: number,
  id: string,
): TextBox => ({
  id,
  content: "",
  x,
  y,
  width: 300,
  height: 100,
});

/**
 * Updates a text box's content
 */
export const updateTextBoxContent = (
  textBox: TextBox,
  content: string,
): TextBox => ({
  ...textBox,
  content,
});

/**
 * Moves a text box to a new position
 */
export const moveTextBox = (
  textBox: TextBox,
  x: number,
  y: number,
): TextBox => ({
  ...textBox,
  x,
  y,
});

/**
 * Finds a text box by ID
 */
export const findTextBoxById = (
  textBoxes: TextBox[],
  id: string,
): TextBox | undefined => textBoxes.find((box) => box.id === id);

/**
 * Replaces a text box in the array
 */
export const replaceTextBox = (
  textBoxes: TextBox[],
  updatedBox: TextBox,
): TextBox[] =>
  textBoxes.map((box) => (box.id === updatedBox.id ? updatedBox : box));

/**
 * Adds a text box to the array
 */
export const addTextBox = (
  textBoxes: TextBox[],
  newBox: TextBox,
): TextBox[] => [...textBoxes, newBox];

/**
 * Removes a text box from the array
 */
export const removeTextBox = (textBoxes: TextBox[], id: string): TextBox[] =>
  textBoxes.filter((box) => box.id !== id);
