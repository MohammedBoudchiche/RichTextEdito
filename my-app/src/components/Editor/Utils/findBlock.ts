import type { Ast} from "./ast";
import type { BlockResult, BlockTypes } from "./interfaces";

export function findBlockByID(
  arrOrBlock: Array<BlockTypes> | BlockTypes,
  blockid: string
): BlockResult | null {
  const children = Array.isArray(arrOrBlock) ? arrOrBlock : arrOrBlock.children;
  for (const currentBlock of children) {
    if ("id" in currentBlock) {
      if (currentBlock.id === blockid) {
        return {
          found: true,
          currentBlock: currentBlock,
          type: currentBlock.type,
        };
      }
      if (
        currentBlock.type !== "paragraph" &&
        currentBlock.type !== "heading" &&
        currentBlock.children.length > 0
      ) {
        const result = findBlockByID(currentBlock, blockid);
        if (result?.found) {
          return result;
        }
      }
    }
  }
  return { found: false, currentBlock: null, type: "" };
}



// Deep copy function to avoid modifying the original data
//const deepCopy = (obj: ListItemBlock | ListBlock | TextBlock|InlineElement) =>
//  JSON.parse(JSON.stringify(obj));

export function findAndModifyBlock(
  ast: Ast,
  blockId: string,
  modification: BlockResult
): Ast|null {
  // Create a deep copy to avoid mutating the original
  const newAst: Ast = JSON.parse(JSON.stringify(ast));
  function walkAndModify(blocks: any[]): boolean {
    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];

      // Check if this is the block we're looking for
      if (block.id === blockId) {
        // Apply the modification
        //Object.assign(blocks[i], modification);
        console.log('reach block with id',block.id ,'===',blockId)
        console.log("block: ", block)
        console.log("modification: ", modification);
        blocks[i] = modification.currentBlock;
        return true; // Found and modified
      }

      // If this block has children, search recursively
      if (
        "children" in block &&
        Array.isArray(block.children) &&
        block.children.length > 0
      ) {
        // Check if children are blocks (not inline elements)
        
        if ('id' in block && block.children.length>0) {
          const found = walkAndModify(block.children as any[]);
          if (found) return true;
        }
      }
    }
    return false;
  }

  const found = walkAndModify(newAst);
  if (!found) {
    console.warn(`Block with id ${blockId} not found`);
    return null
  }

  return newAst;
}