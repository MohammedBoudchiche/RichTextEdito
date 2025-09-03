import { useEffect, useState } from 'react'
import Renderer from './Renderer'
import { initialAST, type Ast } from './Utils/ast'
import inputHandler from './Utils/inputHandler'
import { toggleFormat } from './Utils/formatting'
import Toolbar from '../Toolbar/Toolbar'
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { getTextSelection } from './Utils/selection'
import parseDomToAst from './Utils/parse'


export default function Editor() {
  const [ast, setAst] = useState<Ast>(initialAST)

  function handleFormatClick(event: ChangeEvent<HTMLInputElement> | 
    KeyboardEvent<HTMLInputElement> | 
    MouseEvent<HTMLInputElement>){
      const clickType = inputHandler(event)
      if(clickType === '') return

      if(clickType ==='input'){
          {
          setTimeout(() => {
            
                const selection = getTextSelection()
                  const range = selection?.range                  
                  console.log(parseDomToAst())
          }, 0)   
        }
      } 
      else if (clickType === "Backspace") {
        event.preventDefault();
        setTimeout(() => {
          const selection = getTextSelection();
          const range = selection?.range;
            const toggleFormatResult = toggleFormat(ast, clickType, selection!,range!);
            if (toggleFormatResult) {
              setAst(toggleFormatResult);
            }
        }, 0);
      }        
  }      

  return (
    <>
    <Toolbar handleFormatClick={handleFormatClick}/>
    <div
        className='w-full min-h-100 bg-white text-black text-start p-7 '
        contentEditable={true}
        onInput={handleFormatClick}
        onKeyDown={handleFormatClick}
        onClick={handleFormatClick}
    >
      <Renderer ast={ast}/>
    </div>
    </>
  )
}
