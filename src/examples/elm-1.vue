<template>
  <div>
    Elm-1 count: {{count}}
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Elm-1',
  setup () {
    const count = ref(0);

    const interval = setInterval(() => {
      if (count.value === 10) {
        clearInterval(interval);
        return;
      }
      count.value += 1;
    }, 1000);

    return {
      count
    }
  }
})
</script>

<style scoped>

</style>
