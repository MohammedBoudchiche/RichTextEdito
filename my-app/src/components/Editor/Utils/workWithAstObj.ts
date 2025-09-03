import type { Ast, InlineElement, ListBlock, ListItemBlock, TextBlock } from "./ast";
import type { BlockResult } from "./interfaces";
import type { TextSelection } from "./selection";

export function removeCharacter(obj: BlockResult, selection: TextSelection) {

const range = selection.range
const cursorPosition = range.startOffset

const list = document.querySelector(`[data-id="${obj.currentBlock?.id}"]`);
const listRange= document.createRange()
listRange.setStart(list!,0)
listRange.setEnd(range.startContainer,range.startOffset)

const textUpToCursor = listRange.toString();
const totalCharacters = list!.textContent.length;

const nodeResult= {
  position: textUpToCursor.length,
  total: totalCharacters,
  relativePosition: textUpToCursor.length,
  atStart: textUpToCursor.length === 0,
  atEnd: textUpToCursor.length === totalCharacters,
};
console.log(
  `position: ${nodeResult.position} total: ${nodeResult.total} relativPosition: ${nodeResult.relativePosition}`
);


  const indexes = obj.currentBlock!.children.length-1
  console.log('indexes: ',indexes)
  let count=0
  let inline: InlineElement
  for(let i=0;i<=indexes;i++){
    if(obj.currentBlock!.children[i]){
        const result=obj.currentBlock?.children[i] as InlineElement
          let lastText: string = "";
          const text = result.text!;
          count += text.toString().length;
          if (nodeResult .position=== count) {
            console.log("!!!!!!!!!!!!!!!!!!!!!!", text.slice(0, -1));
          } 
          else if (nodeResult.position < count) {
            for (let i = 0; i <= text.toString().length; i++) {
              const currentplace = count - nodeResult.position;
              const currentposition = text.length - currentplace;
              console.log(
                `count ${count}- nodeResult.position ${nodeResult.position} = ${
                  count - nodeResult.position
                }`
              );
              console.log("currentposition: ", currentposition);
              console.log("currrrrr: ", currentplace);
              console.log('last position: ',(text.length-(count-nodeResult.position))  )

              for(let i =0;i <=text.length-1;i++ ){
                if(i===(text.length-(count-nodeResult.position)-1)){}
                else lastText+=text[i]
              }

              console.log('last Text: ',lastText)
            }
          }
          result.text = lastText;
          inline=result
        }
 }
 const arr=[]

 for(let i=0;i<=indexes;i++){
    if(i === indexes){
      arr.push(inline!)
    }else{
      const text = obj.currentBlock?.children[i]
      arr.push(text);
    }
    
 }

 return {
  id:obj.currentBlock?.id,
  type:obj.currentBlock?.children,
  Children: arr
 }
}



export function removeCharacterFromObj(
  obj: any,
  selection: TextSelection
):BlockResult {
  // Ensure the current block and its children exist
  if (!obj.currentBlock?.children) {
    return obj;
  }

  const range = selection.range;
  const cursorPosition = range.startOffset;

  // Find the DOM node corresponding to the current block's ID
  const list = document.querySelector(`[data-id="${obj.currentBlock.id}"]`);
  if (!list) {
    console.error(`Block with data-id="${obj.currentBlock.id}" not found.`);
    return obj;
  }

  const listRange = document.createRange();
  listRange.setStart(list, 0);
  listRange.setEnd(range.startContainer, range.startOffset);

  // Calculate the total character length up to the cursor position
  const relativePosition = listRange.toString().length;
  console.log(`Relative position of cursor: ${relativePosition}`);

  let charCount = 0;
  let updatedChildren = [...obj.currentBlock.children];
  let found = false;

  for (let i = 0; i < updatedChildren.length; i++) {
    const child = updatedChildren[i] as InlineElement;
    if (!child.text) continue;

    const childTextLength = child.text.length;
    const previousCharCount = charCount;
    charCount += childTextLength;

    // Check if the cursor is within this child's text node
    if (relativePosition <= charCount && !found) {
      found = true;
      const indexInChild = relativePosition - previousCharCount;

      // Handle a special case: deleting the last character of a child
      if (indexInChild === childTextLength) {
        // If the character to delete is the last one of the text node,
        // it means we are deleting the character *before* the current position.
        // This is a "backspace" operation.
        if (childTextLength > 0) {
          const newText = child.text.slice(0, -1);
          if (newText === "") {
            updatedChildren.splice(i, 1); // Remove the empty child
          } else {
            updatedChildren[i] = { ...child, text: newText };
          }
        }
      } else {
        // Normal case: deleting a character from the middle or beginning
        const newText =
          child.text.slice(0, indexInChild - 1) +
          child.text.slice(indexInChild);
        if (newText === "") {
          updatedChildren.splice(i, 1); // Remove the empty child
        } else {
          updatedChildren[i] = { ...child, text: newText };
        }
      }
    }
  }

  return {
    ...obj,
    currentBlock: {
      ...obj.currentBlock,
      children: updatedChildren,
    },
  } as BlockResult
}

