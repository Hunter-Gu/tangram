<template>
  <SchemaRender :schema="schema" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SchemaRender from "./components/schema-render/schema-render";
import schema from "./examples/schema";

export default defineComponent({
  name: "App",
  components: {
    SchemaRender,
  },
  setup() {
    return {
      schema,
    };
  },
});
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
