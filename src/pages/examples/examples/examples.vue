<template>
  <div class="examples">
    <SchemaRender :schema="schema" />
    <SchemaRender :schema="optionsAPILfecycle" />
    <SchemaRender :schema="setupAPILifecycle" />
  </div>
</template>

<script lang="ts" setup>
import SchemaRender from "../../../components/schema-render";
import schema from "../../../examples/schema";
import optionsAPILfecycle from "../../../examples/options-api-lifecycle";
import setupAPILifecycle from "../../../examples/setup-api-lifecycle";
</script>

<style scoped>
.examples {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
