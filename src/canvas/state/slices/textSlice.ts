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
      // If there's a selection, replace it with the new character
      if (!isSelectionEmpty(state.selection)) {
        const leftEdge = Math.min(state.selection.start, state.selection.end);
        const rightEdge = Math.max(state.selection.start, state.selection.end);

        return {
          textContent: state.textContent.slice(0, leftEdge) + char + state.textContent.slice(rightEdge),
          cursorPosition: leftEdge + char.length,
          selection: createSelection()
        };
      }

      // No selection - insert at cursor position
      return {
        textContent:
          state.textContent.slice(0, state.cursorPosition) + char + state.textContent.slice(state.cursorPosition),
        cursorPosition: state.cursorPosition + char.length
      };
    });
  },

  deleteCharBeforeCursor: () => {
    set((state) => {
      // If there's a selection, delete the selection instead
      if (!isSelectionEmpty(state.selection)) {
        const leftEdge = Math.min(state.selection.start, state.selection.end);
        const rightEdge = Math.max(state.selection.start, state.selection.end);

        return {
          textContent: state.textContent.slice(0, leftEdge) + state.textContent.slice(rightEdge),
          cursorPosition: leftEdge,
          selection: createSelection()
        };
      }

      // Only delete if cursor is not at the beginning
      if (state.cursorPosition <= 0) return state;

      return {
        textContent:
          state.textContent.slice(0, state.cursorPosition - 1) + state.textContent.slice(state.cursorPosition),
        cursorPosition: state.cursorPosition - 1
      };
    });
  },

  clearText: () => {
    set({ textContent: "" });
  }
});
