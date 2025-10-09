import { Text } from "pixi.js";

/**
 * Calculates cursor position from a click/mouse position
 * Returns the character index closest to the click
 */
export const getCursorPositionFromPoint = (
  text: Text,
  clickX: number,
  clickY: number,
  content: string
): number => {
  // For single-line text, we only care about X position
  // (Multi-line would need to check Y position to determine line)

  // If click is before the text, return position 0
  if (clickX <= text.x) {
    return 0;
  }

  // Binary search to find the closest character position
  let left = 0;
  let right = content.length;
  let closestPosition = 0;
  let closestDistance = Infinity;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Measure text up to this position
    const textUpToMid = content.substring(0, mid);
    const tempText = new Text({
      text: textUpToMid,
      style: text.style
    });

    const xPosition = text.x + tempText.width;
    const distance = Math.abs(clickX - xPosition);

    tempText.destroy();

    // Update closest if this is better
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPosition = mid;
    }

    // Binary search logic
    if (xPosition < clickX) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return closestPosition;
};
