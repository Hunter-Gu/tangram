<template>
  <Editor :schema="schema" :descriptor="descriptor" @clear-select="clickNoop" />
</template>

<script lang="ts" setup>
import { computed } from "@vue/runtime-core";
import { Store, useStore } from "vuex";
import type { State } from "../../../plugins/store";
import { Mutations } from "../../../plugins/store";
import Editor from "./editor.vue";

const store: Store<State> = useStore();

const schema = store.state.schema;
const descriptor = computed(() => store.state.currentSelect);

function clickNoop() {
  store.commit(Mutations.CLEAR_SELECTS);
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
