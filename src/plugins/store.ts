import { Child, SchemaData } from "../core/parser/src/types/schema";
import { createLogger } from "../utils/logger";
import { createStore } from "vuex";
import { registry } from "../pages/editor/utils/registry";
import { PropsDescriptor } from "@/pages/editor/types/descriptor";
import { get, set } from "../core/parser/src/utils/utils";
import { DropType } from "../pages/editor/types/node-tree";
import { PathManager } from "./utils/path-manager";
import { getParentPathAndIndex, move } from "./utils/move";
import { getDescritporByRuntime } from "./utils/get-descriptor-by-runtime";
import { Operation } from "../pages/editor/block/types";

const logger = createLogger("store");

export type State = {
  schema: SchemaData;

  currentSelect?: PropsDescriptor;

  currentPath: string;

  selectPaths: string[];
};

export enum Mutations {
  // eslint-disable-next-line no-unused-vars
  ADD_ELEMENT = "add",

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
    selectPaths: [],
  },

  mutations: {
    [Mutations.ADD_ELEMENT](
      state,
      {
        path,
        componentName,
        type,
      }: { path: string; componentName: string; type: Operation }
    ) {
      try {
        const renderDescriptor =
          registry.getPropsDescriptor(componentName)?.data;

        const component = renderDescriptor?.component;
        const operatorTarget = get(state.schema, path) as SchemaData;
        const { parentPath, index } = getParentPathAndIndex(path);
        const ancestors = get(state.schema, parentPath) as Child[];

        if (!operatorTarget.children) {
          operatorTarget.children = [];
        }

        const newData: Child = {
          // @ts-ignore
          name: component,
          __uuid: new Date().getTime(),
        };
        let newPath = "";
        switch (type) {
          case Operation.Inside: {
            newPath = PathManager.concat(
              path,
              PathManager.ChildrenPropName,
              operatorTarget.children.push(newData) - 1
            );
            break;
          }
          case Operation.Top:
          case Operation.Left:
            ancestors.splice(index, 0, newData);
            newPath = path;
            break;
          case Operation.Bottom:
          case Operation.Right:
            // insert after need plus 1
            ancestors.splice(index + 1, 0, newData);
            newPath = PathManager.concat(parentPath, index + 1);
            break;
          default:
            newPath = PathManager.concat(
              path,
              PathManager.ChildrenPropName,
              operatorTarget.children.push(newData) - 1
            );
        }

        // TODO the select path
        store.commit(Mutations.SELECT, {
          name: component?.name,
          path: newPath,
        });

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
        // @ts-ignore
        logger.error(e.message);
      }
    },

    [Mutations.SELECT](state, { name, path }) {
      const renderDescriptor = registry.getPropsDescriptor(name)?.data;

      state.currentPath = path;

      state.currentSelect = getDescritporByRuntime(
        // @ts-ignore
        renderDescriptor?.descriptor,
        // @ts-ignore
        get(state.schema, state.currentPath)?.props
      );

      state.selectPaths = [path];
    },

    [Mutations.CLEAR_SELECTS](state) {
      state.selectPaths = [];
      state.currentPath = ``;
      state.currentSelect = undefined;
    },

    [Mutations.UPDATE_ELEMENT_PROPS](state, { path, value }) {
      const currentSchemaDataNode = get(
        state.schema,
        state.currentPath
      ) as SchemaData;
      const props =
        currentSchemaDataNode.props || (currentSchemaDataNode.props = {});
      props[path] = value;
    },

    [Mutations.MOVE](
      state,
      { from, to, type }: { from: string; to: string; type: DropType }
    ) {
      if (from === to) {
        return;
      }

      const { parentPath: parentPathOfFrom, index: indexOfFrom } =
        getParentPathAndIndex(from);
      const { parentPath: parentPathOfTo, index: indexOfTo } =
        getParentPathAndIndex(to);

      const getTarget = () => {
        const isInsertMode = type === DropType.Inner;
        const path = isInsertMode ? to + ".children" : parentPathOfTo;
        let parent = get(state.schema, path) as Child[] | undefined;
        const index = isInsertMode ? parent?.length || 0 : +indexOfTo;

        if (!parent) {
          set(state.schema, path, []);
          parent = get(state.schema, path) as Child[];
        }

        return {
          parent,
          index,
        };
      };

      const parent = get(state.schema, parentPathOfFrom) as Child[];
      const { parent: targetParent, index: realIndex } = getTarget();

      move(
        {
          array: parent,
          index: +indexOfFrom,
        },
        {
          array: targetParent,
          index: realIndex,
        }
      );

      store.commit(Mutations.CLEAR_SELECTS);
    },
  },
});
