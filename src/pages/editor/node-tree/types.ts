import type { Component } from "../../../core/parser/src/types/schema";
import { DropType } from "../types/node-tree";

export type Tree = {
  uuid: string;
  label: string;
  _meta: {
    // the name used for seeking in registry
    name: string | Component;
    // the path of current node, used for updating layer level
    path: string;
  };
  children?: Tree[];
};

export type Node = {
  data: Tree;
};

export type DropHandlerParams = {
  from: string;
  to: string;
  type: DropType;
};

export type SelectHandlerParams = {
  path: string;
  name: string;
};

export function typeHelper<A extends unknown>(a: A): boolean;
export function typeHelper<A extends unknown, B extends unknown>(
  a: A,
  b: B
): boolean;
export function typeHelper<
  A extends unknown,
  B extends unknown,
  C extends unknown
>(a: A, b: B, c: C): boolean;
export function typeHelper<
  A extends unknown,
  B extends unknown,
  C extends unknown,
  D extends unknown
>(a: A, b: B, c: C, d: D): boolean;
export function typeHelper<
  A extends unknown,
  B extends unknown,
  C extends unknown,
  D extends unknown,
  E extends unknown
>(a: A, b: B, c: C, d: D, e: E): boolean;
export function typeHelper<
  A extends unknown,
  B extends unknown,
  C extends unknown,
  D extends unknown,
  E extends unknown,
  F extends unknown
>(a: A, b: B, c: C, d: D, e: E, f: F): boolean;
export function typeHelper() {
  return true;
}
