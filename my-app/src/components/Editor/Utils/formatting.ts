import type { Ast, ListBlock, ListItemBlock, TextBlock } from "./ast";
import  createTimeBaseID  from "./newID";
import { findParentBlockElement } from "./lengthCounter";
import { getTextSelection } from "./selection";
import parseDomToAst from "./parse";
import { findPreviousBlock } from "./findPreviousBlock";
import { findBlockByID } from "./findBlock";

interface Props {
    ast:Ast
    selection:Selection
    format:string
}

export function toggleFormat(ast:Ast ,type:string):Ast{
  function handlethis():Ast{
    let newobject:Ast|null
    if(type === 'Enter')
    {
      const newA = handleAddNewBlock()   
      if(newA === null) return ast    
       return hanldeAstObject(ast,newA)
    }

    else if (type === 'Tab'){
      console.log('tab pressed')
      return ast
    }
    else if(type=== 'Backspace')
    {
      newobject =handleRemoveBlock(ast)
      if(newobject === null) return ast
       return newobject

    }
    else if(type === 'input'){
      console.log('input event')
      handleInputChange()
    }
    return ast
  }
    return handlethis()
}

  function handleAddNewBlock():TextBlock{
    return {
        id:createTimeBaseID(),
        type:'paragraph',
        children: [
            {
                text:'',
                formats:[]
            },
        ],
    }
  }

  function handleRemoveBlock(ast:Ast):Ast|null{
    const blockid  = findParentBlockElement()
    console.log('block id is',blockid)
    if(blockid === null)return null

    const previousblock =findPreviousBlock(ast,blockid)
    console.log('previous block is',previousblock?.previousBlock)

    if(previousblock?.found=== false)return null
    const currentBlock = findBlockByID(ast, blockid)

    if(currentBlock?.found=== null) {
      console.log('current block is null')
      return null
    }
    if(currentBlock.returnedBlock?.type=== prvBlock.returnedBlock?.type)
    {
            console.log('current block type is equal')

          const result =hanldeObjectIndexZeroRemove(ast,currentBlock.returnedBlock!,prvBlock.returnedBlock!)
          return result
    }

    if(currentBlock?.returnedBlock?.type!== previosBlock?.type){
            console.log('current block type is not equal')

    }
    const lastchildIndex = previosBlock?.children.length
    const lastChild = previosBlock?.children[lastchildIndex!-1]

    return ast
  }



  function hanldeAstObject(ast:Ast,newObject:BlockElement):Ast{
    const newAst = ast.map((block)=> {
      return {
        ...block,
      }
    })
    newAst.push(newObject)
    return newAst
  }

  function hanldeObjectIndexZeroRemove(ast:Ast,currentBlock:TextBlock|ListBlock|ListItemBlock,prvBlock:TextBlock|ListBlock|ListItemBlock):Ast|null{
    console.log('============================================')
    
    priviosBlock(ast,currentBlock.id)
    
   
    
    const result= currentBlock.children.shift()
    
    
    let newText 
    if('text' in prvBlock.children[0] && 'text' in currentBlock.children[0]){
      newText= prvBlock.children[0].text + currentBlock.children[0].text
    }
    
    else if('id' in prvBlock.children[0] && !('id' in currentBlock.children[0])){
      const {...newText}= prvBlock.children[0]
      const newchild = [newText,...currentBlock.children]
    }
    else{
      return null
    }
    const newObj= {
      id:prvBlock.id,
      type:prvBlock.type,
      children: [
        {
          newText
        }
      ]
    }
    return fillAstWithNewObject(ast,currentBlock.id,newObj)
  }
function fillAstWithNewObject(ast: any[], targetId: string, newObject: any): Ast {
    const result :Ast = [];

  for (const item of ast) {
    // If this is the target item, replace it
   
    if (item.id === targetId) { 
      continue
    }
     if (item.id === newObject.id) {
      result.push(newObject)
    }
    // If this item has children, recurse into them
    else if (item.children && Array.isArray(item.children)) {
      const newChildren = fillAstWithNewObject(item.children, targetId, newObject);
      if (newChildren.length > 0) {
        result.push({
          ...item,
          children: newChildren
        });
      }
    }
     else {
      // Keep unchanged item
      result.push(item);
    }
  }
    return result;

}

function handleInputChange(){
  console.log('handle input change')
  parseDomToAst()

  const selection = getTextSelection()
  console.log('selection is',selection)
}