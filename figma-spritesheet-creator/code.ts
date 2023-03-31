figma.showUI(__html__, { width: 240, height: 120 });

figma.ui.onmessage = (msg) => {
  if (msg.type === 'countSelected') {
    const count = figma.currentPage.selection.length;
    figma.ui.postMessage({ type: 'selectedCount', count });
  }
};
