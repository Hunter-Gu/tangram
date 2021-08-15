export type Handler<T> = (arg?: T) => unknown;

export type HandlerDesc<O, V = O[keyof O] | O> = {
  key?: keyof O;
  handler: Handler<V>;
};
