<template>
  <el-space :class="wrap && 'enable-wrap'" size="mini" spacer=":" :wrap="wrap">
    <span ref="labelRef">{{ label || name }}</span>
    <slot></slot>
  </el-space>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref } from "@vue/runtime-core";
import type { PropType, Ref } from "@vue/runtime-core";
import type { ComponentProp } from "../../../types/component";

const props: ComponentProp = defineProps({
  name: {
    type: String as PropType<string>,
  },
  label: {
    type: String as PropType<string>,
  },
}); // TODO why props missing when add `as ComponentProp` at tail

const useWrap = (ref: Ref) => {
  const elm = ref.value;
  const lineHeight = parseInt(getComputedStyle(elm).lineHeight);
  const height = parseInt(elm.getBoundingClientRect().height);

  return height > 1.5 * lineHeight;
};

const labelRef = ref();
let wrap = ref(false);

onMounted(() => {
  wrap.value = useWrap(labelRef);
});
</script>

<style scoped>
.enable-wrap.el-space > :deep(.el-space__item):last-child {
  width: 100%;
}
</style>
