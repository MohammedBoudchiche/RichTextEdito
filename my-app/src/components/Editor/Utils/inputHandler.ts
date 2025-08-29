import type { ChangeEvent, InputEvent, KeyboardEvent, MouseEvent } from "react"
import { initialAST, type Ast } from "./ast"
import {getTextSelection} from "./selection"

interface inputHandlerTypes {
    ast:Ast
    selection:number
    char:string
}

export default function inputHandler(event: ChangeEvent<HTMLInputElement> | 
        KeyboardEvent<HTMLInputElement> | 
        MouseEvent<HTMLInputElement>):string {

          console.log('event type isÜÜÜÜÜÜÜÜÜ: ')
     if (event.type === 'keydown') {
          console.log('event type is keyDown: ')

    const keyEvent = event as KeyboardEvent<HTMLInputElement>;
    if(keyEvent.key==='Enter')
    {        
        return 'Enter'
    }

    else if(keyEvent.key==='Backspace')
    {        
        return 'Backspace'
    }

     else if(keyEvent.key==='ArrowUp')
    {        
        return 'ArrowUp'
    }

     else if(keyEvent.key==='ArrowDown')
    {        
        return 'ArrowDown'
    }

     else if(keyEvent.key==='Escape')
    {        console.log('Escape pressed')
        return 'Escape'
    }
    else if(keyEvent.key==='ArrowLeft')
    {        
        return 'ArrowLeft'
    }
    else if(keyEvent.key==='ArrowRight')
    {        
        return 'ArrowRight'
    }
    // Skip if the key doesn't change input value (e.g., Enter, ArrowKeys)
    const nonValueChangingKeys = ['ArrowUp', 'ArrowDown', 'Escape', 'Backspace', 'Tab'];
    if (nonValueChangingKeys.includes(keyEvent.key)) {
      event.preventDefault()
      console.log('type keydown', keyEvent.key)
      return keyEvent.key; // Exit early to avoid duplicate logic
    }
  }

  // Handle ChangeEvent (input)
  else if (event.type === 'input') {
    //const inputEvent = event as ChangeEvent<HTMLInputElement>;
    //const inputEvent = event as InputEvent;
    //console.log('type input', inputEvent.target)
    //if (inputEvent.target.value !== undefined) {
      return 'input'
    //}
  }

  return ''
}
