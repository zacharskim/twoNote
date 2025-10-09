import { useEffect, RefObject } from "react";
import { Application, Text } from "pixi.js";
import { renderCaret, type CaretState } from "@/canvas/rendering/caretRenderer";
import { renderSelection } from "@/canvas/rendering/selectionRenderer";
import { useCanvasStore } from "@/canvas/state/store";

/**
 * Custom hook to handle canvas rendering (text, selection, caret)
 */
export const useCanvasRenderer = (
  appRef: RefObject<Application | null>,
  textRef: RefObject<Text | null>,
  caretState: CaretState,
  caretChildIndexRef: RefObject<number | undefined>,
  selectionChildIndexRef: RefObject<number | undefined>
) => {
  const { textContent, cursorPosition, selection } = useCanvasStore();

  // Render text, selection, and caret
  useEffect(() => {
    const text = textRef.current;
    const app = appRef.current;
    if (!text || !app) return;

    // Update text content
    text.text = textContent || "";

    // Render selection highlight (single-line only)
    const newSelectionIndex = renderSelection(
      app.stage,
      text,
      selection,
      textContent,
      selectionChildIndexRef.current
    );
    selectionChildIndexRef.current = newSelectionIndex;

    // Render caret at cursor position
    const newCaretIndex = renderCaret(
      app.stage,
      text,
      cursorPosition,
      textContent,
      caretState,
      caretChildIndexRef.current
    );

    caretChildIndexRef.current = newCaretIndex;
  }, [
    appRef,
    textRef,
    textContent,
    cursorPosition,
    caretState,
    selection,
    caretChildIndexRef,
    selectionChildIndexRef
  ]);
};
