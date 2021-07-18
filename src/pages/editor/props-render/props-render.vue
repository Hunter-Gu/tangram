<template>
  <SchemaRender :schema="schema"></SchemaRender>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import { SchemaRender } from "../../../components";
import { descritpor2Schema } from "../transformer";
import type { PropsDescriptor } from "../types/descriptor";

const props = defineProps({
  descriptor: {
    type: [Object, null] as PropType<PropsDescriptor | null>,
    required: true,
  },
});

const schema = props.descriptor || descritpor2Schema(props.descriptor!);
</script>
