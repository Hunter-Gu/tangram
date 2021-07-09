<template>
  <SchemaRender :schema="schema"></SchemaRender>
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import { SchemaRender } from "../../../components";
import { descritpor2Schema } from "../transformer";
import type { Descriptor } from "../types/descriptor";

const props = defineProps({
  descriptor: {
    type: Object as PropType<Descriptor>,
    required: true,
  },
});

const schema = descritpor2Schema(props.descriptor);
</script>
