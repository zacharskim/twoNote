import { TextBox } from "@/types/canvas";
import { wrapText } from "./canvasUtils";

const PADDING = 16;
const LINE_HEIGHT = 28;
const FONT = '400 18px "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace';

// Pure rendering functions
export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f9fafb";
  ctx.fillRect(0, 0, width, height);
};

export const drawTextBox = (
  ctx: CanvasRenderingContext2D,
  box: TextBox,
  isSelected: boolean,
  isEditing: boolean,
  cursorVisible: boolean,
  cursorPosition: number
): void => {
  // Draw box background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(box.x, box.y, box.width, box.height);

  // Draw box border
  ctx.strokeStyle = isSelected ? "#3b82f6" : "#e5e7eb";
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.strokeRect(box.x, box.y, box.width, box.height);

  // Setup text rendering for crisp text
  ctx.font = FONT;
  ctx.textBaseline = "top";
  ctx.textRendering = "optimizeLegibility" as any;

  const lines = wrapText(ctx, box.content || (isEditing ? "|" : "Type here..."), box.width - PADDING * 2);

  lines.forEach((line, index) => {
    const y = box.y + PADDING + index * LINE_HEIGHT;
    ctx.fillStyle = box.content || isEditing ? "#1f2937" : "#9ca3af";
    ctx.fillText(line, box.x + PADDING, y);
  });

  // Draw cursor if editing
  if (isEditing && cursorVisible) {
    // Find which line the cursor is on and position within that line
    const textBeforeCursor = box.content.slice(0, cursorPosition);
    const linesBeforeCursor = textBeforeCursor.split('\n');
    const cursorLineIndex = linesBeforeCursor.length - 1;
    const textOnCursorLine = linesBeforeCursor[cursorLineIndex];

    // Wrap the lines to match how they're displayed
    const wrappedLines = wrapText(ctx, box.content || '|', box.width - PADDING * 2);

    // Calculate cursor position accounting for wrapped lines
    let charCount = 0;
    let cursorX = box.x + PADDING;
    let cursorY = box.y + PADDING - 3;

    for (let i = 0; i < wrappedLines.length; i++) {
      const lineLength = wrappedLines[i].length;
      if (charCount + lineLength >= cursorPosition) {
        // Cursor is on this line
        const posInLine = cursorPosition - charCount;
        const textBeforeCursorInLine = wrappedLines[i].slice(0, posInLine);
        cursorX = box.x + PADDING + ctx.measureText(textBeforeCursorInLine).width;
        cursorY = box.y + PADDING + i * LINE_HEIGHT - 3;
        break;
      }
      charCount += lineLength;
      // Account for newline character if not the last line
      if (i < lines.length - 1 && charCount < box.content.length && box.content[charCount] === '\n') {
        charCount++;
      }
    }

    ctx.fillStyle = "#1f3720ff";
    ctx.fillRect(cursorX, cursorY, 2, 20);
  }
};

export const drawHelpText = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillRect(16, 16, 220, 40);

  ctx.fillStyle = "#6b7280";
  ctx.font = "14px sans-serif";
  ctx.fillText("Double-click to create a text box", 26, 36);
};

export const renderCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  textBoxes: TextBox[],
  selectedId: string | null,
  editingId: string | null,
  cursorVisible: boolean,
  cursorPosition: number
): void => {
  clearCanvas(ctx, width, height);

  textBoxes.forEach((box) => {
    const isSelected = box.id === selectedId;
    const isEditing = box.id === editingId;
    drawTextBox(ctx, box, isSelected, isEditing, cursorVisible, cursorPosition);
  });

  drawHelpText(ctx);
};
