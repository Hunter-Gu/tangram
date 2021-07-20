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
      @input="handleInput"
      @blur="handleInput"
    ></component>
  </el-space>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref } from "@vue/runtime-core";
import type { PropType, Ref } from "@vue/runtime-core";
import type { ComponentProp } from "../../../types/component";
import type { ComponentInfo } from "../../../types/transform";
import { useStore } from "vuex";
import { Mutations } from "../../../../../plugins/store";

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

const useWrap = (elm: HTMLElement) => {
  const lineHeight = parseInt(getComputedStyle(elm).lineHeight);
  const height = parseInt(String(elm.getBoundingClientRect().height));

  return height > 1.5 * lineHeight;
};

const labelRef = ref<HTMLElement>();
let wrap = ref(false);

onMounted(() => {
  const elm = labelRef.value;
  if (elm) {
    wrap.value = useWrap(elm);
  }
});

// TODO need to sync default value to store at the beginning

const store = useStore();

const handleInput = function () {
  store.commit(Mutations.UPDATE_ELEMENT_PROPS, {
    path: props.name,
    value: props.defaultValue,
  });
};
</script>

<style scoped>
.enable-wrap.el-space > :deep(.el-space__item):last-child {
  width: 100%;
}
</style>
