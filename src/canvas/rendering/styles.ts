// Shared rendering styles and constants

export const COLORS = {
  boxBg: 0x262626,
  boxBorder: 0x404040,
  boxBorderSelected: 0x60a5fa,
  text: 0xe5e7eb,
  cursor: 0x86efac,
  canvasBg: 0x1a1a1a,
} as const;

export const SIZES = {
  boxPadding: 10,
  borderWidth: 2,
  defaultTextSize: 16,
  defaultBoxWidth: 300,
  defaultBoxHeight: 100,
} as const;

export const FONTS = {
  mono: '"Fira Code", "Fira Mono", Menlo, Consolas, monospace',
  sans: "sans-serif",
} as const;
