<template>
  <el-container class="height-100">
    <el-aside class="sidebar">Aside</el-aside>
    <el-container class="main-border">
      <el-main></el-main>
    </el-container>
    <el-aside class="sidebar">
      <!-- TODO need to fill -->
      <PropsRender :descriptor=""></PropsRender>
    </el-aside>
  </el-container>
</template>

<script lang="ts" setup>
import PropsRender from "../props-render";
</script>

<style scoped>
.height-100 {
  height: 100vh;
}
.main-border {
  border: 1px solid #ccc;
  border-width: 0 1px;
}
.sidebar {
  width: 250px !important;
  padding: 20px 10px;
}
</style>
