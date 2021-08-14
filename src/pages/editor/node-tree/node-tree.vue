<template>
  <el-tree
    :data="data"
    node-key="uuid"
    :current-node-key="currentNodeKey"
    :highlight-current="true"
    default-expand-all
    ref="test"
    @node-drop="handleDrop"
    @current-change="handleChange"
    draggable
    :allow-drop="allowDrop"
  >
  </el-tree>
</template>

<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import { computed, defineProps, watch } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import type {
  Component,
  SchemaData,
} from "../../../core/parser/src/types/schema";
import { registry } from "../utils/registry";
import { Store, useStore } from "vuex";
import { Mutations } from "../../../plugins/store";
import type { State } from "../../../plugins/store";
import { DropType } from "../types/node-tree";
import { PathManager } from "../../../plugins/utils/path-manager";

const store: Store<State> = useStore();

const props = defineProps({
  schema: {
    type: Object as PropType<SchemaData>,
    required: true,
  },
});

type Tree = {
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

// this function will handle for block path that mentioned in store
// TODO: so move these together for better handling block path
function normalize(schema: SchemaData): Tree {
  const _normalize = (schema: SchemaData, path = ""): Tree => {
    return {
      uuid: path || "root",
      label: schema.name.name || "label",
      _meta: {
        name: schema.name,
        path,
      },
      children: schema.children?.map((n, i) =>
        _normalize(n, PathManager.concat(path, PathManager.ChildrenPropName, i))
      ),
    };
  };

  return [_normalize(schema)];
}

const data = ref(normalize(props.schema));
const test = ref();
const currentNodeKey = computed(() => {
  // TODO
  // actually we should not need it
  // it was element-ui bug, so remove it after fixed
  test.value?.setCurrentKey(store.state.currentPath || null);
  return store.state.currentPath || null;
});

watch(props.schema, (newVal, oldVal) => {
  data.value = normalize(newVal);
});

type Node = {
  data: Tree;
};

function handleDrop(draggingNode: Node, dropNode: Node, type: DropType, ev) {
  store.commit(Mutations.MOVE, {
    from: draggingNode.data._meta.path,
    to: dropNode.data._meta.path,
    type,
  });
}

function allowDrop(draggingNode: Node, dropNode: Node, type: DropType) {
  if (draggingNode === dropNode) {
    return false;
  }

  const name = dropNode.data._meta.name;

  if (name === "div") {
    return type === DropType.Inner;
  }

  const desc = registry.getPropsDescriptor(name.name);

  if (desc?.data.descriptor.descendant) {
    return true;
  } else {
    return type !== DropType.Inner;
  }
}

function handleChange(data: Tree) {
  let { name, path } = data._meta;

  if (typeof name === "string") {
    return;
  }

  name = name.name;

  store.commit(Mutations.SELECT, {
    name,
    path,
  });
}
</script>
