import type { TextSelection } from "../components/Editor/Utils/selection";
import type { InlineElement, ListItemBlock, TextBlock } from "../core/ast";
import { isInlineElement } from "../utils/typeGuards";

export class NodesManager {
  public removeCharFromNode(
    node: ListItemBlock | TextBlock,
    selection: TextSelection
  ) :TextBlock|ListItemBlock{
    const count = this._nodeLength(node);
    const fucusCount = selection.focusoffset;
    const sumOfChar = this.__nodePreviousSibling(selection.anchorNode!);
    const CharPosition = count - (count - (sumOfChar + fucusCount));
    const updateNode = this._removeCharByIndex(node, CharPosition-1);

    const copyUpdateNode = JSON.parse(JSON.stringify(updateNode));
    const copyNode=JSON.parse(JSON.stringify(node));
    copyNode.children[copyUpdateNode!.index] = copyUpdateNode!.element;
    return copyNode
    
  }

  private _nodeLength(node: ListItemBlock | TextBlock): number {
    let length: number = 0;
    node.children.map((child) => {
      if (isInlineElement(child)) {
        length += child.text.length;
      }
    });
    return length;
  }

  private _removeCharByIndex(
    node: ListItemBlock | TextBlock,
    count: number
  ): { index: number; element:InlineElement} | null {
    // Input validation
    if (!node?.children || count < 0) {
      return null;
    }

    let globalIndex = -1;

    for (let childIndex = 0; childIndex < node.children.length; childIndex++) {
      const child = node.children[childIndex];

      if (!isInlineElement(child) || !child.text) {
        continue;
      }

      const childTextLength = child.text.length;

      // Check if our target count falls within this child's text range
      if (count <= globalIndex + childTextLength) {
        const localIndex = count - (globalIndex + 1);

        if (localIndex >= 0 && localIndex < childTextLength) {
            const copyChild = JSON.parse(JSON.stringify(child));
          const newText = this._deleteChar(copyChild.text, localIndex);
          const result: InlineElement = {
            ...copyChild, // copy all existing properties
            text: newText, // update the text property
          };
          return { index: childIndex,element:result};
        }
      }

      globalIndex += childTextLength;
    }

    // Count exceeds total text length
    return null;
  }

  // Helper method for character deletion
  private _deleteChar(str: string, index: number): string {
    if (!str || index < 0 || index >= str.length) {
      return str;
    }
    return str.slice(0, index) + str.slice(index + 1);
  }

  private __nodePreviousSibling(node: Node): number {
    let count: number = 0;
    let word: ParentNode | ChildNode | null = node?.parentNode;
    while (word) {
      const result = word.previousSibling?.textContent?.length;
      count += result ? result : 0;
      word = word.previousSibling;
    }
    return count;
  }
}