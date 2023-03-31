figma.showUI(__html__, { width: 240, height: 160 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'resizeAndGroupSelected') {
    const width = parseInt(msg.width);
    const height = parseInt(msg.height);
    const selection = figma.currentPage.selection;
    if (selection.length > 1) {
    // Resize each selected element to the specified width and height
      for (const node of selection) {
        node.resize(width, height);
      }
      
      // Group the selected elements
      const group = figma.group(selection, figma.currentPage);
      figma.currentPage.selection = [group];
      // position the group at the start
      group.x = 0
      group.y = 0
      
      // Place the children of the group side by side without any gap
      const children = group.children;
      const spacing = 0; // Set the spacing between the children to 0
      let x = group.x; // Start with the x position of the first child
      for (const child of children) {
        child.x = x;
        child.y = group.y
        x += child.width + spacing;
      }
      
      figma.viewport.scrollAndZoomIntoView([group]);
    }
  }
};
