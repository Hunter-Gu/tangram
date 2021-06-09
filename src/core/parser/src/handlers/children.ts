import { parse } from "..";
import { Child } from "../types/schema";

export function handleChildren(children?: Child[]) {
  return (children || []).map(child => {
    return typeof child === 'string'
      ? child
      : parse(child)
  });
}
