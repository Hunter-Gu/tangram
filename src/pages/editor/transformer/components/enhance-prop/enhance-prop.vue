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
      v-model="defaultValue"
    ></component>
  </el-space>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref } from "@vue/runtime-core";
import type { PropType, Ref } from "@vue/runtime-core";
import type { ComponentProp } from "../../../types/component";
import type { ComponentInfo } from "../../../types/transform";

const props: ComponentProp | ComponentInfo = defineProps({
  name: {
    type: String as PropType<string>,
  },
  label: {
    type: String as PropType<string>,
  },
  component: {
    type: [String, Object] as PropType<ComponentInfo["component"]>,
    required: true,
  },
  staticProps: {
    type: Object as PropType<ComponentInfo["staticProps"]>,
  },
  defaultValue: {},
}); // TODO why props missing when add `as ComponentProp & ComponentInfo` at tail

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
