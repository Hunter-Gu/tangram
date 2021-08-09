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

  // eslint-disable-next-line no-unused-vars
  MOVE = "move",
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

        // should not wrapper component by Block here
        // it will cause additional layer everywhere
        // but acutally we should not realize the exist of Block layer
        state.schema.children?.push(enhanceBlock(component, index))!;
        store.commit(Mutations.SELECT, { name: component?.name, index });

        renderDescriptor?.descriptor.props.forEach((prop) => {
          if ("defaultValue" in prop) {
            store.commit(Mutations.UPDATE_ELEMENT_PROPS, {
              path: prop.name,
              value: prop.defaultValue,
            });
          }
        });
      } catch (e) {
        logger.error(e.message);
      }
    },

    [Mutations.SELECT](state, { name, index }) {
      const blockPath = `children.0`;
      const renderDescriptor = registry.getPropsDescriptor(name)?.data;

      state.currentPath = `.children.${index}.${blockPath}`;

      // @ts-ignore-next-line
      state.currentSelect = getDescritporByRuntime(
        renderDescriptor?.descriptor,
        get(state.schema, state.currentPath).props
      );

      state.selectIndexs = [index];
    },

    [Mutations.CLEAR_SELECTS](state) {
      state.selectIndexs = [];
      state.currentPath = ``;
      state.currentSelect = undefined;
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

    [Mutations.MOVE](state, { from, to }) {
      const getPathAndIndex = (path: string) => {
        return {
          parentPath: path.split(".").slice(0, -1).join("."),
          index: path.split(".").slice(-1).join("."),
        };
      };
      const { parentPath, index } = getPathAndIndex(from);
      const { parentPath: targetParentPath, index: targetIndex } =
        getPathAndIndex(to);

      const node = get(state.schema, parentPath).splice(index, 1)[0];
      const parent = get(
        state.schema,
        `${targetParentPath}.${targetIndex - 1}.children.0`
      );

      if (!parent.children) {
        parent.children = [];
      }
      // TODO: should remove outside Block
      parent.children.splice(targetIndex, 0, node);
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

function getDescritporByRuntime(
  descriptor: PropsDescriptor,
  runtimeData?: Record<string, any>
): PropsDescriptor {
  if (!runtimeData) {
    return descriptor;
  }

  return {
    ...descriptor,
    props: descriptor.props.map((prop) => {
      if (prop.name in runtimeData) {
        return {
          ...prop,
          defaultValue: runtimeData[prop.name],
        };
      }

      return prop;
    }),
  };
}
