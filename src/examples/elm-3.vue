<template>
  <div>Elm 3</div>
</template>

<script lang="ts">
export default {
  name: "Elm3",
  beforeCreate() {
    console.log("elm-3 before create");
  },
  created() {
    console.log("elm-3 created");
  },
  beforeMount() {
    console.log("elm-3 before mount");
  },
  beforeUpdate() {
    console.log("elm-3 before update");
  },
  updated() {
    console.log("elm-3 updated");
  },
  mounted() {
    console.log("elm-3 mounted");
  },
  beforeUnmount() {
    console.log("elm-3 before unmount");
  },
  unmounted() {
    console.log("elm-3 unmounted");
  },
};
</script>
