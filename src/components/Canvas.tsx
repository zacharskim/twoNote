'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { CanvasState, DragState } from '@/types/canvas';
import { findTextBoxAt, updateTextBox, addTextBox, createTextBox } from '@/utils/canvasUtils';
import { renderCanvas } from '@/utils/canvasRenderer';
import { setupHiDPICanvas } from '@/utils/canvasSetup';

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    textBoxes: [],
    selectedId: null,
    editingId: null,
    cursorPosition: 0,
  });
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
  });
  const [cursorVisible, setCursorVisible] = useState(true);
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Setup HiDPI canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = setupHiDPICanvas(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctxRef.current = ctx;
  }, []);

  // Cursor blink effect
  useEffect(() => {
    const startBlinking = () => {
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = setInterval(() => {
        setCursorVisible((prev) => !prev);
      }, 530);
    };

    startBlinking();

    return () => {
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
    };
  }, []);

  // Reset cursor visibility on typing
  const resetCursorBlink = useCallback(() => {
    setCursorVisible(true);
    if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
    blinkIntervalRef.current = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
  }, []);

  // Render canvas whenever state changes
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    renderCanvas(
      ctx,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      canvasState.textBoxes,
      canvasState.selectedId,
      canvasState.editingId,
      cursorVisible,
      canvasState.cursorPosition
    );
  }, [canvasState, cursorVisible]);

  // Handle double-click to create text box
  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBox = createTextBox(x, y);

    setCanvasState((prev) => ({
      ...prev,
      textBoxes: addTextBox(prev.textBoxes, newBox),
      selectedId: newBox.id,
      editingId: newBox.id,
      cursorPosition: 0,
    }));
  }, []);

  // Handle single click for selection
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedBox = findTextBoxAt(x, y, canvasState.textBoxes);

    if (clickedBox) {
      setCanvasState((prev) => ({
        ...prev,
        selectedId: clickedBox.id,
        editingId: clickedBox.id,
        cursorPosition: clickedBox.content.length,
      }));
    } else {
      setCanvasState((prev) => ({
        ...prev,
        selectedId: null,
        editingId: null,
      }));
    }
  }, [canvasState.textBoxes]);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clickedBox = findTextBoxAt(x, y, canvasState.textBoxes);

      if (clickedBox) {
        setDragState({
          isDragging: true,
          offsetX: x - clickedBox.x,
          offsetY: y - clickedBox.y,
        });

        setCanvasState((prev) => ({
          ...prev,
          selectedId: clickedBox.id,
          editingId: null, // Stop editing when dragging
        }));
      }
    },
    [canvasState.textBoxes]
  );

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!dragState.isDragging || !canvasState.selectedId) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - dragState.offsetX;
      const y = e.clientY - rect.top - dragState.offsetY;

      setCanvasState((prev) => ({
        ...prev,
        textBoxes: updateTextBox(prev.textBoxes, prev.selectedId!, { x, y }),
      }));
    },
    [dragState, canvasState.selectedId]
  );

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
    });
  }, []);

  // Handle keyboard input for editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvasState.editingId) return;

      // Prevent default for keys we handle
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter' || e.key.startsWith('Arrow')) {
        e.preventDefault();
      }

      const editingBox = canvasState.textBoxes.find((b) => b.id === canvasState.editingId);
      if (!editingBox) return;

      let newContent = editingBox.content;
      let newCursorPosition = canvasState.cursorPosition;

      // Handle arrow keys
      if (e.key === 'ArrowLeft') {
        newCursorPosition = Math.max(0, canvasState.cursorPosition - 1);
        resetCursorBlink();
        setCanvasState((prev) => ({
          ...prev,
          cursorPosition: newCursorPosition,
        }));
        return;
      } else if (e.key === 'ArrowRight') {
        newCursorPosition = Math.min(editingBox.content.length, canvasState.cursorPosition + 1);
        resetCursorBlink();
        setCanvasState((prev) => ({
          ...prev,
          cursorPosition: newCursorPosition,
        }));
        return;
      } else if (e.key === 'ArrowUp') {
        // Find the current line and move cursor up
        const lines = editingBox.content.substring(0, canvasState.cursorPosition).split('\n');
        if (lines.length > 1) {
          const currentLinePos = lines[lines.length - 1].length;
          const prevLineLength = lines[lines.length - 2].length;
          const targetPos = Math.min(currentLinePos, prevLineLength);
          newCursorPosition = canvasState.cursorPosition - currentLinePos - 1 - (prevLineLength - targetPos);
          resetCursorBlink();
          setCanvasState((prev) => ({
            ...prev,
            cursorPosition: newCursorPosition,
          }));
        }
        return;
      } else if (e.key === 'ArrowDown') {
        // Find the current line and move cursor down
        const textAfterCursor = editingBox.content.substring(canvasState.cursorPosition);
        const nextNewline = textAfterCursor.indexOf('\n');
        if (nextNewline !== -1) {
          const textBeforeCursor = editingBox.content.substring(0, canvasState.cursorPosition);
          const currentLineStart = textBeforeCursor.lastIndexOf('\n') + 1;
          const currentLinePos = canvasState.cursorPosition - currentLineStart;
          const nextLineStart = canvasState.cursorPosition + nextNewline + 1;
          const nextLineEnd = editingBox.content.indexOf('\n', nextLineStart);
          const nextLineLength = nextLineEnd === -1 ? editingBox.content.length - nextLineStart : nextLineEnd - nextLineStart;
          const targetPos = Math.min(currentLinePos, nextLineLength);
          newCursorPosition = nextLineStart + targetPos;
          resetCursorBlink();
          setCanvasState((prev) => ({
            ...prev,
            cursorPosition: newCursorPosition,
          }));
        }
        return;
      }

      if (e.key === 'Backspace') {
        if (canvasState.cursorPosition > 0) {
          newContent = editingBox.content.slice(0, canvasState.cursorPosition - 1) + editingBox.content.slice(canvasState.cursorPosition);
          newCursorPosition = canvasState.cursorPosition - 1;
          resetCursorBlink();
        } else {
          return;
        }
      } else if (e.key === 'Enter') {
        newContent = editingBox.content.slice(0, canvasState.cursorPosition) + '\n' + editingBox.content.slice(canvasState.cursorPosition);
        newCursorPosition = canvasState.cursorPosition + 1;
        resetCursorBlink();
      } else if (e.key.length === 1) {
        newContent = editingBox.content.slice(0, canvasState.cursorPosition) + e.key + editingBox.content.slice(canvasState.cursorPosition);
        newCursorPosition = canvasState.cursorPosition + 1;
        resetCursorBlink();
      } else {
        return; // Don't update for other keys
      }

      setCanvasState((prev) => ({
        ...prev,
        textBoxes: updateTextBox(prev.textBoxes, canvasState.editingId!, {
          content: newContent,
        }),
        cursorPosition: newCursorPosition,
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvasState.editingId, canvasState.textBoxes, canvasState.cursorPosition, resetCursorBlink]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <canvas
        ref={canvasRef}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="border border-gray-300 shadow-lg cursor-crosshair"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          cursor: dragState.isDragging ? 'grabbing' : 'crosshair',
        }}
      />
    </div>
  );
}
