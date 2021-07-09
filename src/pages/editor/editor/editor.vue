<template>
  <el-container class="height-100">
    <el-aside width="200px">Aside</el-aside>
    <el-container class="main-border">
      <el-main></el-main>
    </el-container>
    <el-aside width="200px">Aside</el-aside>
  </el-container>
</template>

<script lang="ts" setup></script>

<style scoped>
.height-100 {
  height: 100vh;
}
.main-border {
  border: 1px solid #ccc;
  border-width: 0 1px;
}
</style>
