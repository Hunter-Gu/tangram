<template>
  <div class="select" :class="statusClasses" @click.stop="handleSelect">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import { SelectParams } from "../types";
import { CLASS_SELECT_STATUS } from "./constants";

const props = defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },

  path: {
    type: String as PropType<string>,
    required: true,
  },

  selectPaths: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const statusClasses = computed(() => ({
  [CLASS_SELECT_STATUS]:
    (props.selectPaths as string[]).indexOf(props.path) > -1,
}));

const emits = defineEmits({
  clearSelects: () => true,
  select: (arg: SelectParams) => arg,
});

function handleSelect() {
  emits("clearSelects");
  emits("select", {
    name: props.name,
    path: props.path,
  });
}
</script>

<style scoped>
.select-status {
  outline: 1px dashed blue;
}
</style>
