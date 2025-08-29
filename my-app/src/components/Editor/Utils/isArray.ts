import type { ListBlock } from "./ast";

export function hasAnyArray(obj: Record<string, unknown>): boolean {
  return Object.values(obj).some((val) => Array.isArray(val));
}

export function isArray(obj:any):boolean{
    return Object.values(obj).some((val) => Array.isArray(val));
}
export function isListBlock(obj: any): obj is ListBlock {
  return obj && obj.type === 'unordered-list' || obj.type === 'ordered-list';
}

export function hasTextInlineElement(obj: any): boolean {
  const res= ('text' in obj.children[0])
  return res
}