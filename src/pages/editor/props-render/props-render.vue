<template>
  <SchemaRender v-if="schema" :schema="schema"></SchemaRender>
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
    required: true,
  },
});

const schema = computed(
  () => props.descriptor && descritpor2Schema(props.descriptor)
);
</script>
