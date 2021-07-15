import { SchemaData } from "../core/parser/src/types/schema";
import { createLogger } from "../utils/logger";
import { createStore } from "vuex";

const logger = createLogger("store");

export type State = {
  schema: SchemaData;
};

export enum Mutations {
  // eslint-disable-next-line no-unused-vars
  ADD = "add",
}

export const store = createStore<State>({
  state: {
    schema: {
      name: "div",
      __uuid: 0,
      children: [],
    },
  },

  mutations: {
    [Mutations.ADD](state, componentName: string) {

    },
  },
});
