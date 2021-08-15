<template>
  <div class="block" :class="statusClasses" @click.stop="handleSelect">
    <slot />
    <!-- TODO： need a better way because this will prevent children scenario -->
    <span class="modal" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import { Store, useStore } from "vuex";
import type { State } from "../../../plugins/store";
import { Mutations } from "../../../plugins/store";

const store: Store<State> = useStore();

const statusClasses = computed(() => ({
  "drag-bound": false,
  "select-status": store.state.selectPaths.indexOf(props.path) === 0,
}));

const props = defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },

  path: {
    type: String as PropType<string>,
    required: true,
  },
});

function handleSelect() {
  store.commit(Mutations.CLEAR_SELECTS);
  store.commit(Mutations.SELECT, props);
}
</script>

<style scoped>
.block {
  position: relative;
}
.drag-bound {
  border-bottom: 2px solid rgb(125, 239, 125);
}

.select-status {
  outline: 1px dashed blue;
}

.modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
