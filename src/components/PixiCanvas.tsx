"use client";

import { useRef, useEffect, useState } from "react";
import { Application, Text } from "pixi.js";
import { useCanvasStore } from "@/canvas/state/store";
import { createCaretState, updateCaretBlink } from "@/canvas/rendering/caretRenderer";
import { useKeyboardInput } from "./hooks/useKeyboardInput";
import { useMouseInput } from "./hooks/useMouseInput";
import { useCanvasRenderer } from "./hooks/useCanvasRenderer";
import { useTextBoxSync } from "./hooks/useTextBoxSync";

export default function PixiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const textRef = useRef<Text | null>(null);

  // Caret state and refs
  const [caretState, setCaretState] = useState(createCaretState());
  const caretChildIndexRef = useRef<number | undefined>(undefined);
  const selectionChildIndexRef = useRef<number | undefined>(undefined);

  // Get state from store (only what we need for rendering/display)
  const { cursorPosition, selection, textContent } = useCanvasStore();

  // Custom hooks for input handling
  useKeyboardInput(setCaretState);
  useMouseInput(canvasRef, textRef, setCaretState);
  useCanvasRenderer(appRef, textRef, caretState, caretChildIndexRef, selectionChildIndexRef);
  useTextBoxSync(appRef); // TODO: Implement when multi-textbox feature is ready

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


  // Caret blinking animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCaretState((prev) => updateCaretBlink(prev, Date.now()));
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, []);

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

        {/* Help text */}
        <div className="absolute bottom-4 left-4 bg-gray-800 border border-gray-700 rounded p-3 text-sm text-gray-400 space-y-1">
          <p>Canvas ready for text editing implementation</p>
          <p className="text-xs">Cursor: {cursorPosition}</p>
          <p className="text-xs">
            Selection: {selection.start === selection.end ? "none" : `${selection.start} → ${selection.end}`}
          </p>
          <p className="text-xs">
            Selected text: &ldquo;{textContent.substring(selection.start, selection.end)}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
