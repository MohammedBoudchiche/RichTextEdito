export type InlineFormat = 'bold' | 'italic' | 'underline' | string


// Inline content
export interface InlineElement {
  text: string;
  formats: InlineFormat[]; // e.g., 'bold'
}

// Blocks that contain text
export interface TextBlock {
  id: string;
  type: 'paragraph' | 'heading'; // or other text types
  children: InlineElement[]; // 
}

// Blocks that contain other blocks (containers)
export interface ListBlock {
  id: string;
  type: 'unordered-list' | 'ordered-list';
  children: ListItemBlock[]; // These can ONLY contain list-item blocks
}

// The list item block, which contains text AND other lists
export interface ListItemBlock {
  id: string;
  type: 'list-item';
  children: (InlineElement | ListBlock)[]; // Can contain either inline or list blocks
}

// The main AST is an array of top-level blocks
export type Ast = (TextBlock | ListBlock)[];


export const initialAST: Ast =[
    {
        id:'b1',
        type:'paragraph',
        children: [
            {
                text:'text typing here...',
                formats:[]
            },
            
        ],
    },
    {
        id:'b2',
        type:'paragraph',
        children: [
            {
                text:'text typing here...',
                formats:[]
            },
            
        ],
    },
    {
        id:'b3',
        type:'ordered-list',
        children: [
            
            {
                id:'b30',
                type:'list-item',
                children: [
                    
                    {
                        text:'mohammed',
                        formats:[]
                    },  
                      {
                id:'b31',
                type:'ordered-list',
                children: [
                    
                    {
                              
                id:'b32',
                type:'list-item',
                children: [
                    
                    {
                        text:'youssef',
                        formats:[]
                    },                                      
                ],
        
            }, 
                                               
                ],
        
            },                                    
                ],
        
            },
            {
                id:'b4',
                type:'list-item',
                children: [
                    
                    {
                        text:'zahra',
                        formats:[]
                    },
                    
                ],
        
            },
            {
                id:'b5',
                type:'list-item',
                children: [
                    
                    {
                        text:'boudchiche',
                        formats:[]
                    },
                    
                ],
        
            },
        ],
   
    },
]
