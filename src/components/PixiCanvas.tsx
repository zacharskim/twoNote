"use client";

import { useRef, useEffect, useCallback } from "react";
import { Application, Container } from "pixi.js";
import { useCanvasStore } from "@/canvas/state/store";
import { findTextBoxById } from "@/canvas/entities/textBox";
import { findBoxAtPoint, calculateOffset, calculateNewPosition } from "@/canvas/geometry/hitDetection";
import {
  createTextBoxContainer,
  updateContainerPosition,
  updateContainerContent,
  updateContainerSelection
} from "@/canvas/rendering/textRenderer";

export default function PixiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const containerMapRef = useRef<Map<string, Container>>(new Map());

  // Zustand store
  const {
    textBoxes,
    selectedId,
    editingId,
    isDragging,
    dragOffsetX,
    dragOffsetY,
    addNewTextBox,
    updateTextBox,
    moveTextBoxTo,
    deleteTextBox,
    selectTextBox,
    stopEditing,
    startDragging,
    stopDragging
  } = useCanvasStore();

  // Initialize PixiJS app
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let app: Application | null = null;

    const initPixi = async () => {
      app = new Application();

      await app.init({
        canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1a1a1a,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      });

      appRef.current = app;
    };

    initPixi();

    return () => {
      if (app) {
        app.destroy();
      }
    };
  }, []);

  // Sync text boxes to PixiJS stage
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    const containerMap = containerMapRef.current;

    // Remove containers for deleted text boxes
    const currentIds = new Set(textBoxes.map((box) => box.id));
    containerMap.forEach((container, id) => {
      if (!currentIds.has(id)) {
        app.stage.removeChild(container);
        containerMap.delete(id);
      }
    });

    // Add or update containers for text boxes
    textBoxes.forEach((textBox) => {
      const isSelected = textBox.id === selectedId;
      const existingContainer = containerMap.get(textBox.id);

      if (existingContainer) {
        // Update existing container
        updateContainerPosition(existingContainer, textBox.x, textBox.y);
        updateContainerContent(existingContainer, textBox.content);
        updateContainerSelection(existingContainer, textBox, isSelected);
      } else {
        // Create new container
        const container = createTextBoxContainer(textBox, isSelected);

        // Add click handler for selection (captured in closure)
        const boxId = textBox.id;
        container.on("pointerdown", (event) => {
          event.stopPropagation();
          const box = findTextBoxById(textBoxes, boxId);
          if (!box) return;

          const offset = calculateOffset({ x: event.globalX, y: event.globalY }, box);

          selectTextBox(boxId);
          startDragging(offset.x, offset.y);
        });

        app.stage.addChild(container);
        containerMap.set(textBox.id, container);
      }
    });
  }, [textBoxes, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Event handlers
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clickedBox = findBoxAtPoint({ x, y }, textBoxes);

      if (!clickedBox) {
        // Create new text box
        addNewTextBox(x - 150, y - 50);
      }
    },
    [textBoxes] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging || !selectedId) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newPos = calculateNewPosition({ x, y }, { x: dragOffsetX, y: dragOffsetY });

      moveTextBoxTo(selectedId, newPos.x, newPos.y);
    },
    [isDragging, selectedId, dragOffsetX, dragOffsetY] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Global keyboard handler for canvas text editing
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // TODO: Implement canvas-based text editing
      // Handle character input, backspace, delete, arrow keys, etc.

      if (event.key === "Escape") {
        if (editingId) {
          stopEditing();
        } else if (selectedId) {
          selectTextBox(null);
        }
      } else if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedId && !editingId) {
          deleteTextBox(selectedId);
        } else if (editingId) {
          // TODO: Handle backspace/delete during editing
          // Remove character at cursor position
        }
      } else if (editingId && event.key.length === 1) {
        // TODO: Insert character at cursor position
        // Handle printable characters during editing
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingId, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-900 pt-8 gap-4">
      {/* DOM Text for comparison */}
      <div className="bg-gray-800 border border-gray-700 rounded p-6 max-w-4xl">
        <p
          className="text-gray-100 mb-2"
          style={{
            fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, monospace',
            fontSize: "16px"
          }}
        >
          DOM Text: The quick brown fox jumps over the lazy dog
        </p>
        <p className="text-gray-400 text-sm">↑ Regular DOM Text (Browser native rendering)</p>
      </div>

      {/* Canvas container */}
      <div className="relative border border-gray-700 shadow-lg" style={{ width: "95vw", height: "80vh" }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        />

        {/* TODO: Canvas-based cursor rendering */}
        {/* When editingId is set, render a blinking cursor in the PixiJS canvas */}

        {/* Help text */}
        <div className="absolute bottom-4 left-4 bg-gray-800 border border-gray-700 rounded p-3 text-sm text-gray-400">
          <p>Click anywhere to create a text box</p>
          <p>Click a box to select and drag it</p>
          <p>ESC to stop editing • Delete empty box to remove</p>
        </div>
      </div>
    </div>
  );
}
