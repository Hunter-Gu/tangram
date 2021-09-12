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
  />
</template>

<script lang="ts" setup>
import { computed, ref } from "@vue/reactivity";
import { defineEmits, defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import type { SchemaData } from "../../../core/parser/src/types/schema";
import { registry } from "../utils/registry";
import { DropType } from "../types/node-tree";
import { DropHandlerParams, Node, SelectHandlerParams, Tree } from "./types";
import { normalize } from "./normalize";

const props = defineProps({
  schema: {
    type: Object as PropType<SchemaData>,
    required: true,
  },

  currentNodeKey: {
    type: String as PropType<string | null>,
    default: "",
  },
});

const emit = defineEmits({
  /* eslint-disable @typescript-eslint/no-unused-vars */
  select: (arg: SelectHandlerParams) => true,
  move: (arg: DropHandlerParams) => true,
  /* eslint-enable */
});

const data = computed(() => normalize(props.schema))
const test = ref();

function handleDrop(draggingNode: Node, dropNode: Node, type: DropType) {
  emit("move", {
    from: draggingNode.data._meta.path,
    to: dropNode.data._meta.path,
    type,
  } as DropHandlerParams);
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

  emit("select", {
    name,
    path,
  } as SelectHandlerParams);
}
</script>
