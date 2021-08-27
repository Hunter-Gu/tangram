<template>
  <Block
    :name="name"
    :path="path"
    :select-paths="store.state.selectPaths"
    @add="handleAdd"
    @select="handleSelect"
    @clear-selects="handleClearSelect"
  >
    <slot />
  </Block>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import { Store, useStore } from "vuex";
import type { State } from "../../../plugins/store";
import { Mutations } from "../../../plugins/store";
import Block from "./block.vue";
import { handleDrop } from "../editor/dnd";
import { AddParams, SelectParams } from "./types";

const store: Store<State> = useStore();

defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },

  path: {
    type: String as PropType<string>,
    required: true,
  },
});

function handleSelect(arg: SelectParams) {
  store.commit(Mutations.SELECT, arg);
}

function handleClearSelect() {
  store.commit(Mutations.CLEAR_SELECTS);
}

function handleAdd({ evt, path }: AddParams) {
  handleDrop(store, evt, path);
}
</script>
