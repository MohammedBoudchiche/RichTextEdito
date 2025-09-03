
import type { Ast, InlineElement, ListBlock, ListItemBlock, TextBlock } from "./ast";
import { getTextSelection } from "./selection";

export default function parseDomToAst(): Ast {
    const parentNode = getParentContenteditableDivNode();
    if (!parentNode) return [];

    const ast: Ast = [];
    parentNode.childNodes.forEach((childNode) => {
        if (childNode.nodeType === Node.ELEMENT_NODE) {
            const element = childNode as HTMLElement;
            const blockId = element.getAttribute('data-id');
            const blockType = element.getAttribute('data-type');

            if (!blockId) return;

            if (blockType === 'paragraph' || blockType === 'heading') {
                const textBlock: TextBlock = {
                    id: blockId,
                    type: blockType as 'paragraph' | 'heading',
                    children: parseInlineChildren(element.childNodes)
                };
                ast.push(textBlock);
            } else if (blockType === 'unordered-list' || blockType === 'ordered-list') {
                ast.push(parseListBlock(element, blockId, blockType));
            }
        }
    });
    return ast;
}

// Handles a list container (UL or OL)
function parseListBlock(node: HTMLElement, id: string, type: string): ListBlock {
    const listBlock: ListBlock = {
        id: id,
        type: type as 'unordered-list' | 'ordered-list',
        children: []
    };

    node.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
            const listItemElement = child as HTMLElement;
            if (listItemElement.tagName === 'LI') {
                const listItemId = listItemElement.getAttribute('data-id');
                if (listItemId) {
                    listBlock.children.push(parseListItemBlock(listItemElement, listItemId));
                }
            }
        }
    });

    return listBlock;
}

// Handles a list item (LI)
function parseListItemBlock(node: HTMLElement, id: string): ListItemBlock {
    const listItemBlock: ListItemBlock = {
        id: id,
        type: 'list-item',
        children: []
    };

    node.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as HTMLElement;

            if (element.tagName === 'UL' || element.tagName === 'OL') {
                const nestedListId = element.getAttribute('data-id') || '';
                const nestedListType = element.getAttribute('data-type') || '';
                if (nestedListId && nestedListType) {
                    listItemBlock.children.push(parseListBlock(element, nestedListId, nestedListType));
                }
            } else {
                // Handle complex inline structures within the LI
                const inlineChildren = parseInlineChildren(element.childNodes);
                listItemBlock.children.push(...inlineChildren);
            }
        } else if (child.nodeType === Node.TEXT_NODE) {
            // Handle plain text nodes within the LI
            const inlineChildren = parseInlineChildren([child]);
            listItemBlock.children.push(...inlineChildren);
        }
    });
    return listItemBlock;
}

// Parses a NodeList into an array of InlineElement objects
// This is the most crucial part and needs to be robustly recursive
function parseInlineChildren(nodeList: NodeListOf<ChildNode>): InlineElement[] {
    const inlineElements: InlineElement[] = [];

    nodeList.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            const parentElement = child.parentElement;
            if (parentElement) {
                inlineElements.push(createInlineElementWithFormats(child.textContent || '', parentElement));
            }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as HTMLElement;
            // Recursively process children of inline elements (e.g., <b><i>text</i></b>)
            const childrenFormats = parseInlineChildren(element.childNodes);
            inlineElements.push(...childrenFormats);
        }
    });
   
    return inlineElements;
}

// Creates a single InlineElement and finds all formats from its parent chain
function createInlineElementWithFormats(text: string, element: HTMLElement): InlineElement {
    const allFormats: string[] = [];
    let currentElement: HTMLElement | null = element;

    while (currentElement && currentElement.hasAttribute('data-id') === false) {
        switch (currentElement.tagName) {
            case 'STRONG':
            case 'B':
                allFormats.push('bold');
                break;
            case 'EM':
            case 'I':
                allFormats.push('italic');
                break;
            case 'U':
                allFormats.push('underline');
                break;
            case 'STRIKE':
            case 'DEL':
                allFormats.push('strikethrough');
                break;
            case 'CODE':
                allFormats.push('code');
                break;
            case 'SPAN':
                if (currentElement.style.color) {
                    allFormats.push(`color:${currentElement.style.color}`);
                }
                break;
        }
        currentElement = currentElement.parentElement;
    }

    return {
        text: text,
        formats: [...new Set(allFormats)] // Use a Set to remove duplicate formats
    };
}
export function getParentContenteditableDivNode() {
    const selection = getTextSelection();
    if (!selection) return null;
    
    let result = selection.node?.parentNode;
    
    while (result) {
        
        // Check if this is the contenteditable div
        if (result instanceof Element && result.hasAttribute('contenteditable') && 
            result.getAttribute('contenteditable') === 'true') {
            break;
        }
        
        // Move to parent if it exists
        if (result.parentNode) {
            result = result.parentNode;
        } else {
            break;
        }
    }
    
    return result;
}
