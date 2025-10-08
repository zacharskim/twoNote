// TODO: Selection handling
// - selectElement(id)
// - multiSelect(ids)
// - clearSelection()
// - isSelected(id)
// - etc.

export const toggleSelection = (
  currentSelection: string[],
  id: string
): string[] => {
  if (currentSelection.includes(id)) {
    return currentSelection.filter((selectedId) => selectedId !== id);
  }
  return [...currentSelection, id];
};
