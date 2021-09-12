<template>
  <!-- stop keyup event so it will not remove node when update the props -->
  <SchemaRender v-if="schema" :schema="schema" @keyup.stop="handleKeyup" />
</template>

<script lang="ts" setup>
import { computed, defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import { SchemaRender } from "../../../components";
import { descritpor2Schema } from "../transformer";
import type { PropsDescriptor } from "../types/descriptor";

const props = defineProps({
  descriptor: {
    type: [Object] as PropType<PropsDescriptor | null | undefined>,
    default: undefined,
    required: false,
  },
});

const schema = computed(
  () => props.descriptor && descritpor2Schema(props.descriptor)
);

const handleKeyup = () => {};
</script>
