import type { InlineElement, TextBlock } from "../ast";
import { BaseNode } from "../baseNode";

export class TextBlockNode extends BaseNode {
  public children: InlineElement[];
  constructor(node: TextBlock) {
    super(node);
    this.children = node.children;
  }
  addInlineChild(node: InlineElement) {
    this.children.push(node);
  }
}
