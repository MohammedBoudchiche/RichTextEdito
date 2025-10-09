import { useLayoutEffect, useRef, useState } from 'react'
import Renderer from './Renderer'
import inputHandler from './Utils/inputHandler'
import { toggleFormat } from './Utils/formatting'
import Toolbar from '../Toolbar/Toolbar'
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { getTextSelection, type TextSelection } from './Utils/selection'
import parseDomToAst from './Utils/parse'
import {  findPreviousPosition, findPreviousTextNode, findTextNode } from './Utils/workWithNode'
import { initialAST, type Ast } from '../../core/ast';
import type { CursorPosition } from '../../core/types';

export default function Editor() {
  const [ast, setAst] = useState<Ast>(initialAST)
  const cursor = useRef<CursorPosition| null>(null);

  function handleFormatClick(event: ChangeEvent<HTMLInputElement> | 
    KeyboardEvent<HTMLInputElement> | 
    MouseEvent<HTMLInputElement>){

      const clickType = inputHandler(event)
      if(clickType === '') return

      if(clickType ==='input'){
          event.preventDefault()
          setTimeout(() => {            
            const selection = getTextSelection()
          if (selection === null) return null;
              const range = selection?.range       
              const toggleFormatResult = toggleFormat(ast, clickType, selection!,range!);
              cursor.current = {node: selection.anchorNode,offset: selection.anchorOffset}
            setAst(toggleFormatResult)
          }, 0)           
      }
      else if (clickType === "Backspace") {
               
        event.preventDefault();
        setTimeout(() => {
          const selection = getTextSelection();
          if(selection===null)return null
          const range = selection?.range;
         
        
          const toggleFormatResult = toggleFormat(ast, clickType, selection!,range!);
          const newAst = JSON.parse(JSON.stringify(toggleFormatResult));
          if (selection.anchorOffset === 0) {
            handleBackspaceAtStart(selection);
          } else
            cursor.current = {
              node: selection.anchorNode,
              offset: selection.anchorOffset - 1,
            };

          setAst(newAst);
            
        }, 0);
      } 
      else if (clickType === "Enter") {
        console.log('enter')
        event.preventDefault();
        setTimeout(() => {
          const selection = getTextSelection();
          if (selection === null) return null;
          const range = selection?.range;
          const toggleFormatResult = toggleFormat(ast, clickType, selection!,range!);
          console.log("toggleFormatResult", toggleFormatResult);
          setAst(toggleFormatResult)
        }, 0);      
      } 
      else if (clickType === "click") {
        const selection = getTextSelection();
        if (selection === null) return null;
        cursor.current = {
          node: selection.anchorNode,
          offset: selection.anchorOffset,
        };
      }     
  } 

  function handleBackspaceAtStart(selection: TextSelection) {
    if (selection.anchorOffset > 0) {
      return {
        node: selection.anchorNode,
        offset: selection.anchorOffset - 1,
      };
    } else if (selection.anchorOffset === 0) {
      const { targetNode, targetOffset } = findPreviousPosition(
        selection.anchorNode!
      );

       const textNode = findTextNode(selection.anchorNode!);
       const previousTextNode = findPreviousTextNode(textNode);

      if (previousTextNode) {
        // Update selection
        const selection = getTextSelection();
        const range = document.createRange();
        
        range.setStart(previousTextNode, previousTextNode.textContent?.length!);
        range.setEnd(previousTextNode, previousTextNode.textContent?.length!);

        selection?.position.removeAllRanges();
        selection?.position.addRange(range);

        // Update cursor ref
        cursor.current = { node: targetNode, offset: targetOffset };
      }
      else {
         const parent = textNode.parentNode;
         const selection = getTextSelection();
         const range = document.createRange();
         range.setStart(parent!, 0);
         range.setEnd(parent!, 0);

         selection?.position.removeAllRanges();
         selection?.position.addRange(range);

         cursor.current = { node: parent, offset: 0 };
      }
    }
  }

  useLayoutEffect(()=> {
    if(cursor.current !== null) {
      const selection = getTextSelection()
      const {node,offset} = cursor.current
      
      if(selection && node) {      
         selection.position.collapse(node,offset)        
      }
      cursor.current=null
    }
  },[ast])
  

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


