import { create } from "zustand";
import type { TextBox } from "@/types/canvas";
import {
  createTextBox,
  addTextBox,
  replaceTextBox,
  removeTextBox,
  moveTextBox,
  updateTextBoxContent
} from "@/canvas/entities/textBox";
import type { TextSelection } from "@/canvas/input/selection";
import { createSelection, isSelectionEmpty } from "@/canvas/input/selection";

export interface CanvasStore {
  // State
  textBoxes: TextBox[];
  selectedId: string | null;
  editingId: string | null;
  cursorPosition: number;

  // Selection state
  selection: TextSelection;

  // Mouse state
  mouseX: number;
  mouseY: number;

  // Text content (for canvas-based text editing)
  textContent: string;

  // Drag state
  isDragging: boolean;
  dragOffsetX: number;
  dragOffsetY: number;

  // Actions - Text Boxes
  addNewTextBox: (x: number, y: number) => void;
  updateTextBox: (id: string, content: string) => void;
  moveTextBoxTo: (id: string, x: number, y: number) => void;
  deleteTextBox: (id: string) => void;

  // Actions - Selection
  selectTextBox: (id: string | null) => void;
  startEditing: (id: string) => void;
  stopEditing: () => void;

  // Actions - Mouse
  setMousePosition: (x: number, y: number) => void;

  // Actions - Text
  insertTextAtCursor: (char: string) => void;
  deleteCharBeforeCursor: () => void;
  clearText: () => void;

  // Actions - Cursor
  setCursorPosition: (position: number) => void;
  moveCursorLeft: (withSelection?: boolean) => void;
  moveCursorRight: (withSelection?: boolean) => void;

  // Actions - Selection
  setSelection: (start: number, end: number) => void;
  clearSelection: () => void;
  hasSelection: () => boolean;
  selectAll: () => void;

  // Actions - Clipboard
  copyToClipboard: () => Promise<void>;
  cutToClipboard: () => Promise<void>;
  pasteFromClipboard: () => Promise<void>;

  // Actions - Drag
  startDragging: (offsetX: number, offsetY: number) => void;
  stopDragging: () => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  // Initial state
  textBoxes: [],
  selectedId: null,
  editingId: null,
  cursorPosition: 0,
  selection: createSelection(),
  mouseX: 0,
  mouseY: 0,
  textContent: "",
  isDragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0,

  // Text box actions
  addNewTextBox: (x: number, y: number) => {
    const newBox = createTextBox(x, y, `box-${Date.now()}`);
    set((state) => ({
      textBoxes: addTextBox(state.textBoxes, newBox),
      selectedId: newBox.id,
      editingId: newBox.id
    }));
  },

  updateTextBox: (id: string, content: string) => {
    const { textBoxes } = get();
    const box = textBoxes.find((b) => b.id === id);
    if (!box) return;

    const updatedBox = updateTextBoxContent(box, content);
    set({ textBoxes: replaceTextBox(textBoxes, updatedBox) });
  },

  moveTextBoxTo: (id: string, x: number, y: number) => {
    const { textBoxes } = get();
    const box = textBoxes.find((b) => b.id === id);
    if (!box) return;

    const movedBox = moveTextBox(box, x, y);
    set({ textBoxes: replaceTextBox(textBoxes, movedBox) });
  },

  deleteTextBox: (id: string) => {
    set((state) => ({
      textBoxes: removeTextBox(state.textBoxes, id),
      selectedId: null,
      editingId: null
    }));
  },

  // Selection actions
  selectTextBox: (id: string | null) => {
    set({ selectedId: id });
  },

  startEditing: (id: string) => {
    set({ editingId: id, selectedId: id });
  },

  stopEditing: () => {
    set({ editingId: null });
  },

  // Mouse actions
  setMousePosition: (x: number, y: number) => {
    set({ mouseX: x, mouseY: y });
  },

  // Text actions
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
  },

  // Drag actions
  startDragging: (offsetX: number, offsetY: number) => {
    set({ isDragging: true, dragOffsetX: offsetX, dragOffsetY: offsetY });
  },

  stopDragging: () => {
    set({ isDragging: false, dragOffsetX: 0, dragOffsetY: 0 });
  },

  // Cursor actions
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
          start: state.selection.start === state.selection.end ? state.cursorPosition : state.selection.start,
          end: newPosition
        };
        return { cursorPosition: newPosition, selection };
      } else {
        // No shift - clear selection and move cursor
        return {
          cursorPosition: newPosition,
          selection: createSelection()
        };
      }
    });
  },

  moveCursorRight: (withSelection = false) => {
    set((state) => {
      const newPosition = Math.min(state.textContent.length, state.cursorPosition + 1);

      if (withSelection) {
        // Shift is held - extend/modify selection
        const selection = {
          ...state.selection,
          start: state.selection.start === state.selection.end ? state.cursorPosition : state.selection.start,
          end: newPosition
        };
        return { cursorPosition: newPosition, selection };
      } else {
        // No shift - clear selection and move cursor
        return {
          cursorPosition: newPosition,
          selection: createSelection()
        };
      }
    });
  },

  // Selection actions
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

  // Clipboard actions
  copyToClipboard: async () => {
    const { selection, textContent } = get();
    if (isSelectionEmpty(selection)) return;

    const selectedText = textContent.substring(
      Math.min(selection.start, selection.end),
      Math.max(selection.start, selection.end)
    );

    try {
      await navigator.clipboard.writeText(selectedText);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  },

  cutToClipboard: async () => {
    const { selection, textContent, copyToClipboard } = get();
    if (isSelectionEmpty(selection)) return;

    // First copy
    await copyToClipboard();

    // Then delete selected text
    const leftEdge = Math.min(selection.start, selection.end);
    const rightEdge = Math.max(selection.start, selection.end);

    set({
      textContent: textContent.substring(0, leftEdge) + textContent.substring(rightEdge),
      cursorPosition: leftEdge,
      selection: createSelection()
    });
  },

  pasteFromClipboard: async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const { selection, textContent, cursorPosition } = get();

      let newText: string;
      let newCursorPosition: number;

      if (!isSelectionEmpty(selection)) {
        // Replace selected text with pasted text
        const leftEdge = Math.min(selection.start, selection.end);
        const rightEdge = Math.max(selection.start, selection.end);

        newText = textContent.substring(0, leftEdge) + clipboardText + textContent.substring(rightEdge);
        newCursorPosition = leftEdge + clipboardText.length;
      } else {
        // Insert at cursor position
        newText = textContent.substring(0, cursorPosition) + clipboardText + textContent.substring(cursorPosition);
        newCursorPosition = cursorPosition + clipboardText.length;
      }

      set({
        textContent: newText,
        cursorPosition: newCursorPosition,
        selection: createSelection()
      });
    } catch (err) {
      console.error("Failed to paste from clipboard:", err);
    }
  }
}));
