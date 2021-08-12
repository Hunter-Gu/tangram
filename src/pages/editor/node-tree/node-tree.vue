<template>
  <el-tree
    :data="data"
    node-key="id"
    default-expand-all
    @node-drop="handleDrop"
    draggable
    :allow-drop="allowDrop"
  >
  </el-tree>
</template>

<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import { defineProps, watch } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import type { SchemaData } from "../../../core/parser/src/types/schema";
import { registry } from "../registry";
import { useStore } from "vuex";
import { Mutations } from "../../../plugins/store";
import { DropType } from "../types/node-tree";

const store = useStore();

const props = defineProps({
  schema: {
    type: Object as PropType<SchemaData>,
    required: true,
  },
});

type Tree = {
  id: number;
  label: string;
  _meta: {
    // the name used for seeking in registry
    name: string;
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
      id: schema.__uuid || new Date().getTime(),
      label: schema.name.name || "label",
      _meta: {
        name: schema.name,
        path,
      },
      children: schema.children?.map((n, i) =>
        _normalize(n, `${path ? path + "." : ""}children.${i}`)
      ),
    };
  };

  return [_normalize(schema)];
}

let data = ref(normalize(props.schema));

watch(props.schema, (newVal, oldVal) => {
  data.value = normalize(newVal);
});

const defaultProps = ref({
  children: "children",
  label: "label",
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
</script>
