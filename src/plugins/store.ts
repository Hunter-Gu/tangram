import { Component, SchemaData } from "../core/parser/src/types/schema";
import { createStore } from "vuex";
import { registry } from "../pages/editor/utils/registry";
import { PropsDescriptor } from "@/pages/editor/types/descriptor";
import { get } from "../core/parser/src/utils/utils";
import { DropType } from "../pages/editor/types/node-tree";
import { getDescriptorByRuntime } from "./utils/get-descriptor-by-runtime";
import { removeNode } from "./utils/remove-node";
import { CommandManager } from "./utils/command/command-manager";
import { AddCommand } from "./utils/command/add-command";
import { AddCommandStatData } from "./utils/command/types";
import { UpdateCommand } from "./utils/command/update-command";
import { MoveCommand } from "./utils/command/move-command";

export const commandManager = new CommandManager({
  name: "div",
  __uuid: 0,
  children: [],
});

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
    schema: commandManager.schemaData,

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
      params: Omit<AddCommandStatData, "componentOrTagName"> & {
        componentName: string;
      }
    ) {
      const renderDescriptor = registry.getPropsDescriptor(
        params.componentName
      )?.data;
      const component = renderDescriptor?.component;

      const addCommand = new AddCommand({
        ...params,
        componentOrTagName: component as unknown as Component,
      });

      const { schema, currentPath } = commandManager.do(addCommand);
      state.schema = schema;

      store.commit(Mutations.SELECT, {
        name: component?.name,
        path: currentPath,
      });

      // init props for instance
      renderDescriptor?.descriptor.props.forEach((prop) => {
        if ("defaultValue" in prop) {
          store.commit(Mutations.UPDATE_ELEMENT_PROPS, {
            field: prop.name,
            value: prop.defaultValue,
          });
        }
      });
    },

    [Mutations.SELECT](state, { name, path }) {
      const renderDescriptor = registry.getPropsDescriptor(name)?.data;

      state.currentPath = path;

      state.currentSelect = getDescriptorByRuntime(
        // @ts-ignore
        renderDescriptor?.descriptor,
        // @ts-ignore
        get(state.schema, state.currentPath)?.props
      );

      state.selectPaths = [path];
      removeNode.update(state.schema, path);
    },

    [Mutations.CLEAR_SELECTS](state) {
      state.selectPaths = [];
      state.currentPath = ``;
      state.currentSelect = undefined;
      removeNode.update(undefined, "");
    },

    [Mutations.UPDATE_ELEMENT_PROPS](state, { field, value }) {
      const updateCommand = new UpdateCommand({
        path: state.currentPath,
        field: field,
        value,
      });
      const { schema } = commandManager.do(updateCommand);
      state.schema = schema;
    },

    [Mutations.MOVE](
      state,
      { from, to, type }: { from: string; to: string; type: DropType }
    ) {
      if (from === to) {
        return;
      }

      const moveCommand = new MoveCommand({
        type,
        from,
        to,
      });

      const { schema } = commandManager.do(moveCommand);
      state.schema = schema;
      store.commit(Mutations.CLEAR_SELECTS);
    },
  },
});
