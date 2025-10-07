import type { ListBlock, ListItemBlock } from "../ast";
import { BaseNode } from "../baseNode";
import { ListItemBlockNode } from "./listItemBlockNode";

export class ListBlockNode extends BaseNode {
  public children: ListItemBlockNode[] = [];

  constructor(node: ListBlock) {
    super(node);
  }

  addListItem(child: ListItemBlock): ListItemBlockNode {
    const newChild = new ListItemBlockNode(child);
    this.children.push(newChild);
    return newChild;
  }
}
