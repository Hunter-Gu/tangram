<template>
  <component :is="tag" ref="elm">
    <span v-if="fail">{{ componentName }}</span>
    <component class="no-pointer-event" v-else :is="component"></component>
  </component>
</template>

<script lang="ts" setup>
import {
  defineProps,
  onErrorCaptured,
  onMounted,
  ref,
  useContext,
} from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import type { Component } from "../../../core/parser/src/types/schema";

let fail = ref(false);

onErrorCaptured(() => {
  fail.value = true;
  return false;
});

const props = defineProps({
  component: {
    type: Object as PropType<Component>,
    required: true,
  },

  componentName: {
    type: String as PropType<string>,
    required: true,
  },

  tag: {
    type: String as PropType<string>,
    default: "div",
  },

  registerRef: {
    type: Function,
    required: true,
  },
});

const elm = ref();

onMounted(() => {
  props.registerRef(elm.value);
});
</script>

<style scoped>
.no-pointer-event {
  pointer-events: none;
}
</style>
