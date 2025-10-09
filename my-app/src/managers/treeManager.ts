import createTimeBaseID from "../components/Editor/Utils/newID";
import type { TextSelection } from "../components/Editor/Utils/selection";
import { type Ast, type InlineElement, type InlineFormat, type ListBlock, type ListItemBlock, type TextBlock } from "../core/ast";
import { ListBlockNode } from "../core/nodes/listBlockNode";
import type { ListItemBlockNode } from "../core/nodes/listItemBlockNode";
import type { ChildBlock } from "../core/types";
import isBlockElement, { hasBlockChanges, hasBlockChild, hasId, isInlineElement } from "../utils/typeGuards";
import { NodesManager } from "./nodesManager";

export class TreeManager {
  private root: ListBlockNode | null = null;
  private ast: Ast;

  constructor(ast: Ast) {
    this.ast = ast;
  }

  public build(rawAst: ListBlock): ListBlockNode {
    if (rawAst.type !== "ordered-list" && rawAst.type !== "unordered-list") {
      throw new Error("The root of the tree must be a list block.");
    }

    this.root = new ListBlockNode(rawAst);
    this._buildChildren(rawAst.children, this.root);
    return this.root;
  }

  public editBlock(currentBlockId: string): ListBlock {
    const treeParentBlock = this._findblockTreeParent(currentBlockId)
      .block as ListBlock;
    const copyTreeParentBlock = this._deepCopyBlock(treeParentBlock);
    if (!copyTreeParentBlock)
      throw console.log("in edit block tree block parent is null or undifind");

    const currentBlock = this.getBlockById(currentBlockId) as ListItemBlock;
    if (!currentBlock) throw console.log("in edit block current block is null");

    const currentParentId = this.findBlockParent(currentBlockId);
    if (!currentParentId)
      throw console.log("in edit block: current block parent ID is null");

    const parentCurrentBlock = this.getBlockById(
      currentParentId
    );
    const editpPeviousBlock = this._movechilToPreviouseBlock(
      copyTreeParentBlock,
      currentBlock as ListItemBlock
    );

    const updatePreviouseBlock = this._editPreviousBlock(copyTreeParentBlock as ListBlock,editpPeviousBlock!);
    const updateCurrentBlock =
      this._handleCurrentBlockAfterRemoveContent(currentBlock);
    const newArr = this.cleanCurrentBlock(
      updatePreviouseBlock,
      parentCurrentBlock!.id,
      currentBlock.id,
      updateCurrentBlock
    );
    const result = this.cleanTreeBlock(updatePreviouseBlock, newArr!);
    return result;
  }

  public handleSpaceBack(currentblockid: string): Ast | null {
    const updatePreviouseBlockTree =this._updatePreviouseBlockTree(currentblockid)

    const found = this._isPreviuoseVisionBlockInCurentBlockTree(currentblockid);

    if (found === true) {
      this._updateCurrentBlockTree(updatePreviouseBlockTree as ListBlock,currentblockid)
      
      const newAst = this.creatCleanNewAst(this.ast, updatePreviouseBlockTree!)
      return newAst

    } else {
      const currentBlockTree = this._findblockTreeParent(currentblockid).block as ListBlock
      this._updateCurrentBlockTree(currentBlockTree ,currentblockid)
      const newAst = this.creatCleanNewAst(this.ast,updatePreviouseBlockTree!);
      return newAst
    }
  }

  public handleSpaceBackInContent(currentBlockId:string,selection:TextSelection):Ast{
    const nodeManager = new NodesManager()
    
    const currentBlock = this.getBlockById(currentBlockId)as ListItemBlock|TextBlock

    const updateBlock =nodeManager.removeCharFromNode(currentBlock,selection)
      const cleantTree= this.cleanTreeBlock(updateBlock)
      const newAst =  this.creatCleanNewAst(this.ast,cleantTree)
      return newAst

  }

  public handleAddCharToNode(currentBlockId:string,selection:TextSelection):Ast{

    const nodeManager = new NodesManager()
    
    const currentBlock = this.getBlockById(currentBlockId)as ListItemBlock|TextBlock    
    const updateBlock = nodeManager.addLetterToNode(currentBlock,selection)

    const cleantTree = this.cleanTreeBlock(updateBlock)
    const newAst = this.creatCleanNewAst(this.ast, cleantTree);

    return newAst;

  }

