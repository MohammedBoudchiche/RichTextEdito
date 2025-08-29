export interface TextSelection {
  selectedText: string;
  node: Node | null;
  range:Range
  nodeOffset: number;
  direction: string;
  focusnode: Node | null;
  focusoffset: number;
  isCollapsed: boolean;
  rangeCount: number;
  type: string;
}


export function getTextSelection ():TextSelection|null{
    const position = window.getSelection()
     if (!position || position.rangeCount === 0) return null;
    const selectedText = position.toString()
    console.log('hi selectedText here', selectedText)
    const range= position?.getRangeAt(0)
    const node=position.anchorNode
    const nodeOffset=position.anchorOffset
    const direction= position.direction
    const focusnode= position.focusNode
    const focusoffset= position.focusOffset
    const isCollapsed = position.isCollapsed 
    const rangeCount = position.rangeCount
    const type = position.type //range or caret or none

    return {
        selectedText,    
        // The actual text content that the user has selected
        range,

        node,
        // The DOM Node where the selection starts (anchor point)
         // Could be a text node, element node, etc.


        nodeOffset,
        // The character offset within the anchor node where the selection starts
        // For text nodes, this is the character position
        // For element nodes, this is the child node index

        direction,
        // The direction in which the selection was made:
        // - "forward": selection was made left-to-right or top-to-bottom
        // - "backward": selection was made right-to-left or bottom-to-top  
        // - "none": no direction (collapsed selection/caret)


        focusnode,
        // The DOM Node where the selection ends (focus point)


        focusoffset,
        // The character offset within the focus node where the selection ends

        
        isCollapsed,
        // Whether the selection is collapsed (caret position, no actual selection)
        // true = just a caret position, false = text is actually selected
        
        
        rangeCount,
        // Number of ranges in the selection (usually 1 for normal selections)

        type
        // Type of selection:
        // - "Range": regular text selection
        // - "Caret": collapsed selection (just a cursor)
        // - "None": no selection
    }
}
interface blockObject{
  id:string
  parentnodelength:string
}
export function findBlockIdFromNode(node:Node|null):blockObject|null {
 
  if(!node){
    return null
  }
  let currentNode:Node|null = node

  while(currentNode) {
    if(currentNode instanceof HTMLElement && currentNode.dataset.id){
      const id= currentNode.dataset.id
      const parentnodelength=currentNode?.textContent?.length.toString()
      return {id,parentnodelength}
    }

    currentNode = currentNode.parentNode
  }



return null
}