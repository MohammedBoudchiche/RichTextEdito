import type { InlineElement, ListBlock, ListItemBlock, TextBlock } from "./ast";

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