import { useEffect, RefObject, Dispatch, SetStateAction } from "react";
import { Text } from "pixi.js";
import { handleMouseMove } from "@/canvas/input/mouse";
import { getCursorPositionFromPoint } from "@/canvas/input/cursorPositioning";
import { resetCaretBlink, type CaretState } from "@/canvas/rendering/caretRenderer";
import { useCanvasStore } from "@/canvas/state/store";
import type { TextBox } from "@/types/canvas";

/**
 * Helper: Check if a point is inside a text box
 */
const isPointInTextBox = (x: number, y: number, box: TextBox): boolean => {
  return x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height;
};

/**
 * Helper: Find which text box contains the click point
 */
const findTextBoxAtPoint = (x: number, y: number, textBoxes: TextBox[]): TextBox | null => {
  // Check in reverse order (top to bottom in render order)
  for (let i = textBoxes.length - 1; i >= 0; i--) {
    if (isPointInTextBox(x, y, textBoxes[i])) {
      return textBoxes[i];
    }
  }
  return null;
};

/**
 * Custom hook to handle all mouse input (move, click, double-click)
 */
export const useMouseInput = (
  canvasRef: RefObject<HTMLCanvasElement>,
  textRef: RefObject<Text | null>,
  setCaretState: Dispatch<SetStateAction<CaretState>>
) => {
  const {
    setMousePosition,
    setCursorPosition,
    clearSelection,
    selectWordAtPosition,
    textContent,
    addNewTextBox,
    textBoxes,
    editingId,
    startEditing
  } = useCanvasStore();

  // Mouse move - track cursor position
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (event: MouseEvent) => {
      const { x, y } = handleMouseMove(event, canvas);
      setMousePosition(x, y);
    };

    canvas.addEventListener("mousemove", onMouseMove);
    return () => canvas.removeEventListener("mousemove", onMouseMove);
  }, [canvasRef, setMousePosition]);

  // Mouse down - click to create/select text box or position cursor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (event: MouseEvent) => {
      const { x, y } = handleMouseMove(event, canvas);

      // Check if click is inside an existing text box
      const clickedBox = findTextBoxAtPoint(x, y, textBoxes);

      if (clickedBox) {
        // Click inside existing text box - start editing it
        startEditing(clickedBox.id);

        // TODO: Position cursor within the text box based on click position
        // For now, just start editing
        setCaretState((prev) => resetCaretBlink(prev));
      } else {
        // Click on empty canvas - create new text box
        addNewTextBox(x, y);
        setCaretState((prev) => resetCaretBlink(prev));
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    return () => canvas.removeEventListener("mousedown", onMouseDown);
  }, [canvasRef, textBoxes, addNewTextBox, startEditing, setCaretState]);

  // Double click - select word
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDoubleClick = (event: MouseEvent) => {
      const { x, y } = handleMouseMove(event, canvas);
      const text = textRef.current;
      if (!text) return;

      // Calculate cursor position from click
      const clickPosition = getCursorPositionFromPoint(text, x, y, textContent);

      // Select word at that position
      selectWordAtPosition(clickPosition);
      setCaretState((prev) => resetCaretBlink(prev));
    };

    canvas.addEventListener("dblclick", onDoubleClick);
    return () => canvas.removeEventListener("dblclick", onDoubleClick);
  }, [canvasRef, textRef, textContent, selectWordAtPosition, setCaretState]);
};
