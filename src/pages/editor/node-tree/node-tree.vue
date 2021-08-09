<template>
  <el-tree
    :data="data"
    node-key="id"
    default-expand-all
    @node-drag-start="handleDragStart"
    @node-drag-enter="handleDragEnter"
    @node-drag-leave="handleDragLeave"
    @node-drag-over="handleDragOver"
    @node-drag-end="handleDragEnd"
    @node-drop="handleDrop"
    draggable
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
  >
  </el-tree>
</template>

<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import { defineProps, watch } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import type { SchemaData } from "../../../core/parser/src/types/schema";

const props = defineProps({
  schema: {
    type: Object as PropType<SchemaData>,
    required: true,
  },
});

type Tree = {
  id: number;
  label: string;
  children?: Tree[];
};

// this function will handle for block path that mentioned in store
// TODO: so move these together for better handling block path
function normalize(schema: SchemaData, isRoot = false): Tree {
  const _normalize = (schema: SchemaData): Tree => {
    return {
      id: schema.__uuid,
      label: schema.name || "label",
      children: schema.children?.map(_skipAndNormalize),
    };
  };

  const _skipAndNormalize = (schema: SchemaData): Tree => {
    schema = schema.children[0];
    return {
      id: schema.__uuid,
      label: schema.name.name || "label",
      children: schema.children?.map(_skipAndNormalize),
    };
  };

  return [_normalize(schema)];
}

let data = ref(normalize(props.schema, true));

watch(props.schema, (newVal, oldVal) => {
  data.value = normalize(newVal, true);
});

const defaultProps = ref({
  children: "children",
  label: "label",
});

function handleDragStart(node, ev) {
  console.log("drag start", node);
}
function handleDragEnter(draggingNode, dropNode, ev) {
  console.log("tree drag enter: ", dropNode.label);
}
function handleDragLeave(draggingNode, dropNode, ev) {
  console.log("tree drag leave: ", dropNode.label);
}
function handleDragOver(draggingNode, dropNode, ev) {
  console.log("tree drag over: ", dropNode.label);
}
function handleDragEnd(draggingNode, dropNode, dropType, ev) {
  console.log("tree drag end: ", dropNode && dropNode.label, dropType);
}
function handleDrop(draggingNode, dropNode, dropType, ev) {
  console.log("tree drop: ", dropNode.label, dropType);
}

function allowDrop(draggingNode, dropNode, type) {
  if (dropNode.data.label === "二级 3-1") {
    return type !== "inner";
  } else {
    return true;
  }
}

function allowDrag(draggingNode) {
  return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
}
</script>
