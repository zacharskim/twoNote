import { useEffect, Dispatch, SetStateAction } from "react";
import { isPrintableChar, isDeleteKey } from "@/canvas/input/keyboard";
import { resetCaretBlink, type CaretState } from "@/canvas/rendering/caretRenderer";
import { useCanvasStore } from "@/canvas/state/store";

/**
 * Custom hook to handle all keyboard input
 */
export const useKeyboardInput = (
  setCaretState: Dispatch<SetStateAction<CaretState>>
) => {
  const {
    insertTextAtCursor,
    deleteCharBeforeCursor,
    moveCursorLeft,
    moveCursorRight,
    copyToClipboard,
    cutToClipboard,
    pasteFromClipboard,
    selectAll
  } = useCanvasStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShiftHeld = event.shiftKey;
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;

      // Handle clipboard shortcuts (Cmd/Ctrl + C/X/V/A)
      if (isCmdOrCtrl && event.key === "c") {
        event.preventDefault();
        copyToClipboard();
        return;
      }
      if (isCmdOrCtrl && event.key === "x") {
        event.preventDefault();
        cutToClipboard();
        setCaretState((prev) => resetCaretBlink(prev));
        return;
      }
      if (isCmdOrCtrl && event.key === "v") {
        event.preventDefault();
        pasteFromClipboard();
        setCaretState((prev) => resetCaretBlink(prev));
        return;
      }
      if (isCmdOrCtrl && event.key === "a") {
        event.preventDefault();
        selectAll();
        setCaretState((prev) => resetCaretBlink(prev));
        return;
      }

      // Handle arrow keys for cursor movement (with optional selection)
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveCursorLeft(isShiftHeld);
        setCaretState((prev) => resetCaretBlink(prev));
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveCursorRight(isShiftHeld);
        setCaretState((prev) => resetCaretBlink(prev));
      }
      // Handle text input
      else if (event.key === "Enter") {
        insertTextAtCursor("\n");
        setCaretState((prev) => resetCaretBlink(prev));
      } else if (isPrintableChar(event.key)) {
        insertTextAtCursor(event.key);
        setCaretState((prev) => resetCaretBlink(prev));
      } else if (isDeleteKey(event.key)) {
        deleteCharBeforeCursor();
        setCaretState((prev) => resetCaretBlink(prev));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    insertTextAtCursor,
    deleteCharBeforeCursor,
    moveCursorLeft,
    moveCursorRight,
    copyToClipboard,
    cutToClipboard,
    pasteFromClipboard,
    selectAll,
    setCaretState
  ]);
};
