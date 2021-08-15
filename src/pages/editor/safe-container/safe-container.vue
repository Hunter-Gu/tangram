<template>
  <component :is="tag" ref="elm" class="container">
    <span v-if="fail">{{ componentName }}</span>
    <template v-else>
      <component v-bind="componentProps" :is="component" />
      <div class="name">
        {{ componentName }}
      </div>
    </template>
    <span class="modal" />
  </component>
</template>

<script lang="ts" setup>
import {
  defineProps,
  onErrorCaptured,
  onMounted,
  ref,
} from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import type { Component } from "../../../core/parser/src/types/schema";

const fail = ref(false);

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

  componentProps: {
    type: Object,
    default: () => ({}),
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
.container {
  position: relative;
}
.name {
  margin-top: 10px;
}

.modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
