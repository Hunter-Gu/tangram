<template>
  <el-space direction="vertical" size="large" alignment="left">
    <el-input v-model="name" />
    <slot></slot>
  </el-space>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";

defineProps({
  name: String as PropType<string>,
});
</script>
