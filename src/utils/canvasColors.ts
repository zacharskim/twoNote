// Get CSS variables for canvas colors
export const getCanvasColors = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    canvasBg: style.getPropertyValue('--canvas-bg').trim(),
    canvasText: style.getPropertyValue('--canvas-text').trim(),
    canvasPlaceholder: style.getPropertyValue('--canvas-placeholder').trim(),
    canvasBoxBg: style.getPropertyValue('--canvas-box-bg').trim(),
    canvasBoxBorder: style.getPropertyValue('--canvas-box-border').trim(),
    canvasBoxBorderSelected: style.getPropertyValue('--canvas-box-border-selected').trim(),
    canvasCursor: style.getPropertyValue('--canvas-cursor').trim(),
    canvasHelpBg: style.getPropertyValue('--canvas-help-bg').trim(),
    canvasHelpText: style.getPropertyValue('--canvas-help-text').trim(),
    pageBg: style.getPropertyValue('--page-bg').trim(),
  };
};
