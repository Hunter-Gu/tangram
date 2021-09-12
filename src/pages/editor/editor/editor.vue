<template>
  <el-container class="height-100">
    <el-aside class="sidebar">
      <NodeTree :schema="props.schema" />
    </el-aside>

    <el-container class="main-border">
      <el-main
        ref="dropElm"
        @click="clickNoop"
      >
        <Stage :schema="props.schema" />
      </el-main>
    </el-container>

    <el-aside class="sidebar">
      <ul>
        <SafeContainer
          v-for="metadata in components"
          :key="metadata.key"
          tag="li"
          :component="metadata.data.renderView || metadata.data.component"
          :component-props="metadata.data.props"
          :component-name="metadata.key"
          :register-ref="collectDragElms(metadata.key)"
          :data-name="metadata.key"
        />
      </ul>
    </el-aside>
    <el-aside class="sidebar">
      <PropsRender :descriptor="props.descriptor" />
    </el-aside>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import PropsRender from "../props-render";
import {
  onMounted,
  PropType,
  defineProps,
  defineEmits,
} from "@vue/runtime-core";
import { useDrag, useDrop } from "./dnd";
import SafeContainer from "../safe-container";
import NodeTree from "../node-tree";
import { getAll } from "./registery/registry";
import Stage from "../stage";
import { SchemaData } from "../../../core/parser/src/types/schema";
import { PropsDescriptor } from "../types/descriptor";

const props = defineProps({
  schema: {
    type: Object as PropType<SchemaData>,
    required: true,
  },
  descriptor: {
    type: [Object] as PropType<PropsDescriptor>,
    default: null,
  },
});

const emits = defineEmits(["clearSelect"]);

const components = ref(getAll());

const dropElm = ref();
const dragElms: Record<string, HTMLElement> = {};

function collectDragElms(name: string) {
  return function (el: HTMLElement) {
    dragElms[name] = el;
  };
}

onMounted(() => {
  useDrop(dropElm.value.$el);
  Object.values(dragElms).forEach(useDrag);
});

function clickNoop() {
  emits("clearSelect");
}
</script>

<style scoped>
.height-100 {
  height: 100vh;
}
.main-border {
  border: 1px solid #ccc;
  border-width: 0 1px;
}
.sidebar {
  width: 250px !important;
  padding: 20px 10px;
}
.sidebar:nth-of-type(2) {
  padding-left: 0;
  padding-right: 0;
}
.sidebar:last-child {
  border: 1px solid #ccc;
  border-width: 0 1px;
}

ul {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}

ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}
li {
  width: 105px;
  padding: 10px 5px;
  margin: 0 10px 20px;
  box-sizing: border-box;
  word-break: break-all;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
