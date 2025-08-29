import type { ListItemBlock, TextBlock } from "./ast";
import type { BlockTextList, BlockTypes, PreviosBlockResult } from "./interfaces";

export function findPreviousBlock(arrOrBlock:Array<BlockTypes>|BlockTypes, 
    blockid:string, prevBlock:BlockTextList|null=null):PreviosBlockResult|null{
    const children = Array.isArray(arrOrBlock)? arrOrBlock:arrOrBlock.children

        console.log('as block', prevBlock?.type)
    let lastVisibleBlock: BlockTextList | null = prevBlock;
        console.log('lastVisibleBlock', lastVisibleBlock?.type)

    for(const currentBlock of children) {  
        if('id' in currentBlock){
            console.log('#1: current block type', currentBlock.type, currentBlock.id)
            if(currentBlock.id === blockid){
                
                if(lastVisibleBlock===null)
                {
                    return null
                }
                
                return {found:true,previousBlock:lastVisibleBlock,type:currentBlock.type}
            }

            if((currentBlock.type !=='paragraph' && currentBlock.type !== 'heading') && currentBlock.children.length>0){
                const result = findPreviousBlock(currentBlock,blockid, lastVisibleBlock as BlockTextList)
                if(result!==null && result.found){
                    return result
                }
            }
            if (currentBlock.type !== 'ordered-list' && currentBlock.type !== 'unordered-list') {
                lastVisibleBlock = currentBlock as ListItemBlock|TextBlock;
            }           
        }                 
                  
    }
      return { found: false, previousBlock: null, type: '' };
}

