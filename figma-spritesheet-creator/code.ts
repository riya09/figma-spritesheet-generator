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

       // Set the x and y position of the group to the top left of the viewport
      group.x = 0;
      group.y = 0;
      
      // Place the children of the group side by side without any gap
      const children = group.children;
      const spacing = 0; // Set the spacing between the children to 0
      let x = 0; // Start with the x position of the first child
      for (const child of children) {
        child.x = x;
        child.y = 0;
        x += child.width + spacing;
      }

      // Create a new page and set it as the current page
      const newPage = figma.createPage();
      figma.currentPage = newPage;
      
      // Move the group to the new page and set its position to the top left of the viewport
      newPage.appendChild(group);
      
      figma.viewport.scrollAndZoomIntoView([group]);
    }
  }
};
