import { StateCreator } from "zustand";
import type { CanvasStore } from "../store";
import { createSelection } from "@/canvas/input/selection";

export interface CursorSlice {
  // State
  cursorPosition: number;

  // Actions
  setCursorPosition: (position: number) => void;
  moveCursorLeft: (withSelection?: boolean) => void;
  moveCursorRight: (withSelection?: boolean) => void;
}

export const createCursorSlice: StateCreator<
  CanvasStore,
  [],
  [],
  CursorSlice
> = (set) => ({
  // Initial state
  cursorPosition: 0,

  // Actions
  setCursorPosition: (position: number) => {
    set({ cursorPosition: position });
  },

  moveCursorLeft: (withSelection = false) => {
    set((state) => {
      const newPosition = Math.max(0, state.cursorPosition - 1);

      if (withSelection) {
        // Shift is held - extend/modify selection
        const selection = {
          ...state.selection,
          start:
            state.selection.start === state.selection.end
              ? state.cursorPosition
              : state.selection.start,
          end: newPosition,
        };
        return { cursorPosition: newPosition, selection };
      } else {
        // No shift - clear selection and move cursor
        return {
          cursorPosition: newPosition,
          selection: createSelection(),
        };
      }
    });
  },

  moveCursorRight: (withSelection = false) => {
    set((state) => {
      const newPosition = Math.min(
        state.textContent.length,
        state.cursorPosition + 1,
      );

      if (withSelection) {
        // Shift is held - extend/modify selection
        const selection = {
          ...state.selection,
          start:
            state.selection.start === state.selection.end
              ? state.cursorPosition
              : state.selection.start,
          end: newPosition,
        };
        return { cursorPosition: newPosition, selection };
      } else {
        // No shift - clear selection and move cursor
        return {
          cursorPosition: newPosition,
          selection: createSelection(),
        };
      }
    });
  },
});
