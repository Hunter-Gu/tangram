<template>
  <SchemaRender :schema="schema" />
</template>

<script lang="ts" setup>
import SchemaRender from "./components/schema-render";
import schema from "./examples/schema";
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
