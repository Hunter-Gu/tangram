<template>
  <div>Elm 5</div>
</template>

<script lang="ts">
export default {
  name: "elm-5",
  setup() {
    console.log("elm-5 setup");

    console.log("elm-5 onBeforeMount");

    console.log("elm-5 onMounted");

    console.log("elm-5 onBeforeUpdate");

    console.log("elm-5 onUpdated");

    console.log("elm-5 onBeforeUnmount");

    console.log("elm-5 onUnmounted");

    console.log("elm-5 onErrorCaptured");

    console.log("elm-5 onRenderTracked");

    console.log("elm-5 onRenderTriggered");
  },
};
</script>
