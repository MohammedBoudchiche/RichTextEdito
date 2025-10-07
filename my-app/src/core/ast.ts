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
      {
        text: "",
        formats: [],
      },
    ],
  },
  {
    id: "b3",
    type: "ordered-list",
    children: [
      {
        id: "b-1",
        type: "list-item",
        children: [
          {
            text: "Earth",
            formats: [],
          },
          {
            id: "b-2",
            type: "ordered-list",
            children: [
              {
                id: "b210",
                type: "list-item",
                children: [
                  {
                    text: "Africa",
                    formats: [],
                  },
                  {
                    id: "b2101",
                    type: "ordered-list",
                    children: [
                      {
                        id: "b2102",
                        type: "list-item",
                        children: [
                          {
                            text: "Morocco",
                            formats: [],
                          },
                        ],
                      },
                      {
                        id: "b2103",
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
                id: "b310",
                type: "list-item",
                children: [
                  {
                    text: "Europ",
                    formats: [],
                  },
                  {
                    id: "b3101",
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
                        id: "b302",
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
  {
    id: "b4",
    type: "ordered-list",
    children: [
      {
        id: "b-80",
        type: "list-item",
        children: [
          {
            text: "Earth ",
            formats: [],
          },
          {
            text: "Lepton",
            formats: [],
          },
          {
            text: "Germany",
            formats: [],
          },
          {
            text: "letuania",
            formats: [],
          },
          {
            id: "b800",
            type: "ordered-list",
            children: [
              {
                id: "b810",
                type: "list-item",
                children: [
                  {
                    text: "Africa",
                    formats: [],
                  },
                ],
              },
              {
                id: "b910",
                type: "list-item",
                children: [
                  {
                    text: "Latina",
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
];
