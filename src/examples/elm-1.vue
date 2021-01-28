<template>
  <div>
    {{ name }} count: {{ count }}
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Elm-1",
  props: {
    name: {
      type: String,
      default: "Elm",
    },
  },
  setup(props) {
    const count = ref(0);

    const interval = setInterval(() => {
      if (count.value === 10) {
        clearInterval(interval);
        return;
      }
      count.value += 1;
    }, 1000);

    const logger = (...params: any[]) => {
      console.log(`Clicked ${props.name}! Paramteres`, ...params);
    };

    return {
      count,
      logger,
    };
  },
});
</script>

<style scoped></style>
