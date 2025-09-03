export type InlineFormat =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "code"
  | "superscript"
  | "subscript"
  | "code"
  | string;

// Inline content
export interface InlineElement {
  text: string;
  formats: InlineFormat[]; // e.g., 'bold'
}

// Blocks that contain text
export interface TextBlock {
  id: string;
  type: "paragraph" | "heading"; // or other text types
  children: InlineElement[]; //
}

// Blocks that contain other blocks (containers)
export interface ListBlock {
  id: string;
  type: "unordered-list" | "ordered-list";
  children: ListItemBlock[]; // These can ONLY contain list-item blocks
}

// The list item block, which contains text AND other lists
export interface ListItemBlock {
  id: string;
  type: "list-item";
  children: (InlineElement | ListBlock)[]; // Can contain either inline or list blocks
}

// The main AST is an array of top-level blocks
export type Ast = (TextBlock | ListBlock)[];

export const initialAST: Ast = [
  {
    id: "b1",
    type: "paragraph",
    children: [
      {
        text: "hello",
        formats: [],
      },
    ],
  },
  {
    id: "b2",
    type: "paragraph",
    children: [
      {
        text: "welcome",
        formats: [],
      },
    ],
  },
  {
    id: "b3",
    type: "ordered-list",
    children: [
      {
        id: "31",
        type: "list-item",
        children: [
          {
            text: "Earth",
            formats: [],
          },
          {
            id: "311",
            type: "ordered-list",
            children: [
              {
                id: "Africa",
                type: "list-item",
                children: [
                  {
                    text: "Africa",
                    formats: [],
                  },
                  {
                    id: "31111",
                    type: "ordered-list",
                    children: [
                      {
                        id: "Morocco",
                        type: "list-item",
                        children: [
                          {
                            text: "Morocco",
                            formats: [],
                          },
                        ],
                      },
                      {
                        id: "Alger",
                        type: "list-item",
                        children: [
                          {
                            text: "Alger",
                            formats: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: "Europ",
                type: "list-item",
                children: [
                  {
                    text: "Europ",
                    formats: [],
                  },
                  {
                    id: "31122",
                    type: "ordered-list",
                    children: [
                      {
                        id: "666666666",
                        type: "list-item",
                        children: [
                          {
                            text: "Spain",
                            formats: [],
                          },
                          {
                            text: "Espania",
                            formats: [],
                          },
                        ],
                      },
                      {
                        id: "Portogal",
                        type: "list-item",
                        children: [
                          {
                            text: "Portogal",
                            formats: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
