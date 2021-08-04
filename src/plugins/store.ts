import { SchemaData, Component, Child } from "../core/parser/src/types/schema";
import { createLogger } from "../utils/logger";
import { createStore } from "vuex";
import { registry } from "../pages/editor/registry";
import { PropsDescriptor } from "@/pages/editor/types/descriptor";
import { get } from "../core/parser/src/utils/utils";
import Block from "../pages/editor/block";

const logger = createLogger("store");

export type State = {
  schema: SchemaData;

  currentSelect?: PropsDescriptor;

  currentPath: string;

  selectIndexs: number[];
};

export enum Mutations {
  // eslint-disable-next-line no-unused-vars
  ADD_ELEMENT = "add",

  // eslint-disable-next-line no-unused-vars
  SET_CURRENT_SELECT = "set_current_select",

  // eslint-disable-next-line no-unused-vars
  SELECT = "select",

  // eslint-disable-next-line no-unused-vars
  UPDATE_ELEMENT_PROPS = "update",

  // eslint-disable-next-line no-unused-vars
  CLEAR_SELECTS = "clear_selects",
}

export const store = createStore<State>({
  state: {
    schema: {
      name: "div",
      __uuid: 0,
      children: [],
    },

    // current selected component's props
    currentSelect: undefined,

    currentPath: "",

    // the index of Block which has been selected
    // may can be a number
    selectIndexs: [],
  },

  mutations: {
    [Mutations.ADD_ELEMENT](state, componentName: string) {
      try {
        const renderDescriptor =
          registry.getPropsDescriptor(componentName)?.data;

        const component = renderDescriptor?.component;
        const index = state.schema.children?.length ?? 0;

        state.schema.children?.push(enhanceBlock(component, index))!;
        store.commit(Mutations.SELECT, { name: component?.name, index });
      } catch (e) {
        logger.error(e.message);
      }
    },

    [Mutations.SELECT](state, { name, index }) {
      const blockPath = `children.0`;
      const renderDescriptor = registry.getPropsDescriptor(name)?.data;

      state.currentPath = `.children.${index}.${blockPath}`;

      state.currentSelect = renderDescriptor?.descriptor;

      state.selectIndexs = [index];
    },

    [Mutations.CLEAR_SELECTS](state) {
      state.selectIndexs = [];
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

function enhanceBlock(name: Component, index: number): Child {
  return {
    name: Block,
    __uuid: 0,
    children: [
      {
        name,
        __uuid: new Date().getTime(),
      },
    ],
    props: {
      name: name.name,
      index,
    },
  };
}
