import { useEffect, RefObject, Dispatch, SetStateAction } from "react";
import { Text } from "pixi.js";
import { handleMouseMove } from "@/canvas/input/mouse";
import { getCursorPositionFromPoint } from "@/canvas/input/cursorPositioning";
import { resetCaretBlink, type CaretState } from "@/canvas/rendering/caretRenderer";
import { useCanvasStore } from "@/canvas/state/store";

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
    textContent
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

  // Mouse down - click to position cursor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (event: MouseEvent) => {
      const { x, y } = handleMouseMove(event, canvas);
      const text = textRef.current;
      if (!text) return;

      // Calculate cursor position from click
      const newCursorPosition = getCursorPositionFromPoint(text, x, y, textContent);

      // Set cursor position and clear selection
      setCursorPosition(newCursorPosition);
      clearSelection();
      setCaretState((prev) => resetCaretBlink(prev));
    };

    canvas.addEventListener("mousedown", onMouseDown);
    return () => canvas.removeEventListener("mousedown", onMouseDown);
  }, [canvasRef, textRef, textContent, setCursorPosition, clearSelection, setCaretState]);

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
