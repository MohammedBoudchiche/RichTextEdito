/*import type { Ast, InlineElement, ListBlock, ListItemBlock, TextBlock } from "./ast";
import { getTextSelection } from "./selection";


export default function parseDomToAst(){
    const parentNode=getParentContenteditableDivNode()
    if(!parentNode) return []

    const ast:Ast = []
    parentNode.childNodes.forEach((childNode)=>{
        console.log('child node is',childNode)
        if(childNode.nodeType === Node.ELEMENT_NODE){
            const element = childNode as HTMLElement
            
               console.log('element is',element)
               const blockId = element.getAttribute('data-id')
               if(!blockId) return
               console.log('blockId is',blockId)
               const blockType = element.getAttribute('data-type')
               console.log('blockType is',blockType)

            if(blockType === 'paragraph' || blockType === 'heading'){
                    console.log('it is a text block')
                    const textBlock:TextBlock = {
                        id: blockId ,
                        type: blockType as 'paragraph' | 'heading',
                        children: []
                    }
                if(element.childNodes.length >0){
                    element.childNodes.forEach((child)=>{                        
                        textBlock.children.push(handleInlineNode(child))
                    })
                }
                ast.push(textBlock)
            }
            else if(blockType === 'unordered-list' || blockType === 'ordered-list'){
               ast.push(handleListChildNodes(childNode,blockId,blockType)!)
            
            }
        }
    })
    console.log('parsed AST is here',ast)
}
function handleInlineNode(child: Node): InlineElement {
    if (child.nodeType === Node.TEXT_NODE) {
        // Check the parent element for formatting
        let parentElement = child.parentElement;
        let allFormats: string[] = [];
        
        while (parentElement && !parentElement?.hasAttribute('data-id')) {
            switch (parentElement?.tagName) {
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
                case 'SPAN':
                    if (parentElement.style.color) {
                        allFormats.push(`color:${parentElement.style.color}`);
                    }
                    break;
                // Add more format checks as needed
                case 'STRIKE':
                case 'DEL':
                    allFormats.push('strikethrough');
                    break;
                case 'CODE':
                    allFormats.push('code');
                    break;
            }
            parentElement = parentElement.parentElement;
        }
        
        return {
            text: child.textContent || '',
            formats: allFormats
        };
    }

    // Handle non-text nodes (elements) by recursively processing their children
    // or return a default InlineElement for element nodes
    return {
        text: '',
        formats: []
    };
}
function handleInlineNode(child: Node): InlineElement {
    if (child.nodeType === Node.TEXT_NODE) {
        // Check the parent element for formatting
        let parentElement = child.parentElement;
        let allFormats: string[] = [];
        
        while (parentElement && !parentElement?.hasAttribute('data-id')) {
            switch (parentElement?.tagName) {
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
                case 'SPAN':
                    if (parentElement.style.color) {
                        allFormats.push(`color:${parentElement.style.color}`);
                    }
                    break;
                case 'STRIKE':
                case 'DEL':
                    allFormats.push('strikethrough');
                    break;
                case 'CODE':
                    allFormats.push('code');
                    break;
            }
            parentElement = parentElement.parentElement;
        }
        
        return {
            text: child.textContent || '',
            formats: allFormats
        };
    }
    else if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        
        // Handle element nodes by recursively processing their text content
        let textContent = '';
        let formats: string[] = [];
        
        // First, check the current element for formatting
        switch (element.tagName) {
            case 'STRONG':
            case 'B':
                formats.push('bold');
                break;
            case 'EM':
            case 'I':
                formats.push('italic');
                break;
            case 'U':
                formats.push('underline');
                break;
            case 'SPAN':
                if (element.style.color) {
                    formats.push(`color:${element.style.color}`);
                }
                break;
            case 'STRIKE':
            case 'DEL':
                formats.push('strikethrough');
                break;
            case 'CODE':
                formats.push('code');
                break;
        }
        
        // Then recursively process child nodes
        element.childNodes.forEach((grandChild) => {
            const inlineElement = handleInlineNode(grandChild);
            textContent += inlineElement.text;
            // Combine formats from child nodes
            formats = [...formats, ...inlineElement.formats];
        });
        
        return {
            text: textContent,
            formats: formats
        };
    }

    return {
        text: '',
        formats: []
    };
}
function handleListChildNodes(node:Node,blockId:string,blockType:string):ListBlock{

    const element = node as HTMLElement
      const listBlock:ListBlock = {
            id: blockId ,
            type: blockType as 'unordered-list' | 'ordered-list',
            children: []                
        }
        if(element.childNodes.length >0){
            element.childNodes.forEach((child)=> {
                if(child.nodeType === Node.ELEMENT_NODE){
                    const listItemElement = child as HTMLElement
                    if(listItemElement.tagName === 'LI'){
                        const listItemId = listItemElement.getAttribute('data-id')
                        if(listItemId){
                            listBlock.children.push(handleListItemChildNodes(child,listItemId))
                        }
                    }
                    }
                })
            }
    return listBlock
}
function handleListItemChildNodes(node : Node,listItemId:string):ListItemBlock {

    const listItemBlock:ListItemBlock = {
        id: listItemId,
        type: 'list-item',
        children: []
    }
    
        node.childNodes.forEach((child)=>{
            if(child.nodeType === Node.TEXT_NODE){
                listItemBlock.children.push(handleInlineNode(child))
            }
            else if(child.nodeType === Node.ELEMENT_NODE){
                const element = child as HTMLElement
                const blockId = element.getAttribute('data-id')
               const blockType = element.getAttribute('data-type')
               console.log('blockId is',blockId)
                if(element.tagName === 'UL' || element.tagName === 'OL'){
                    const nestedListBlock = handleListChildNodes(child,blockId!,blockType!)
                    if(nestedListBlock){
                        listItemBlock.children.push(nestedListBlock)
                    }
                }
                else{
                    listItemBlock.children.push(handleInlineNode(child))
                }
            }
        })
        return listItemBlock
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
}*/

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