import type { BlockResult, BlockTypes } from "./interfaces";

export function findBlockByID(arrOrBlock:Array<BlockTypes>|BlockTypes,blockid:string):BlockResult|null{


    const children = Array.isArray(arrOrBlock)? arrOrBlock : arrOrBlock.children
    for(const currentBlock of children){
        if('id' in currentBlock){
            if(currentBlock.id===blockid){
                return {found:true, currentBlock:currentBlock, type:currentBlock.type}
            }
        
            if((currentBlock.type !=='paragraph' && currentBlock.type !== 'heading') && currentBlock.children.length>0){
                const result = findBlockByID(currentBlock,blockid)
                if(result?.found){
                    return {found:true, currentBlock:currentBlock, type:currentBlock.type}
                }
            }
        }
    
    }
    return {found:false, currentBlock:null, type:''}
}