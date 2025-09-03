import React from "react";
import type { Ast, InlineElement, ListBlock, ListItemBlock, TextBlock } from "./Utils/ast";
import  { isInlineElement } from "./Utils/typeOfElement";

interface RendererProps {
    ast: Ast
}

export default function Renderer({ast}:RendererProps){

    
    const renderInline =(inlineElement: InlineElement,index:number) => {
        let element: React.ReactNode = <span  key={index}>{inlineElement.text}</span>
        inlineElement.formats.forEach(format => {
            if(format === 'bold'){
                element = <strong key={index}>element</strong>                
            } else if (format === 'italic'){
                element = <em  key={index}>{element}</em>
            } else if (format === 'underline'){
                element = <u  key={index}>{element}</u>
            } else if (format.startsWith('color:')){
                const color = format.split(':')[1]
                element = (
                    <span style={{color}}>
                        {element}
                    </span>
                )
            }
        })
        return element
    }
    const renderBlock =(blockElement: TextBlock | ListBlock| ListItemBlock) => {
        const key = blockElement.id
        const children = blockElement.children.map((inline,index)=>            
        {
            if(isInlineElement(inline)){

            return renderInline(inline,index)
        }
        else                      
            return renderBlock(inline)
        }
        )
        switch (blockElement.type){
            case 'paragraph':
                return <p key={key} data-id={blockElement.id} data-type={blockElement.type}>{children}</p>
                case 'heading':
                    return <h1 key={key} data-id={blockElement.id} data-type={blockElement.type}>{children}</h1>
                  case 'unordered-list':
                        return <ul key={key} data-id={blockElement.id} data-type={blockElement.type}>{children}</ul>
                        case 'ordered-list':
                            return <ol key={key} data-id={blockElement.id} data-type={blockElement.type}>{children}</ol>
                            case 'list-item':
                                return <li key={key} data-id={blockElement.id} data-type={blockElement.type}>{children}</li>
                    default:
                        return <p key={key}>{children}</p>
        }
    }
    return <>{ast.map(renderBlock)}</>
}