  public handleCreateNewBlock(currentBlockId:string,selection:TextSelection):Ast{
    console.log('handleCreate new block')

    const nodeManager = new NodesManager()
    const currentBlock = this.getBlockById(currentBlockId)as ListItemBlock|TextBlock
    const spreadBlock=nodeManager.spreadNode(currentBlock,selection)
    
    const newVisionBlockPart1=this._createNewVisionBlock(currentBlock as ListItemBlock|TextBlock,spreadBlock.part1)
    const newVisionBlockPart2=this._createNewVisionBlock(currentBlock as ListItemBlock|TextBlock,spreadBlock.part2)
    console.log("newVisionBlockPart1", newVisionBlockPart1);
    console.log("newVisionBlockPart2", newVisionBlockPart2);

    const index = currentBlock.type === 'list-item' 
    ? this.ast.findIndex(child => child.id === this._findblockTreeParent(currentBlock.id).block?.id)
    : this.ast.findIndex(child => child.id === currentBlock.id);
    if(newVisionBlockPart1.type !== 'list-item'){
      const newAst=this._replaceBlockToAst(this.ast,newVisionBlockPart1 as TextBlock,index)
      const updateNewAst = this._addBlockToAst(newAst,newVisionBlockPart2 as TextBlock,index)
      return updateNewAst
    }
    else {

      const blockChildren = this._getBlockChildrenInBlock(currentBlock as ListItemBlock) as ListBlock[]

      const newVisionBlockPart1=this._createNewVisionBlock(currentBlock as ListItemBlock,spreadBlock.part1)as ListItemBlock

      newVisionBlockPart1.children.push(...blockChildren)
      const newVisionBlockPart2=this._createNewVisionBlock(currentBlock as ListItemBlock,spreadBlock.part2)as ListItemBlock

      const parentBlockId = this.findBlockParent(currentBlock.id)
      const parentBlock = this.getBlockById(parentBlockId!) as ListBlock

      const currentBlockIndex = parentBlock.children.findIndex(
        (child) => child.id === currentBlock.id
      );

      const copyParentBlock = this._deepCopyBlock(parentBlock) as ListBlock

      copyParentBlock.children.splice(currentBlockIndex,1,newVisionBlockPart1)
      copyParentBlock.children.splice(currentBlockIndex+1,0,newVisionBlockPart2)
      const newTreeBlock=this.cleanTreeBlock(copyParentBlock)

      const newAst = this._replaceBlockToAst(this.ast,newTreeBlock as ListBlock,index)
      return newAst
    }
    

  }

  private _getBlockChildrenInBlock(currentBlock: ListBlock|ListItemBlock):(ListBlock|ListItemBlock)[]{
    const copyCurrentBlock = this._deepCopyBlock(currentBlock)
    let arr:(ListBlock|ListItemBlock)[]=[]
    for (const child of copyCurrentBlock.children) {
      if (!isInlineElement(child)) [arr.push(child)];
    }
    return arr
  }

  private _createNewVisionBlock(currentBlock:TextBlock|ListItemBlock,content:string):TextBlock|ListItemBlock{

    const formats: InlineFormat[] = currentBlock.children.reduce(
      (acc: InlineFormat[], child) => {
        if (isInlineElement(child)) {
          acc.push(...child.formats);
        }
        return acc;
      },
      []
    );
    const inline:InlineElement={
      text:content,
      formats:formats
    }

    if(currentBlock.type==='list-item'){
      const newObj: ListItemBlock = {
        id: createTimeBaseID(),
        type: 'list-item',
        children:[inline]
      };
      return newObj
    }else {
      const newObj: TextBlock = {
        id: createTimeBaseID(),
        type: currentBlock.type,
        children: [inline],
      };
      return newObj;
    }

  }

