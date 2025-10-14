import { StateCreator } from "zustand";
import type { CanvasStore } from "../store";
import { isSelectionEmpty, createSelection } from "@/canvas/input/selection";

export interface TextSlice {
  // State
  textContent: string;

  // Actions
  insertTextAtCursor: (char: string) => void;
  deleteCharBeforeCursor: () => void;
  clearText: () => void;
}

export const createTextSlice: StateCreator<
  CanvasStore,
  [],
  [],
  TextSlice
> = (set) => ({
  // Initial state
  textContent: "",

  // Actions
  insertTextAtCursor: (char: string) => {
    set((state) => {
      const { editingId, textBoxes } = state;

      // If no text box is being edited, do nothing
      if (!editingId) return state;

      // Find the text box being edited
      const boxIndex = textBoxes.findIndex((box) => box.id === editingId);
      if (boxIndex === -1) return state;

      const box = textBoxes[boxIndex];
      const content = box.content;

      // If there's a selection, replace it with the new character
      if (!isSelectionEmpty(state.selection)) {
        const leftEdge = Math.min(state.selection.start, state.selection.end);
        const rightEdge = Math.max(state.selection.start, state.selection.end);

        const newContent = content.slice(0, leftEdge) + char + content.slice(rightEdge);
        const updatedBox = { ...box, content: newContent };
        const updatedTextBoxes = [...textBoxes];
        updatedTextBoxes[boxIndex] = updatedBox;

        return {
          textBoxes: updatedTextBoxes,
          textContent: newContent, // Keep in sync for now
          cursorPosition: leftEdge + char.length,
          selection: createSelection()
        };
      }

      // No selection - insert at cursor position
      const newContent = content.slice(0, state.cursorPosition) + char + content.slice(state.cursorPosition);
      const updatedBox = { ...box, content: newContent };
      const updatedTextBoxes = [...textBoxes];
      updatedTextBoxes[boxIndex] = updatedBox;

      return {
        textBoxes: updatedTextBoxes,
        textContent: newContent, // Keep in sync for now
        cursorPosition: state.cursorPosition + char.length
      };
    });
  },

  deleteCharBeforeCursor: () => {
    set((state) => {
      const { editingId, textBoxes } = state;

      // If no text box is being edited, do nothing
      if (!editingId) return state;

      // Find the text box being edited
      const boxIndex = textBoxes.findIndex((box) => box.id === editingId);
      if (boxIndex === -1) return state;

      const box = textBoxes[boxIndex];
      const content = box.content;

      // If there's a selection, delete the selection instead
      if (!isSelectionEmpty(state.selection)) {
        const leftEdge = Math.min(state.selection.start, state.selection.end);
        const rightEdge = Math.max(state.selection.start, state.selection.end);

        const newContent = content.slice(0, leftEdge) + content.slice(rightEdge);
        const updatedBox = { ...box, content: newContent };
        const updatedTextBoxes = [...textBoxes];
        updatedTextBoxes[boxIndex] = updatedBox;

        return {
          textBoxes: updatedTextBoxes,
          textContent: newContent, // Keep in sync for now
          cursorPosition: leftEdge,
          selection: createSelection()
        };
      }

      // Only delete if cursor is not at the beginning
      if (state.cursorPosition <= 0) return state;

      const newContent = content.slice(0, state.cursorPosition - 1) + content.slice(state.cursorPosition);
      const updatedBox = { ...box, content: newContent };
      const updatedTextBoxes = [...textBoxes];
      updatedTextBoxes[boxIndex] = updatedBox;

      return {
        textBoxes: updatedTextBoxes,
        textContent: newContent, // Keep in sync for now
        cursorPosition: state.cursorPosition - 1
      };
    });
  },

  clearText: () => {
    set({ textContent: "" });
  }
});
