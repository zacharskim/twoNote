import { useEffect, RefObject, useRef } from "react";
import { Application, Text, Container, Graphics } from "pixi.js";
import { useCanvasStore } from "@/canvas/state/store";

/**
 * Custom hook to sync text boxes to PixiJS stage
 * Creates/updates/removes Text objects and borders based on textBoxes state
 */
export const useTextBoxSync = (
  appRef: RefObject<Application | null>,
  textObjectsRef: RefObject<Map<string, Text>>,
) => {
  const { textBoxes } = useCanvasStore();

  // Map to track containers (each holds border + text)
  const containersRef = useRef<Map<string, Container>>(new Map());

  useEffect(() => {
    const app = appRef.current;
    const textObjectsMap = textObjectsRef.current;
    const containersMap = containersRef.current;
    if (!app || !textObjectsMap) return;

    // Get current text box IDs
    const currentIds = new Set(textBoxes.map((box) => box.id));

    // Remove containers for deleted text boxes
    containersMap.forEach((container, id) => {
      if (!currentIds.has(id)) {
        app.stage.removeChild(container);
        container.destroy({ children: true });
        containersMap.delete(id);
        textObjectsMap.delete(id);
      }
    });

    // Add or update containers for each text box
    textBoxes.forEach((textBox) => {
      let container = containersMap.get(textBox.id);
      let textObj = textObjectsMap.get(textBox.id);

      if (container && textObj) {
        // Update existing container and text
        textObj.text = textBox.content;
        container.x = textBox.x;
        container.y = textBox.y;

        // Update border (first child is the border Graphics)
        const border = container.children[0] as Graphics;
        border.clear();
        border.rect(0, 0, textBox.width, textBox.height);
        border.stroke({ width: 1, color: 0x666666 });
      } else {
        // Create new container
        container = new Container();
        container.x = textBox.x;
        container.y = textBox.y;

        // Create border
        const border = new Graphics();
        border.rect(0, 0, textBox.width, textBox.height);
        border.stroke({ width: 1, color: 0x666666 });
        container.addChild(border);

        // Create text
        textObj = new Text({
          text: textBox.content,
          style: {
            fontFamily: "monospace",
            fontSize: 16,
            fill: 0xffffff,
          },
        });
        textObj.x = 5; // Small padding from border
        textObj.y = 5;
        container.addChild(textObj);

        app.stage.addChild(container);
        containersMap.set(textBox.id, container);
        textObjectsMap.set(textBox.id, textObj);
      }
    });
  }, [appRef, textObjectsRef, textBoxes]);
};
