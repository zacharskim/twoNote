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

export interface CanvasStore {
  // State
  textBoxes: TextBox[];
  selectedId: string | null;
  editingId: string | null;
  cursorPosition: number;

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
  appendText: (char: string) => void;
  deleteLastChar: () => void;
  clearText: () => void;

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
  appendText: (char: string) => {
    set((state) => ({ textContent: state.textContent + char }));
  },

  deleteLastChar: () => {
    set((state) => ({
      textContent: state.textContent.slice(0, -1)
    }));
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
  }
}));
