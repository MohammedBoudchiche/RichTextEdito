import type { ListBlock, ListItemBlock, TextBlock } from "./ast";

type BlockNode = TextBlock | ListBlock | ListItemBlock;

export abstract class BaseNode {
  public id: string;
  public type: string;

  constructor(node: BlockNode) {
    this.type = node.type;
    this.id = node.id;
  }
}
