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

        state.schema.children?.push({
          name: component,
          __uuid: new Date().getTime(),
        });
        store.commit(Mutations.SELECT, { name: component?.name, index });

        // init props for instance
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
      const renderDescriptor = registry.getPropsDescriptor(name)?.data;

      state.currentPath = `children.${index}`;

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

    [Mutations.MOVE](state, { from, to, type }) {
      const realIndex = calcRealIndex(from, to);

      if (!realIndex) {
        return;
      }

      // example:    children.0.children.1.children.2
      // parentPath: children.0.children.1.children
      // index:      2
      const getPathAndIndex = (path: string) => {
        return {
          parentPath: path.split(".").slice(0, -1).join("."),
          index: path.split(".").slice(-1).join("."),
        };
      };
      const { parentPath, index } = getPathAndIndex(realIndex.from);
      const { parentPath: targetParentPath, index: targetIndex } =
        getPathAndIndex(realIndex.to);

      const node = get(state.schema, parentPath).splice(index, 1)[0];
      const parent = get(
        state.schema,
        // TODO: the final index should calc by parent and target info
        type !== "inner"
          ? realIndex.belongToRoot
            ? ""
            : targetParentPath.split(".").slice(-1).join(".")
          : `${targetParentPath}.${targetIndex}`
      );

      // TODO: the current problem is we may crash into equipment operator
      // insert to parent is the same as insert before sibling
      // so the type is not enough to describe the operator intention, we need more info

      if (!parent.children) {
        parent.children = [];
      }
      // TODO: should remove outside Block
      parent.children.splice(targetIndex, 0, node);
    },
  },
});

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

function calcRealIndex(from: string, to: string) {
  const fromPath = from.split(".");
  const toPath = to.split(".");
  const belongToRoot = toPath.length === 2;

  if (fromPath.length > toPath.length) {
    return { from, to, belongToRoot };
  }

  if (to.includes(from, 0)) {
    logger.warn(
      `can't calculate real index beacause the node can't be it's children node's children, from: [${from}], to: [${to}]`
    );
    return null;
  }

  if (!to.includes(from.slice(0, -1), 0)) {
    return { from, to, belongToRoot };
  }

  const fromIndex = +from.slice(-1);
  const index = fromPath.length - 1;
  const toIndex = +toPath[index];

  if (fromIndex > toIndex) {
    return { from, to, belongToRoot };
  }

  toPath[index] = String(+toPath[index] - 1);
  return {
    from,
    to: toPath.join("."),
    belongToRoot,
  };
}