  private _isPreviuoseVisionBlockInCurentBlockTree(
    currentBlockId: string
  ): boolean {
    const previousVisionBlock = this.getPreviuoseVisionBlock(currentBlockId);

    const treeBlockOfPreviousVisionBlock = this._findblockTreeParent(
      previousVisionBlock!.id
    ).block;
    const treeBlockOfCurrentBlock =
      this._findblockTreeParent(currentBlockId).block;

    if (treeBlockOfCurrentBlock?.id === treeBlockOfPreviousVisionBlock?.id) {
      return true;
    }
    return false;
  }
  private _updatePreviouseBlockTree(
    currentBlockId: string
  ): TextBlock | ListBlock | null {
    let result: ListBlock | TextBlock | null = null;

    const currentBlock = this.getBlockById(currentBlockId);
    if (!currentBlock) {
      console.log("current Block is null");
      return null;
    }
    const copyCurrentBlock = this._deepCopyBlock(currentBlock);

    const previousVisionBlock = this.getPreviuoseVisionBlock(currentBlockId);
    if (!previousVisionBlock) {
      console.log("previousVisionBlock is null");
      return null;
    }
    const copyOfPreviousBlock = this._deepCopyBlock(previousVisionBlock) as
      | ListItemBlock
      | TextBlock;

    const treeBlockOfPreviousVisionBlock = this._findblockTreeParent(
      copyOfPreviousBlock.id
    ).block;
    if (!treeBlockOfPreviousVisionBlock) {
      console.log("treeBlockOfPreviousVisionBlock is null");
      return null;
    }
    const copyOfTreeBlockOfPreviousVisionBlock = this._deepCopyBlock(
      treeBlockOfPreviousVisionBlock
    ) as TextBlock | ListBlock;

    const content = this.getAllInlineContentINCurrentBlock(
      copyCurrentBlock as TextBlock | ListItemBlock
    );

    const copyOfPreviousVisionBlock = this._movechilToPreviouseBlock(
      copyOfPreviousBlock,
      content ? content : []
    );

    if (
      copyOfTreeBlockOfPreviousVisionBlock?.type !== "ordered-list" &&
      copyOfTreeBlockOfPreviousVisionBlock?.type !== "unordered-list"
    ) {
      result = copyOfPreviousVisionBlock as TextBlock;
    } else {
      result = this.cleanTreeBlock(copyOfPreviousVisionBlock);
    }
    return hasBlockChanges(copyOfTreeBlockOfPreviousVisionBlock, result)
      ? result
      : null;
  }

  private _updateCurrentBlockTree(
    blockTree: ListBlock|null=null,
    currentBlockId: string
  ){
    let Tree: ListBlock;

    if(!blockTree){
      const tree =this._findblockTreeParent(currentBlockId).block
      Tree  = this._deepCopyBlock(tree!) as ListBlock  
    }
    else Tree=blockTree

    const parentCurrentBlockId = this.findBlockParent(currentBlockId)
    const currentBlockParent = this._findBlockByIdInTree(Tree!,parentCurrentBlockId!);
    const currentBlock = this.getBlockById(currentBlockId)

   const index = currentBlockParent?.children.findIndex(
     (child) => hasId(child) && child.id === currentBlockId
   );

    const copyCurrentBlock = this._deepCopyBlock(currentBlock!);
    const childrenBlock = this._getChildrenBlockInBlock(
      copyCurrentBlock as ListItemBlock
    );
   // Check if index is valid and parent exists
   if (currentBlockParent && index !== undefined && index !== -1) {
     currentBlockParent.children.splice(index, 1,...childrenBlock); // Remove 1 element
   } else {
     console.log("Child not found or invalid index");
   }
    
  }

  private _buildChildren(
    childrenData: ChildBlock[],
    parentNode: ListBlockNode | ListItemBlockNode
  ): void {
    for (const child of childrenData) {
      if (!isInlineElement(child)) {
        if (child.type === "list-item") {
          const listItemNode = (parentNode as ListBlockNode).addListItem(child);

          if (child.children && child.children.length > 0) {
            this._buildChildren(child.children, listItemNode);
          }
        } else if (
          child.type === "ordered-list" ||
          child.type === "unordered-list"
        ) {
          const nestedListNode = (
            parentNode as ListItemBlockNode
          ).addNestedList(child);
          if (child.children && child.children.length > 0) {
            this._buildChildren(child.children, nestedListNode);
          }
        }
      } else {
        (parentNode as ListItemBlockNode).addInlineChild(child);
      }
    }
  }

  private _findblockTreeParent(nodeId: string): {
    result: boolean;
    block: ListBlock | TextBlock | null;
  } {
    // Define build function outside the loop
    const build = (node: ListBlock | ListItemBlock): boolean => {
      if ("id" in node && node.id === nodeId) {
        return true;
      }
      return false;
    };
    // Use for...of instead of forEach to allow proper returns
    for (const block of this.ast) {
      if (block.type === "ordered-list" || block.type === "unordered-list") {
        const rootOfBlockTree = block;
        const found = this._traverse(block, build);

        if (found) {
          return { result: true, block: rootOfBlockTree };
        }
      } else {
        if (block.id === nodeId) {
          return { result: true, block: block };
        }
      }
    }
    return { result: false, block: null };
  }

