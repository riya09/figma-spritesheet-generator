figma.showUI(__html__, { width: 240, height: 160 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'resizeAndGroupSelected') {
    const width = parseInt(msg.width);
    const height = parseInt(msg.height);
    const spacing = parseInt(msg.spacing);
    const layout = msg.layout;
    let cssCode = ''
    // Get all selected nodes and store them in an array
    const selection = figma.currentPage.selection;
    if (selection.length > 1) {
      // Group the selected elements
      // Create a new page and set it as the current page
      const newPage = figma.createPage();
      figma.currentPage = newPage;

      const cloneNodes = []
      for (const node of selection) {
        const cloneNode = node.clone()
        cloneNodes.push(cloneNode)
        newPage.appendChild(cloneNode);
      }

      const group = figma.group(cloneNodes, newPage);
      newPage.selection = [group];

      // Resize each selected element to the specified width and height
      for (const node of group.children) {
        node.resize(width, height);
      }
      
      // Place the children of the group side by side without any gap
      const children = group.children;
      if(children.length) {
        let x = 0; // Start with the x position of the first child
        let y = 0; // Start with the y position of the first child
        const row = Math.ceil(Math.sqrt(children.length)) - 1
        const elemWidth = children[0].width
        const elemHeight = children[0].height
        const totalWidth = (elemWidth * row) + (spacing * row)
        const groupName = formatName(group.name)
        cssCode += `.${groupName} {\n  background: url(${groupName}.png) no-repeat;\n}\n`;
        cssCode += `.icon {\n  width: ${elemWidth}px;\n  height: ${elemHeight}px;\n}\n`;
        for (const child of children) {
          child.x = x
          child.y = y
          const childName = formatName(child.name)
          cssCode += `.${childName} {\n  background-position: ${x > 0 ? `-${x}` : 0} ${y > 0 ? `-${y}` : 0};\n}\n`;
          if (layout === 'horizontal') {
            x += child.width + spacing
          } else if (layout === 'vertical') {
            y += child.height + spacing
          } else {
            if (x >= totalWidth) {
              x = 0
              y += child.height + spacing
            } else {
              x += child.width + spacing
            }
          }
        }
      }
      
      figma.viewport.scrollAndZoomIntoView([group]);
    }
  }
};

const formatName = (name) => {
  return name.replace(/ /g, '_').toLowerCase();
}
