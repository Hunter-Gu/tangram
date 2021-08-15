<template>
  <el-space direction="vertical" size="large" alignment="left">
    <!-- TODO: add it to schema itself, so that it can sync to left rail easily -->
    <el-input v-model="instanceName" />
    <slot />
  </el-space>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";

const props = defineProps({
  wrapperName: {
    type: String as PropType<string>,
    default: "",
  },
});

const instanceName = ref(props.wrapperName);
</script>
