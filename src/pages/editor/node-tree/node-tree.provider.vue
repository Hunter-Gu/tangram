<template>
  <node-tree
    :schema="props.schema"
    :current-node-key="currentNodeKey"
    @move="handleDrop"
    @select="handleSelect"
    ref="test"
  />
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType, ref } from "@vue/runtime-core";
import { Store, useStore } from "vuex";
import NodeTree from "./node-tree.vue";
import { Mutations, State } from "../../../plugins/store";
import { SchemaData } from "../../../core/parser/src/types/schema";
import { DropHandlerParams, SelectHandlerParams } from "./types";

const props = defineProps({
  schema: {
    type: Object as PropType<SchemaData>,
    required: true,
  },
});

const store: Store<State> = useStore();

const test = ref();

const currentNodeKey = computed(() => {
  // TODO
  // actually we should not need it
  // it was element-ui bug, so remove it after fixed
  test.value?.test?.value?.setCurrentKey(store.state.currentPath || null);
  return store.state.currentPath || null;
});

function handleDrop(params: DropHandlerParams) {
  store.commit(Mutations.MOVE, params);
}

function handleSelect({ name, path }: SelectHandlerParams) {
  store.commit(Mutations.SELECT, {
    name,
    path,
  });
}
</script>
