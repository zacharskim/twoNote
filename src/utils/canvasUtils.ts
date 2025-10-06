import { TextBox } from '@/types/canvas';

// Pure function to check if point is inside a text box
export const isPointInBox = (x: number, y: number, box: TextBox): boolean => {
  return x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height;
};

// Pure function to find text box at coordinates
export const findTextBoxAt = (x: number, y: number, boxes: TextBox[]): TextBox | null => {
  // Iterate in reverse to prioritize boxes drawn on top
  for (let i = boxes.length - 1; i >= 0; i--) {
    if (isPointInBox(x, y, boxes[i])) {
      return boxes[i];
    }
  }
  return null;
};

// Pure function to update a text box by id
export const updateTextBox = (
  boxes: TextBox[],
  id: string,
  updates: Partial<TextBox>
): TextBox[] => {
  return boxes.map((box) => (box.id === id ? { ...box, ...updates } : box));
};

// Pure function to add a new text box
export const addTextBox = (boxes: TextBox[], newBox: TextBox): TextBox[] => {
  return [...boxes, newBox];
};

// Pure function to create a new text box
export const createTextBox = (x: number, y: number): TextBox => {
  return {
    id: crypto.randomUUID(),
    content: '',
    x,
    y,
    width: 200,
    height: 100,
  };
};

// Pure function to wrap text into lines based on width
export const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph === '') {
      lines.push('');
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
};

// Pure function to calculate text box height based on content
export const calculateTextBoxHeight = (
  ctx: CanvasRenderingContext2D,
  content: string,
  width: number,
  lineHeight: number,
  padding: number
): number => {
  const lines = wrapText(ctx, content, width - padding * 2);
  return Math.max(100, lines.length * lineHeight + padding * 2);
};
