import { useEffect, RefObject } from "react";
import { Application, Text } from "pixi.js";
import { useCanvasStore } from "@/canvas/state/store";

/**
 * Custom hook to sync text boxes to PixiJS stage
 * Creates/updates/removes Text objects based on textBoxes state
 */
export const useTextBoxSync = (
  appRef: RefObject<Application | null>,
  textObjectsRef: RefObject<Map<string, Text>>,
) => {
  const { textBoxes } = useCanvasStore();

  useEffect(() => {
    const app = appRef.current;
    const textObjectsMap = textObjectsRef.current;
    if (!app || !textObjectsMap) return;

    // Get current text box IDs
    const currentIds = new Set(textBoxes.map((box) => box.id));

    // Remove Text objects for deleted text boxes
    textObjectsMap.forEach((textObj, id) => {
      if (!currentIds.has(id)) {
        app.stage.removeChild(textObj);
        textObj.destroy();
        textObjectsMap.delete(id);
      }
    });

    // Add or update Text objects for each text box
    textBoxes.forEach((textBox) => {
      let textObj = textObjectsMap.get(textBox.id);

      if (textObj) {
        // Update existing Text object
        textObj.text = textBox.content;
        textObj.x = textBox.x;
        textObj.y = textBox.y;
      } else {
        // Create new Text object
        textObj = new Text({
          text: textBox.content,
          style: {
            fontFamily: "monospace",
            fontSize: 16,
            fill: 0xffffff,
          },
        });
        textObj.x = textBox.x;
        textObj.y = textBox.y;

        app.stage.addChild(textObj);
        textObjectsMap.set(textBox.id, textObj);
      }
    });
  }, [appRef, textObjectsRef, textBoxes]);
};
