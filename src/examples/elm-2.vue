<template>
  <div>
    <div>Elm 2</div>
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  name: "Elm2",
  beforeCreate() {
    console.log("elm-2 before create");
  },
  created() {
    console.log("elm-2 created");
  },
  beforeMount() {
    console.log("elm-2 before mount");
  },
  beforeUpdate() {
    console.log("elm-2 before update");
  },
  updated() {
    console.log("elm-2 updated");
  },
  mounted() {
    console.log("elm-2 mounted");
  },
  beforeUnmount() {
    console.log("elm-2 before unmount");
  },
  unmounted() {
    console.log("elm-2 unmounted");
  },
};
</script>
