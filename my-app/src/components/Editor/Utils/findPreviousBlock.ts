/*import type { ListBlock, ListItemBlock, TextBlock } from "./ast";
import type { BlockTextList, BlockTypes, PreviosBlockResult } from "./interfaces";

export function findPreviousBlock(arrOrBlock:Array<BlockTypes>|BlockTypes, 
    blockid:string, prevBlock:BlockTextList|null=null):PreviosBlockResult|null{
    const children = Array.isArray(arrOrBlock)? arrOrBlock:arrOrBlock.children

    let lastVisibleBlock: BlockTextList | null = prevBlock;
    console.log('Top function Previous: ',lastVisibleBlock)
    for(const currentBlock of children) {          
        if('id' in currentBlock){
            console.log('block id',currentBlock.id)
            console.log("last Visible Block", lastVisibleBlock);
            if(currentBlock.id === blockid){                
                if(lastVisibleBlock===null)
                {
                    console.log('last visible reqched is is:',lastVisibleBlock)
                    return {found:false,previousBlock:lastVisibleBlock,type:''}
                }
                return {found:true,previousBlock:lastVisibleBlock,type:currentBlock.type}
            }
            if((currentBlock.type !=='paragraph' && currentBlock.type !== 'heading') && currentBlock.children.length>0){
                const result = findPreviousBlock(currentBlock,blockid, lastVisibleBlock as BlockTextList)
                console.log('current Block after is: ',result?.previousBlock)
                console.log('current Block after is found?: ',result?.found)
                if(result?.found){
                    return result
                }
                console.log('result.previousBlock: ',result?.previousBlock)
                lastVisibleBlock = result?.previousBlock as ListItemBlock | TextBlock;                
            }            
            lastVisibleBlock = currentBlock as ListItemBlock | TextBlock;            
        }                    
    }
        console.log('the block return will be ',lastVisibleBlock)
    return { found: false, previousBlock: lastVisibleBlock, type: '' };
}

export function lastChildInBlock(block:BlockTypes):ListItemBlock|null{
    const lastindexObj = block.children.length-1
    let lastObj = block.children[lastindexObj]

    if('id' in lastObj){
        if(lastObj.children.length>0){
            const result =lastChildInBlock(lastObj)
            if(result !== null){
                lastObj = result
            }
        }
    }
    return lastObj as ListItemBlock
}*/

import type { ListItemBlock, TextBlock } from "./ast";
import type { BlockTypes } from "./interfaces";




export function findPreviousBlock(
    nodes: BlockTypes[],
    targetId:string,
):BlockTypes|null {
    let lastVisionBlock: BlockTypes |null=null
    const stack =[...nodes]    
    console.log('id:    ',targetId)
    while(stack.length >0){
        const currentBlock = stack.shift()
        
        if('id' in currentBlock!){
                      if (currentBlock.id === targetId) {
                        console.log('What is the current block bbefor return: ',lastVisionBlock)
                        return lastVisionBlock;
                      }
        }
        if (currentBlock?.type !== 'unordered-list' && currentBlock?.type!=='ordered-list'){
            if('id'in currentBlock!) lastVisionBlock=currentBlock
        }
        
        if('children' in currentBlock! && currentBlock.children.length>0) {
            stack.unshift(...(currentBlock.children as BlockTypes[]))
        }
    }
    return null

}

export function findLastChild(block:BlockTypes):ListItemBlock|TextBlock|null{
    if(!block || !block.children || block.children.length===0){
        return null
    }

    const lastChild = block.children[block.children.length - 1]

    if('children' in lastChild && lastChild.children.length > 0){
        return findLastChild(lastChild as BlockTypes)
    }

    return lastChild as ListItemBlock|TextBlock

}