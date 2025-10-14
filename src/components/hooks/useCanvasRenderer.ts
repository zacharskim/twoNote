import { useEffect, RefObject } from "react";
import { Application, Text } from "pixi.js";
import { renderCaret, type CaretState } from "@/canvas/rendering/caretRenderer";
import { renderSelection } from "@/canvas/rendering/selectionRenderer";
import { useCanvasStore } from "@/canvas/state/store";

/**
 * Custom hook to handle canvas rendering (caret and selection for active text box)
 */
export const useCanvasRenderer = (
  appRef: RefObject<Application | null>,
  textObjectsRef: RefObject<Map<string, Text>>,
  caretState: CaretState,
  caretChildIndexRef: RefObject<number | undefined>,
  selectionChildIndexRef: RefObject<number | undefined>
) => {
  const { cursorPosition, selection, editingId, textBoxes } = useCanvasStore();

  // Render caret and selection for the currently editing text box
  useEffect(() => {
    const app = appRef.current;
    const textObjectsMap = textObjectsRef.current;
    if (!app || !textObjectsMap) return;

    // If no text box is being edited, don't render caret/selection
    if (!editingId) return;

    // Find the text box being edited
    const textBox = textBoxes.find((box) => box.id === editingId);
    if (!textBox) return;

    // Get the Text object for this text box
    const text = textObjectsMap.get(editingId);
    if (!text) return;

    // Render selection highlight (single-line only)
    const newSelectionIndex = renderSelection(
      app.stage,
      text,
      selection,
      textBox.content,
      selectionChildIndexRef.current
    );
    selectionChildIndexRef.current = newSelectionIndex;

    // Render caret at cursor position
    const newCaretIndex = renderCaret(
      app.stage,
      text,
      cursorPosition,
      textBox.content,
      caretState,
      caretChildIndexRef.current
    );

    caretChildIndexRef.current = newCaretIndex;
  }, [
    appRef,
    textObjectsRef,
    cursorPosition,
    caretState,
    selection,
    editingId,
    textBoxes,
    caretChildIndexRef,
    selectionChildIndexRef
  ]);
};