  private findBlockParent(blockId: string): string | null {
    let currentBlockParent: string | null = null;

    const build = (node: ListBlock | ListItemBlock): boolean => {
      if (
        isBlockElement(node) &&
        node.children.find((child) => hasId(child) && child.id === blockId)
      ) {
        currentBlockParent = node.id;
        return true;
      }
      return false;
    };

    for (const block of this.ast) {
      currentBlockParent = null; // Reset for each block

      if (block.type === "ordered-list" || block.type === "unordered-list") {
        const found = this._traverse(block, build);
        if (found) {
          return currentBlockParent;
        }
      }
    }

    return null;
  }
  

  private getPreviuoseVisionBlock(
    currentBlockId: string
  ): ListItemBlock | TextBlock | null {
    let previousBlock: ListItemBlock | TextBlock | null = null;
    const build = (node: ListBlock | ListItemBlock): boolean => {
      if (node.type === "list-item" && node.id !== currentBlockId) {
        previousBlock = node as ListItemBlock;
      }
      if ("id" in node && node.id === currentBlockId) {
        return true;
      }
      return false;
    };

    for (const block of this.ast) {
      if (block.type === "ordered-list" || block.type === "unordered-list") {
        const found = this._traverse(block, build);
        if (found) {
          return previousBlock;
        }
      } else {
        if (block.id === currentBlockId) {
          return previousBlock;
        }
        previousBlock = block as TextBlock;
      }
    }
    return null;
  }

  private getBlockById(
    currentBlockId: string
  ): ListBlock | ListItemBlock | TextBlock | null {
    let targetBlock: ListBlock | null = null;

    const build = (node: ListBlock | ListItemBlock): boolean => {
      if ("id" in node && node.id === currentBlockId) {
        targetBlock = node as ListBlock;
        return true;
      }
      return false;
    };
    for (const block of this.ast) {
      if (block.type === "ordered-list" || block.type === "unordered-list") {
        const found = this._traverse(block, build);
        if (found) {
          return targetBlock;
        }
      } else {
        if (block.id === currentBlockId) {
          return block as TextBlock;
        }
      }
    }
    return null;
  }

  private _findBlockByIdInTree(
    blockTree:ListBlock,
    currentBlockId: string
  ): ListBlock | ListItemBlock | TextBlock | null {
    let targetBlock: ListBlock | null = null;

    const build = (node: ListBlock | ListItemBlock): boolean => {
      if ("id" in node && node.id === currentBlockId) {
        targetBlock = node as ListBlock;
        return true;
      }
      return false;
    };

    const found = this._traverse(blockTree, build);
    if (found) {
      return targetBlock;
    }
    
    return null;
  }
  private getAllInlineContentINCurrentBlock(
    block: ListItemBlock | TextBlock
  ): InlineElement[] | null {
    if (block === null || block.id === undefined) return null;
    let content: InlineElement[] = [];
    block.children.forEach((element) => {
      if (isInlineElement(element)) content.push(element);
    });
    return content;
  }


  private _getChildrenBlockInBlock(block: ListItemBlock): ListItemBlock[] {
    const copyBlock = this._deepCopyBlock(block);
    let content: ListItemBlock[] = [];

    const filteredChildren = copyBlock.children.filter(
      (child): child is ListBlock => isBlockElement(child)
    );

    for (const child of filteredChildren) {
      content.push(...child.children.map((item) => ({ ...item })));
    }
    return content;
  }

  
  private creatCleanNewAst(
    ast: Ast,
    editInPreviousBlock: ListBlock | TextBlock  
  ): Ast {

    const copyAst=this._deepCopyAst(ast)
    const newAst = copyAst!.map((block) => {
      if (block.id === editInPreviousBlock!.id) {
        return Object.assign(block, editInPreviousBlock);
      }
      return block;
    });
    return newAst;
  }

  private _addBlockToAst(ast:Ast,block:TextBlock|ListBlock,index:number):Ast{
    const copyAst = this._deepCopyAst(ast);
    copyAst.splice(index+1,0,block)
    return copyAst
  }

   private _replaceBlockToAst(ast:Ast,block:TextBlock|ListBlock,index:number):Ast{
    console.log('index',index)
    const copyAst = this._deepCopyAst(ast);
    copyAst.splice(index,1,block)
    return copyAst
  }

  private cleanCurrentBlock(
    block: ListBlock,
    parentOfCurrentBlockId: string,
    currentblockid: string,
    updateBlock: ListItemBlock[]
  ): ListBlock | null {
    if (block === null) return null;
    const copyBlock = this._deepCopyBlock(block);
    const parentBlock = this.getBlockById(
      copyBlock,
      parentOfCurrentBlockId
    ) as ListBlock;
    const copyParentBlock = this._deepCopyBlock(parentBlock);

    const blockToRemoveIndex = copyParentBlock?.children.findIndex(
      (c) => hasId(c) && c.id === currentblockid
    );
    if (blockToRemoveIndex === -1) {
      console.error("Block to remove not found");
      return null;
    }
    copyParentBlock.children.splice(blockToRemoveIndex!, 1, ...updateBlock);
    return copyParentBlock;
  }

