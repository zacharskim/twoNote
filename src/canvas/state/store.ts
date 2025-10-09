import { create } from "zustand";
import { createTextSlice, type TextSlice } from "./slices/textSlice";
import { createCursorSlice, type CursorSlice } from "./slices/cursorSlice";
import { createSelectionSlice, type SelectionSlice } from "./slices/selectionSlice";
import { createClipboardSlice, type ClipboardSlice } from "./slices/clipboardSlice";
import { createTextBoxSlice, type TextBoxSlice } from "./slices/textBoxSlice";

// Combine all slice types
export type CanvasStore = TextSlice & CursorSlice & SelectionSlice & ClipboardSlice & TextBoxSlice;

// Create store by combining all slices
export const useCanvasStore = create<CanvasStore>()((...a) => ({
  ...createTextSlice(...a),
  ...createCursorSlice(...a),
  ...createSelectionSlice(...a),
  ...createClipboardSlice(...a),
  ...createTextBoxSlice(...a)
}));
