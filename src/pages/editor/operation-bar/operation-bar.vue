<template>
  <el-button-group class="el-button-group">
    <el-button
      type="primary"
      icon="el-icon-refresh-left"
      :disabled="disableLeft"
      @click="emits('undo')"
    >
      撤销
    </el-button>
    <el-button
      type="primary"
      @click="emits('redo')"
      :disabled="disableRight"
    >
      重做
      <i class="el-icon-refresh-right el-icon--right" />
    </el-button>
  </el-button-group>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "@vue/runtime-core";

defineProps({
  disableLeft: {
    type: Boolean,
    default: true,
  },
  disableRight: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits({
  redo: () => true,
  undo: () => true,
});
</script>

<style>
.el-button-group {
  position: fixed;
  bottom: 0;
}
</style>
