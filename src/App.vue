<template>
  <SchemaRender :schema="schema" />
  <SchemaRender :schema="optionsAPILfecycle" />
  <SchemaRender :schema="setupAPILifecycle" />
</template>

<script lang="ts" setup>
import SchemaRender from "./components/schema-render";
import schema from "./examples/schema";
import optionsAPILfecycle from "./examples/options-api-lifecycle";
import setupAPILifecycle from './examples/setup-api-lifecycle';
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
