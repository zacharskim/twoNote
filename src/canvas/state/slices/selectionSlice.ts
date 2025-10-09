import { StateCreator } from "zustand";
import type { CanvasStore } from "../store";
import type { TextSelection } from "@/canvas/input/selection";
import { createSelection, isSelectionEmpty, selectWordAt } from "@/canvas/input/selection";

export interface SelectionSlice {
  // State
  selection: TextSelection;

  // Actions
  setSelection: (start: number, end: number) => void;
  clearSelection: () => void;
  hasSelection: () => boolean;
  selectAll: () => void;
  selectWordAtPosition: (position: number) => void;
}

export const createSelectionSlice: StateCreator<
  CanvasStore,
  [],
  [],
  SelectionSlice
> = (set, get) => ({
  // Initial state
  selection: createSelection(),

  // Actions
  setSelection: (start: number, end: number) => {
    set({
      selection: {
        start: Math.min(start, end),
        end: Math.max(start, end),
        textBoxId: null
      }
    });
  },

  clearSelection: () => {
    set({ selection: createSelection() });
  },

  hasSelection: () => {
    const { selection } = get();
    return !isSelectionEmpty(selection);
  },

  selectAll: () => {
    const { textContent } = get();
    set({
      selection: {
        start: 0,
        end: textContent.length,
        textBoxId: null
      },
      cursorPosition: textContent.length
    });
  },

  selectWordAtPosition: (position: number) => {
    const { textContent } = get();
    const wordSelection = selectWordAt(position, textContent, null);
    set({
      selection: wordSelection,
      cursorPosition: wordSelection.end
    });
  }
});
