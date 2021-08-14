import { Child, SchemaData } from "../core/parser/src/types/schema";
import { createLogger } from "../utils/logger";
import { createStore } from "vuex";
import { registry } from "../pages/editor/utils/registry";
import { PropsDescriptor } from "@/pages/editor/types/descriptor";
import { get, set } from "../core/parser/src/utils/utils";
import { DropType } from "../pages/editor/types/node-tree";
import { PathManager } from "./utils/path-manager";

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
    selectPaths: [],
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
        store.commit(Mutations.SELECT, {
          name: component?.name,
          path: PathManager.concatIndex(index),
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
        logger.error(e.message);
      }
    },

    // TODO: need to support deep path
    [Mutations.SELECT](state, { name, path }) {
      const renderDescriptor = registry.getPropsDescriptor(name)?.data;

      state.currentPath = path;

      // @ts-ignore-next-line
      state.currentSelect = getDescritporByRuntime(
        renderDescriptor?.descriptor,
        get(state.schema, state.currentPath).props
      );

      state.selectPaths = [path];
    },

    [Mutations.CLEAR_SELECTS](state) {
      state.selectPaths = [];
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
        const index = isInsertMode ? parentPathOfTo?.length || 0 : +indexOfTo;

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

type Node<T> = {
  array: T[];
  index: number;
};

function move<T>(from: Node<T>, to: Node<T>) {
  const node = from.array.splice(from.index, 1)[0];

  to.array.splice(to.index, 0, node);
}

// example:    children.0.children.1.children.2
// parentPath: children.0.children.1.children
// index:      2
function getParentPathAndIndex(path: string) {
  const lastIndex = path.lastIndexOf(PathManager.Seperator);

  return {
    parentPath: path.slice(0, lastIndex),
    index: path.slice(lastIndex + 1),
  };
}
