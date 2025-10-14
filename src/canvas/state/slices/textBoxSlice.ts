import { StateCreator } from "zustand";
import type { CanvasStore } from "../store";
import type { TextBox } from "@/types/canvas";
import {
  createTextBox,
  addTextBox,
  replaceTextBox,
  removeTextBox,
  moveTextBox,
  updateTextBoxContent,
} from "@/canvas/entities/textBox";

export interface TextBoxSlice {
  // State
  textBoxes: TextBox[];
  selectedId: string | null;
  editingId: string | null;

  // Drag state
  isDragging: boolean;
  dragOffsetX: number;
  dragOffsetY: number;

  // Mouse state
  mouseX: number;
  mouseY: number;

  // Actions - Text Boxes
  addNewTextBox: (x: number, y: number) => TextBox;
  updateTextBox: (id: string, content: string) => void;
  moveTextBoxTo: (id: string, x: number, y: number) => void;
  deleteTextBox: (id: string) => void;

  // Actions - Selection
  selectTextBox: (id: string | null) => void;
  startEditing: (id: string) => void;
  stopEditing: () => void;

  // Actions - Mouse
  setMousePosition: (x: number, y: number) => void;

  // Actions - Drag
  startDragging: (offsetX: number, offsetY: number) => void;
  stopDragging: () => void;
}

export const createTextBoxSlice: StateCreator<
  CanvasStore,
  [],
  [],
  TextBoxSlice
> = (set, get) => ({
  // Initial state
  textBoxes: [],
  selectedId: null,
  editingId: null,
  isDragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0,
  mouseX: 0,
  mouseY: 0,

  // Text box actions
  addNewTextBox: (x: number, y: number): TextBox => {
    // Offset Y position so cursor appears near click point (not below it)
    // Text in PixiJS renders from top-left, so we offset upward by ~half font size
    const FONT_SIZE = 16;
    const adjustedY = y - FONT_SIZE / 2;

    const newBox = createTextBox(x, adjustedY, `box-${Date.now()}`);
    set((state) => ({
      textBoxes: addTextBox(state.textBoxes, newBox),
      selectedId: newBox.id,
      editingId: newBox.id,
    }));
    return newBox;
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
      editingId: null,
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

  // Drag actions
  startDragging: (offsetX: number, offsetY: number) => {
    set({ isDragging: true, dragOffsetX: offsetX, dragOffsetY: offsetY });
  },

  stopDragging: () => {
    set({ isDragging: false, dragOffsetX: 0, dragOffsetY: 0 });
  },
});
