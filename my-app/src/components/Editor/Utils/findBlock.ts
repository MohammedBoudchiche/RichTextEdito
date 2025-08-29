import type { Ast, ListBlock, ListItemBlock, TextBlock } from "./ast";
import type { BlockResult, BlockTypes, PreviosBlockResult } from "./interfaces";

export function findBlockByID(ast:Ast,blockid:string):BlockResult|null{

    let priviosBlock: TextBlock | ListBlock | ListItemBlock | null = null;
    
    for(const currentBlock of ast){
        if(currentBlock.id===blockid){
            return null
        }
        priviosBlock= currentBlock

        switch (currentBlock.type){
            case 'paragraph':
            case 'heading':
                const result = findBlock(currentBlock,blockid)
                if(result.found){
                    return result
                }                
                break;

            case 'unordered-list':
            case 'ordered-list':
                // These blocks contain list items, so we can go deeper
                currentBlock.children.forEach((listItem)=>{
                    if(listItem.id===blockid){                        
                        return currentBlock
                    }
                    priviosBlock= listItem
                    if(currentBlock.children.length>0){
                        const result = findBlock(currentBlock,blockid)
                        if(result.found){
                            return result
                        }                            
                    }
                    // We don't go deeper into list items because they contain inline elements
                })
                break;    
        }
    }
    return null
}

function findBlock(list:ListBlock|ListItemBlock|TextBlock,blockID:string):BlockResult{
    for(const item of list.children){
        if('id'in item && item.id === blockID){
            return {found: true, currentBlock: item, type: item.type }
        }

        if('id' in item && item.children && item.children.length > 0){
            const result = findBlock(item as BlockTypes, blockID)
            if(result.found){
                return result
            }
        }        

    }
    return {found: false, currentBlock: null, type: '' }
}

