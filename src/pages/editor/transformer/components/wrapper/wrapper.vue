<template>
  <el-space direction="vertical" size="large" alignment="left">
    <!-- TODO: add it to schema itself, so that it can sync to left rail easily -->
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
