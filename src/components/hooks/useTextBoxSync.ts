import { useEffect, RefObject } from "react";
import { Application } from "pixi.js";
import { useCanvasStore } from "@/canvas/state/store";

/**
 * Custom hook to sync text boxes to PixiJS stage
 * TODO: Implement when text box editing is ready
 */
export const useTextBoxSync = (appRef: RefObject<Application | null>) => {
  const { textBoxes, selectedId } = useCanvasStore();

  useEffect(() => {
    // TODO: Sync text boxes to PixiJS stage - commented out until text editing is implemented
    // const app = appRef.current;
    // if (!app) return;
    //
    // const containerMap = containerMapRef.current;
    //
    // // Remove containers for deleted text boxes
    // const currentIds = new Set(textBoxes.map((box) => box.id));
    // containerMap.forEach((container, id) => {
    //   if (!currentIds.has(id)) {
    //     app.stage.removeChild(container);
    //     containerMap.delete(id);
    //   }
    // });
    //
    // // Add or update containers for text boxes
    // textBoxes.forEach((textBox) => {
    //   const isSelected = textBox.id === selectedId;
    //   const existingContainer = containerMap.get(textBox.id);
    //
    //   if (existingContainer) {
    //     // Update existing container
    //     updateContainerPosition(existingContainer, textBox.x, textBox.y);
    //     updateContainerContent(existingContainer, textBox.content);
    //     updateContainerSelection(existingContainer, textBox, isSelected);
    //   } else {
    //     // Create new container
    //     const container = createTextBoxContainer(textBox, isSelected);
    //
    //     // Add click handler for selection (captured in closure)
    //     const boxId = textBox.id;
    //     container.on("pointerdown", (event) => {
    //       event.stopPropagation();
    //       const box = findTextBoxById(textBoxes, boxId);
    //       if (!box) return;
    //
    //       const offset = calculateOffset({ x: event.globalX, y: event.globalY }, box);
    //
    //       selectTextBox(boxId);
    //       startDragging(offset.x, offset.y);
    //     });
    //
    //     app.stage.addChild(container);
    //     containerMap.set(textBox.id, container);
    //   }
    // });
  }, [appRef, textBoxes, selectedId]);
};
