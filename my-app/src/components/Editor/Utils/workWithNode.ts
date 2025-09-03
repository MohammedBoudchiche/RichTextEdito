import type {  ListBlock, ListItemBlock, TextBlock } from "./ast";
import type { SearchBlockResult, SearchResult } from "./interfaces";
import { hasTextInlineElement, isListBlock } from "./isArray";
import { type TextSelection } from "./selection"
import { isBlockElementCheck } from "./typeOfElement";

export function findParentBlockElementID(
  selection: TextSelection
): string | null {
  if (!selection) {
    console.log("No text selection available");
    return null;
  }

  // Start with the node at the selection focus
  let currentNode: Node | null = selection.node;

  while (currentNode) {
    console.log("current Node:", currentNode);
    // Check if the current node is an HTMLElement and has a data-id
    if (currentNode instanceof HTMLElement && currentNode.dataset.id) {
      console.log("Found block with ID:", currentNode.dataset.id);
      return currentNode.dataset.id;
    }

    // Move up to the parent node
    currentNode = currentNode.parentNode;
  }

  // Return null if no parent block element is found
  return null;
}
  

function getTextNodeLength(node: Node | null): number {
  if (!node || node.nodeType !== Node.TEXT_NODE) return 0;
  return node.textContent?.length || 0; // Safely get length
}

export function getCurrentObjectById(array: (TextBlock | ListBlock| ListItemBlock)[], currentID:string){
  const currentIndex = array.findIndex(obj => obj.id === currentID)

  if(currentIndex === -1 || currentIndex === 0) return null

  return array[currentIndex]
}


export function getPreviousObjectById(array: (TextBlock | ListBlock| ListItemBlock)[], currentID:string,previosObjId:string|null= null):SearchResult{
  for(const block of array){
    if(block.id === currentID)
    {
      return {found:true, lastId:previosObjId,type:block.type}
    }
    previosObjId= block.id

       switch (block.type) {
      case 'paragraph':
      case 'heading':
        // TypeScript knows `block` is a TextBlock here.
        // TextBlocks have InlineElement[] children, which we can't recurse into.
        // So we do nothing for them.
        break;

      case 'unordered-list':
      case 'ordered-list':
        // TypeScript knows `block` is a ListBlock here.
        // Its children are ListItemBlock[], which we CAN process.
 
         for (const listItem of block.children) {
          // here im checking the list-item children if has a text so id  doesnt have 
          // a children then it has an inline so next block i wont loop it 
          if(hasTextInlineElement(listItem)){

            if(listItem.id===currentID)
            {
              return {found:true,lastId:previosObjId,type:block.type}
            }
            
             previosObjId = listItem.id;
               
          }
          else {
           const result= getPreviousObjectById([listItem], currentID,previosObjId); // Recursively process each list item
          if(result.found) {
              return {found:true, lastId:previosObjId,type:block.type}  // ✅ Correct - immediately return the found answer
          }
         else {
            previosObjId=result.lastId
         }
          }                
       }
        break;

      case 'list-item':
        // TypeScript knows `block` is a ListItemBlock here.
        // Its children are (InlineElement | ListBlock)[].
        for (const child of block.children) {
          console.log('child: ', child)
          // We need to check each child's type to see if it's a block we can recurse into
         if(!isBlockElementCheck(child)){
          const result =getPreviousIlemenetObjectById(block.children,currentID,previosObjId!)
          if(result.found){
            return {found:true,lastId:previosObjId,type:block.type}
          }
          previosObjId = result.lastId;
        }
        else if (isListBlock(child)) {
            console.log('child: ', [child])
            const result = getPreviousObjectById([child], currentID,previosObjId) // Recurse into the nested list
            if(result.found){
            return {found:true,lastId:previosObjId,type:block.type}
          }
          previosObjId=result.lastId
        }}
        break;
    }

}
  

      return {found:false, lastId:previosObjId}

}

function getPreviousIlemenetObjectById(arr: any[],poreviosID: string, currentID : string): SearchResult{


  for(const obj of arr)
  {  
    if(obj.id===currentID)
    {
      return {found:true, lastId:poreviosID}
    }
    poreviosID=obj.id
  }
  return {found:false,lastId:poreviosID}
}

export function getBlockByID(array: (TextBlock | ListBlock| ListItemBlock)[], blockID:string,currentblock: TextBlock | ListBlock | ListItemBlock | null = null):SearchBlockResult{
  for(const block of array){
    if(block.id === blockID)
    {
      return {found:true, returnedBlock:block}
    }
    currentblock =block

       switch (block.type) {
      case 'paragraph':
      case 'heading':
        // TypeScript knows `block` is a TextBlock here.
        // TextBlocks have InlineElement[] children, which we can't recurse into.
        // So we do nothing for them.
        break;

      case 'unordered-list':
      case 'ordered-list':
        // TypeScript knows `block` is a ListBlock here.
        // Its children are ListItemBlock[], which we CAN process. 
         for (const listItem of block.children) {
           if(hasTextInlineElement(listItem)){
            if(listItem.id===blockID)
            {
              return {found:true,returnedBlock:listItem}
            }               
          }
          else {
          const result= getBlockByID([listItem], blockID); // Recursively process each list item
          if(result) {
              return {found:true, returnedBlock:block}  // ✅ Correct - immediately return the found answer
          }   
          }                                           
       }
        break;

      case 'list-item':
        // TypeScript knows `block` is a ListItemBlock here.
        // Its children are (InlineElement | ListBlock)[].
        for (const child of block.children) {
          // We need to check each child's type to see if it's a block we can recurse into
         if(hasTextInlineElement(child)){
           if(block.id===blockID)
            {
               return {found:true, returnedBlock:block}  
            }          
        }
        else if (isListBlock(child)) {
            console.log('child: ', [child])
            const result = getBlockByID([child], blockID) // Recurse into the nested list
            if(result){
            return {found:true, returnedBlock:block}
          }
         
        }}
        break;
    }
}
  return {found:true, returnedBlock:currentblock}
}