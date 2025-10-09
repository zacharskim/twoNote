import { StateCreator } from "zustand";
import type { CanvasStore } from "../store";
import { isSelectionEmpty, createSelection } from "@/canvas/input/selection";

export interface ClipboardSlice {
  // Actions
  copyToClipboard: () => Promise<void>;
  cutToClipboard: () => Promise<void>;
  pasteFromClipboard: () => Promise<void>;
}

export const createClipboardSlice: StateCreator<
  CanvasStore,
  [],
  [],
  ClipboardSlice
> = (set, get) => ({
  // Actions
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
});
