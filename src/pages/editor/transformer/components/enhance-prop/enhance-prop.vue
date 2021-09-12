<template>
  <el-space
    :class="wrap ? 'enable-wrap' : ''"
    size="mini"
    spacer=":"
    :wrap="wrap"
  >
    <span ref="labelRef">{{ label || name }}</span>

    <component
      :is="component"
      v-bind="staticProps"
      v-model="value"
      @input="handleInput"
      @blur="handleInput"
    />
  </el-space>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, defineEmits } from "@vue/runtime-core";
import type { ComponentProp } from "../../../types/component";
import { UpdateParams } from "./types";
import { getComponentProps } from "./constants";

const props = defineProps(getComponentProps());

const value = ref((props as unknown as ComponentProp).defaultValue);

const useWrap = (elm: HTMLElement) => {
  const lineHeight = parseInt(getComputedStyle(elm).lineHeight);
  const height = parseInt(String(elm.getBoundingClientRect().height));

  return height > 1.5 * lineHeight;
};

const labelRef = ref<HTMLElement>();
const wrap = ref(false);

onMounted(() => {
  const elm = labelRef.value;
  if (elm) {
    wrap.value = useWrap(elm);
  }
});

const emit = defineEmits({
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateProps: (path: UpdateParams) => true,
});

const handleInput = function () {
  emit("updateProps", {
    field: (props as unknown as ComponentProp).name,
    value: value.value,
  } as UpdateParams);
};
</script>

<style scoped>
.enable-wrap.el-space > :deep(.el-space__item):last-child {
  width: 100%;
}
</style>
