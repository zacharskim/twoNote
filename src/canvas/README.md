# Canvas Module Structure

This directory contains all canvas-related functionality organized by domain.

## Directory Structure

```
canvas/
├── entities/       # Core data structures and their operations (pure functions)
│   ├── textBox.ts       # Text box CRUD operations
│   ├── image.ts         # Image operations (TODO)
│   ├── cursor.ts        # Cursor state (TODO)
│   └── boundingBox.ts   # Bounding box utilities (TODO)
│
├── geometry/       # Spatial calculations (pure functions)
│   ├── hitDetection.ts  # Point-in-box, finding elements at coordinates
│   ├── transforms.ts    # Coordinate transformations (TODO)
│   └── layout.ts        # Layout utilities like snap-to-grid (TODO)
│
├── rendering/      # PixiJS rendering (side effects isolated here)
│   ├── textRenderer.ts  # Render text boxes with PixiJS
│   ├── imageRenderer.ts # Render images (TODO)
│   └── styles.ts        # Shared rendering constants
│
├── input/          # Input handling (pure functions where possible)
│   ├── keyboard.ts      # Keyboard shortcuts and utilities (TODO)
│   ├── mouse.ts         # Mouse utilities (TODO)
│   └── selection.ts     # Selection logic (TODO)
│
└── state/          # State management
    └── store.ts         # Zustand store with all canvas state and actions
```

## Design Principles

### Functional Programming
- **Pure functions** in `entities/` and `geometry/` - no side effects, easy to test
- **Side effects isolated** to `rendering/` and component event handlers
- **Immutable updates** - always return new objects, never mutate

### State Management (Zustand)
- Single source of truth in `state/store.ts`
- Actions call pure functions from `entities/`
- Store is accessible anywhere, no prop drilling

### File Organization
- **By feature/domain** not by technical pattern
- Related code lives together
- Easy to find and understand

## Usage Examples

### Adding a text box
```typescript
// In a component
const { addNewTextBox } = useCanvasStore();
addNewTextBox(100, 200);
```

### Moving a text box
```typescript
const { moveTextBoxTo } = useCanvasStore();
moveTextBoxTo('box-123', 150, 250);
```

### Reading state
```typescript
const { textBoxes, selectedId } = useCanvasStore();
const selectedBox = textBoxes.find(box => box.id === selectedId);
```

## Adding New Features

1. **Entity operations** → Add pure functions to `entities/`
2. **Rendering** → Add PixiJS code to `rendering/`
3. **State** → Add to Zustand store in `state/store.ts`
4. **Geometry** → Add calculations to `geometry/`

Keep pure functions separate from side effects!
