import type { InlineElement, ListBlock, ListItemBlock, TextBlock } from "./ast";
import type { ListBlockNode } from "./nodes/listBlockNode";
import type { ListItemBlockNode } from "./nodes/listItemBlockNode";
import type { TextBlockNode } from "./nodes/textBlockNode";

export type SearchResult = {
  found: boolean ;    // The answer if target was found
  lastId: string | null;   // The last ID processed (for state tracking)
  type?: string
};

export type SearchBlockResult = {
  found: boolean ;    // The answer if target was found 
  returnedBlock: TextBlock | ListBlock | ListItemBlock|null; // The found block, if any
};

export type PreviosBlockResult = {
  found: boolean
  previousBlock:  ListBlock | ListItemBlock | TextBlock |null
  type: string
}

export type BlockResult = {
  found: boolean
  currentBlock:  ListBlock | ListItemBlock | TextBlock |null
  type: string
}

export type BlockTypes = TextBlock | ListBlock | ListItemBlock
export type BlockTextList = TextBlock | ListItemBlock


export interface PreviousIsBlock {
  id:boolean
  block:ListBlock|TextBlock
}

export interface PreviousIsInline {
  found: boolean
  inline: InlineElement
  parentBlockId:string
}

export interface CursorPosition {
  node: Node | null;
  offset: number;
}

export interface isPreviousBlockListBlock {
  isListBlock: boolean;
  blockid?: string;
}

export interface idsTaypes {
  id:string,
  type:string
}

export type ChildBlock = ListBlock | ListItemBlock | InlineElement;
export type RenderableNode = TextBlockNode | ListBlockNode | ListItemBlockNode;
