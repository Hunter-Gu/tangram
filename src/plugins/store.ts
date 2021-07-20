import { SchemaData } from "../core/parser/src/types/schema";
import { createLogger } from "../utils/logger";
import { createStore } from "vuex";
import { registry } from "../pages/editor/registry";
import { PropsDescriptor } from "@/pages/editor/types/descriptor";
import { get } from "../core/parser/src/utils/utils";

const logger = createLogger("store");

export type State = {
  schema: SchemaData;

  currentSelect?: PropsDescriptor;

  currentPath: string;
};

export enum Mutations {
  // eslint-disable-next-line no-unused-vars
  ADD_ELEMENT = "add",

  // eslint-disable-next-line no-unused-vars
  SELECT_ELEMENT = "select",

  // eslint-disable-next-line no-unused-vars
  UPDATE_ELEMENT_PROPS = "update",
}

export const store = createStore<State>({
  state: {
    schema: {
      name: "div",
      __uuid: 0,
      children: [],
    },

    currentSelect: undefined,

    currentPath: "",
  },

  mutations: {
    [Mutations.ADD_ELEMENT](state, componentName: string) {
      try {
        const renderDescriptor =
          registry.getPropsDescriptor(componentName)?.data;

        const childrenCount = state.schema.children?.push({
          name: renderDescriptor?.component,
          __uuid: new Date().getTime(),
        })!;

        store.commit(Mutations.SELECT_ELEMENT, {
          descriptor: renderDescriptor?.descriptor,
          index: childrenCount - 1,
        });
      } catch (e) {
        logger.error(e.message);
      }
    },

    [Mutations.SELECT_ELEMENT](state, { descriptor, index }) {
      state.currentPath = `children.${index}`;
      state.currentSelect = descriptor;
    },

    [Mutations.UPDATE_ELEMENT_PROPS](state, { path, value }) {
      // @ts-ignore-next-line
      const currentSchemaDataNode = get(
        state.schema,
        state.currentPath
      ) as SchemaData;
      const props =
        currentSchemaDataNode.props || (currentSchemaDataNode.props = {});
      props[path] = value;
    },
  },
});
