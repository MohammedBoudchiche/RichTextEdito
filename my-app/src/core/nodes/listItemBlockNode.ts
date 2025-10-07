import type { InlineElement, ListBlock, ListItemBlock } from "../ast";
import { BaseNode } from "../baseNode";
import { ListBlockNode } from "./listBlockNode";

export class ListItemBlockNode extends BaseNode {
  public children: (InlineElement | ListBlockNode)[] = [];

  constructor(node: ListItemBlock) {
    super(node);
  }

  addNestedList(child: ListBlock): ListBlockNode {
    const newChild = new ListBlockNode(child);
    this.children.push(newChild);
    return newChild;
  }

  addInlineChild(node: InlineElement) {
    this.children.push(node);
  }
}
