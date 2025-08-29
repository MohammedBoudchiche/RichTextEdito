import type { ListBlock, InlineElement, TextBlock, ListItemBlock } from "./ast";

// Type guards
export function isInlineElement(node: any): node is InlineElement {
  return typeof node === 'object' && 
         'text' in node && 
         'formats' in node 
}

export default function isBlockElement(node: any): node is ListBlock | TextBlock| ListItemBlock {
  return typeof node === 'object' &&
         'id' in node &&
         'type' in node &&
         'children' in node;
}
export function isBlockElementCheck(element: ListBlock|InlineElement|ListItemBlock|TextBlock): boolean {
    if (!(element instanceof HTMLElement)) {
        return false;
    }
    const blockTags = ['P', 'DIV', 'LI', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    return blockTags.includes(element.tagName) || element.hasAttribute('data-id');
}