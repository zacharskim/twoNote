"use client";

import { useRef, useEffect } from "react";
import { Application, Text } from "pixi.js";
import { handleMouseMove } from "@/canvas/input/mouse";
import { isPrintableChar, isDeleteKey } from "@/canvas/input/keyboard";
import { useCanvasStore } from "@/canvas/state/store";
// import { findTextBoxById } from "@/canvas/entities/textBox";
// import { findBoxAtPoint, calculateOffset, calculateNewPosition } from "@/canvas/geometry/hitDetection";
// import {
//   createTextBoxContainer,
//   updateContainerPosition,
//   updateContainerContent,
//   updateContainerSelection
// } from "@/canvas/rendering/textRenderer";

export default function PixiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const textRef = useRef<Text | null>(null);
  // const containerMapRef = useRef<Map<string, Container>>(new Map());

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
    mouseX,
    mouseY,
    textContent,
    deleteTextBox,
    selectTextBox,
    stopEditing,
    startDragging,
    stopDragging,
    setMousePosition,
    appendText,
    deleteLastChar
  } = useCanvasStore();

  // Initialize PixiJS app
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let app: Application | null = null;

    const initPixi = async () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      app = new Application();

      await app.init({
        canvas,
        width: parent.clientWidth,
        height: parent.clientHeight,
        backgroundColor: 0x1a1a1a,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      });

      appRef.current = app;

      // Create text object for rendering
      const text = new Text({
        text: "",
        style: {
          fontFamily: "monospace",
          fontSize: 16,
          fill: 0xffffff
        }
      });
      app.stage.addChild(text);
      textRef.current = text;
    };

    initPixi();

    // Handle window resize
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent || !appRef.current) return;

      appRef.current.renderer.resize(parent.clientWidth, parent.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (app) {
        app.destroy();
      }
    };
  }, []);

  useEffect(() => {}, [mouseX, mouseY]);

  // TODO: Sync text boxes to PixiJS stage - commented out until text editing is implemented
  // useEffect(() => {
  //   const app = appRef.current;
  //   if (!app) return;
  //
  //   const containerMap = containerMapRef.current;
  //
  //   // Remove containers for deleted text boxes
  //   const currentIds = new Set(textBoxes.map((box) => box.id));
  //   containerMap.forEach((container, id) => {
  //     if (!currentIds.has(id)) {
  //       app.stage.removeChild(container);
  //       containerMap.delete(id);
  //     }
  //   });
  //
  //   // Add or update containers for text boxes
  //   textBoxes.forEach((textBox) => {
  //     const isSelected = textBox.id === selectedId;
  //     const existingContainer = containerMap.get(textBox.id);
  //
  //     if (existingContainer) {
  //       // Update existing container
  //       updateContainerPosition(existingContainer, textBox.x, textBox.y);
  //       updateContainerContent(existingContainer, textBox.content);
  //       updateContainerSelection(existingContainer, textBox, isSelected);
  //     } else {
  //       // Create new container
  //       const container = createTextBoxContainer(textBox, isSelected);
  //
  //       // Add click handler for selection (captured in closure)
  //       const boxId = textBox.id;
  //       container.on("pointerdown", (event) => {
  //         event.stopPropagation();
  //         const box = findTextBoxById(textBoxes, boxId);
  //         if (!box) return;
  //
  //         const offset = calculateOffset({ x: event.globalX, y: event.globalY }, box);
  //
  //         selectTextBox(boxId);
  //         startDragging(offset.x, offset.y);
  //       });
  //
  //       app.stage.addChild(container);
  //       containerMap.set(textBox.id, container);
  //     }
  //   });
  // }, [textBoxes, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================================================
  // Event Handlers
  // ============================================================================

  // Mouse move - track cursor position on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (event: MouseEvent) => {
      const { x, y } = handleMouseMove(event, canvas);
      setMousePosition(x, y);
    };

    canvas.addEventListener("mousemove", onMouseMove);
    return () => canvas.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Mouse down - handle clicks on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (event: MouseEvent) => {
      const { x, y } = handleMouseMove(event, canvas);
      console.log("Mouse down at:", x, y);
      // TODO: Handle text cursor placement, selection start, etc.
    };

    canvas.addEventListener("mousedown", onMouseDown);
    return () => canvas.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Mouse up - handle drag end, selection end
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseUp = (event: MouseEvent) => {
      console.log("Mouse up");
      // TODO: Handle drag end, selection end
    };

    canvas.addEventListener("mouseup", onMouseUp);
    return () => canvas.removeEventListener("mouseup", onMouseUp);
  }, []);

  // Double click - handle word selection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDoubleClick = (event: MouseEvent) => {
      const { x, y } = handleMouseMove(event, canvas);
      console.log("Double click at:", x, y);
      // TODO: Select word at position
    };

    canvas.addEventListener("dblclick", onDoubleClick);
    return () => canvas.removeEventListener("dblclick", onDoubleClick);
  }, []);

  // Render text at mouse position
  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    text.text = textContent;
    // text.x = mouseX;
    // text.y = mouseY;
  }, [textContent]);

  // Keyboard - handle text input and navigation
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        appendText("\n");
      } else if (isPrintableChar(event.key)) {
        appendText(event.key);
      } else if (isDeleteKey(event.key)) {
        deleteLastChar();
      }
      // TODO: Handle arrow keys, etc.
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [appendText, deleteLastChar]);

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
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* TODO: Canvas-based cursor rendering */}
        {/* When editingId is set, render a blinking cursor in the PixiJS canvas */}

        {/* Help text */}
        <div className="absolute bottom-4 left-4 bg-gray-800 border border-gray-700 rounded p-3 text-sm text-gray-400">
          <p>Canvas ready for text editing implementation</p>
        </div>
      </div>
    </div>
  );
}
