<template>
  <div>Elm 4</div>
  <slot></slot>
</template>

<script lang="ts">
export default {
  name: 'elm-4',
  setup() {
    console.log('elm-4 setup');

    console.log('elm-4 onBeforeMount')

    console.log('elm-4 onMounted')

    console.log('elm-4 onBeforeUpdate')

    console.log('elm-4 onUpdated')

    console.log('elm-4 onBeforeUnmount')

    console.log('elm-4 onUnmounted')

    console.log('elm-4 onErrorCaptured')

    console.log('elm-4 onRenderTracked')

    console.log('elm-4 onRenderTriggered')
  }
}
</script>
