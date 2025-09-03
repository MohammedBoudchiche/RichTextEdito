import type { Ast, TextBlock } from "./ast";
import  createTimeBaseID  from "./newID";
import { findParentBlockElementID } from "./workWithNode";
import { getTextSelection, type TextSelection } from "./selection";
import parseDomToAst from "./parse";
import { findAndModifyBlock, findBlockByID } from "./findBlock";
import { removeCharacterFromObj } from "./workWithAstObj";

export function toggleFormat(ast: Ast, type: string, selection: TextSelection,range:Range): Ast {
  function handlethis(): Ast {
    let newobject: Ast | null;
    if (type === "Enter") {
      const newA = handleAddNewBlock();
      if (newA === null) return ast;
      return hanldeAstObject(ast, newA);
    } else if (type === "Tab") {
      console.log("tab pressed");
      return ast;
    } else if (type === "Backspace") {
      if(range?.startOffset===0){
        newobject = handleBackSpaceIndexZero(ast, selection);
        if (newobject === null) return ast;
        return newobject;        
      }
      else {
        newobject = handleBackSpaceIndexgreaterThanZero(ast, selection);
        if (newobject === null) return ast;
        return newobject; 
      }

    } else if (type === "input") {
      console.log("input event");
      handleInputChange();
    }
    return ast;
  }
  return handlethis();
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

  function handleBackSpaceIndexZero(ast: Ast, selection: TextSelection): Ast | null {
   
  }

export function handleBackSpaceIndexgreaterThanZero(ast: Ast, selection: TextSelection): Ast | null{

   const blockid = findParentBlockElementID(selection);
   if (blockid === null) return null;
  
   const currentBlock = findBlockByID(ast, blockid);
 
  const obj=  removeCharacterFromObj(currentBlock!,selection)

  const newAst = findAndModifyBlock(ast, blockid, obj);
  return newAst


}

  function hanldeAstObject(ast:Ast,newObject:any):Ast{
    const newAst = ast.map((block)=> {
      return {
        ...block,
      }
    })
    newAst.push(newObject)
    return newAst
  }

function handleInputChange(){
  console.log('handle input change')
  parseDomToAst()

  const selection = getTextSelection()
  console.log('selection is',selection)
}