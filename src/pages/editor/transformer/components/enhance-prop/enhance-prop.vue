<template>
  <el-space size="mini" spacer=":">
    <span>{{ label || name }}</span>
    <slot></slot>
  </el-space>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import type { ComponentProp } from "../../../types/component";

const props: ComponentProp = defineProps({
  name: {
    type: String as PropType<string>,
  },
  label: {
    type: String as PropType<string>,
  },
}); // TODO why props missing when add `as ComponentProp` at tail
</script>
