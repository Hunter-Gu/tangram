<template>
  <operation-bar
    :disable-left="disableLeft"
    :disable-right="disableRight"
    @redo="handleRedo"
    @undo="handleUndo"
  />
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import OperationBar from "./operation-bar.vue";
import { commandManager, Mutations, State } from "../../../plugins/store";
import { ref } from "@vue/reactivity";
import { onUnmounted } from "@vue/runtime-core";

const store = useStore<State>();
const disableLeft = ref(commandManager.hasNoPrevCommand);
const disableRight = ref(commandManager.isAtLastCommand);

// TODO: maybe should be optimized to plugin
const unsubscribe = store.subscribe(() => {
  disableLeft.value = commandManager.hasNoPrevCommand;
  disableRight.value = commandManager.isAtLastCommand;
});

onUnmounted(() => {
  unsubscribe();
});

function handleRedo() {
  store.commit(Mutations.REDO);
}

function handleUndo() {
  store.commit(Mutations.UNDO);
}
</script>
