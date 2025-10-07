"use client";

import { useRef, useEffect } from "react";
import { Application, Text, TextStyle } from "pixi.js";

export default function PixiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);

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
        autoDensity: true,
      });

      appRef.current = app;

      console.log('PixiJS app initialized:', {
        width: app.screen.width,
        height: app.screen.height,
        resolution: app.renderer.resolution,
      });

      // Add PixiJS text
      const textStyle = new TextStyle({
        fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, monospace',
        fontSize: 24,
        fill: 0xe5e7eb,
      });

      const pixiText = new Text({
        text: "PixiJS Text: The quick brown fox jumps over the lazy dog",
        style: textStyle,
      });
      pixiText.x = 50;
      pixiText.y = 100;
      app.stage.addChild(pixiText);

      console.log('Text added to stage:', {
        text: pixiText.text,
        x: pixiText.x,
        y: pixiText.y,
        visible: pixiText.visible,
        stageChildren: app.stage.children.length,
      });

      // Add label
      const labelStyle = new TextStyle({
        fontFamily: "sans-serif",
        fontSize: 16,
        fill: 0x9ca3af,
      });

      const label = new Text({
        text: "↑ PixiJS Text (WebGL)",
        style: labelStyle,
      });
      label.x = 50;
      label.y = 140;
      app.stage.addChild(label);
    };

    initPixi();

    return () => {
      if (app) {
        app.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-900 pt-8 gap-4">
      {/* DOM Text for comparison */}
      <div className="bg-gray-800 border border-gray-700 rounded p-6 max-w-4xl">
        <p
          className="text-gray-100 mb-2"
          style={{
            fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, monospace',
            fontSize: "24px",
          }}
        >
          DOM Text: The quick brown fox jumps over the lazy dog
        </p>
        <p className="text-gray-400 text-sm">↑ Regular DOM Text (Browser native rendering)</p>
      </div>

      {/* PixiJS Canvas */}
      <canvas
        ref={canvasRef}
        className="border border-gray-700 shadow-lg flex-1"
        style={{
          maxWidth: "95vw",
          maxHeight: "80vh",
        }}
      />
    </div>
  );
}