  private cleanTreeBlock(
    targetBlock: ListBlock | TextBlock | ListItemBlock
  ): ListBlock {
    const parentTreeBlock = this._findblockTreeParent(targetBlock.id).block;

    const copyTreeBlock = this._deepCopyBlock(parentTreeBlock!) as ListBlock;
    const build = (node: ListBlock | ListItemBlock): boolean => {
      if (node.id === targetBlock.id) {
        Object.assign(node, targetBlock);
        return true;
      }
      return false;
    };
    this._traverse(copyTreeBlock, build);
   
    return copyTreeBlock;
  }

  private _traverse(
    block: ListBlock | ListItemBlock,
    processEachNode: (node: ListBlock | ListItemBlock) => boolean
  ): boolean {
    return this._traverseNode(block, processEachNode);
  }

  private _traverseNode(
    node: ListBlock | ListItemBlock,
    processFunction: (node: ListBlock | ListItemBlock) => boolean
  ): boolean {
    // ← Same as callback(node), just different name
    if (processFunction(node)) {
      return true;
    }
    if ("id" in node) {
      for (const child of node.children) {
        const found = this._traverseNode(
          child as ListBlock | ListItemBlock,
          processFunction
        );
        if (found) {
          return true; // If found in any child, return immediately
        }
      }
    }
    return false;
  }
  private _movechilToPreviouseBlock(
    previousVisionBlock: ListItemBlock | TextBlock,
    content: InlineElement[]
  ): ListItemBlock | TextBlock {
    if (!previousVisionBlock) {
      throw new Error(
        "in _moveChildToPreviousBlock previousVisibleBlock is undefined or null"
      ); // Proper error
    }

    if (content?.length) {
      const currentChildren = previousVisionBlock.children || [];

      const firstBlockIndex = currentChildren.findIndex((child) =>
        hasId(child)
      );

      if (firstBlockIndex === -1) {
        previousVisionBlock.children = [...currentChildren, ...content];
      } else {
        previousVisionBlock.children = [
          ...currentChildren.slice(0, firstBlockIndex),
          ...content,
          ...currentChildren.slice(firstBlockIndex),
        ];
      }
    }
    return previousVisionBlock;
  }

  private _editPreviousBlock(
    block: ListBlock,
    prevousBlock: ListItemBlock
  ): ListBlock {
    console.log("_editPreviousBlock", prevousBlock);
    const copyBlock = this._deepCopyBlock(block);
    console.log("_editPreviousBlock", copyBlock);
    const parentBlockid = this.findBlockParent(this.ast, prevousBlock.id);
    const parentBlock = this.getBlockById(copyBlock, parentBlockid!);
    const index = parentBlock?.children.findIndex(
      (child) => hasId(child) && child.id === prevousBlock.id
    );
    const build = (node: ListBlock | ListItemBlock): boolean => {
      if (node.id === parentBlockid) {
        node?.children.splice(index!, 1, prevousBlock!);
        return true;
      }
      return false;
    };
    this._traverse(copyBlock, build);
    return copyBlock;
  }

  private _handleCurrentBlockAfterRemoveContent(
    currentBlock: ListItemBlock
  ): ListItemBlock[] {
    let childOFCurrentBlock: ListItemBlock[] = [];
    if (hasBlockChild(currentBlock!)) {
      for (const child of currentBlock!.children) {
        if ("children" in child && Array.isArray(child.children)) {
          const listItemChildren = child.children.filter(
            (item): item is ListItemBlock =>
              "type" in item && item.type === "list-item" // or whatever identifies ListItemBlock
          );
          childOFCurrentBlock.push(...listItemChildren);
        }
      }
    } else return [];
    const editCurrentBlock: ListItemBlock[] = [...childOFCurrentBlock!];
    return editCurrentBlock;
  }

  private _deepCopyAst(ast: Ast): Ast {
    const copy = ast.map((block) => {
      if (block.type !== "ordered-list" && block.type !== "unordered-list") {
        return { ...block };
      }
      return this._deepCopyBlock(block);
    });
    return copy as Ast;
  }
  private _deepCopyBlock(
    block: TextBlock | ListBlock | ListItemBlock
  ): ListBlock | ListItemBlock | TextBlock {
    return JSON.parse(JSON.stringify(block));
  }
}
