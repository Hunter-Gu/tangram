<template>
  <SchemaRender :schema="data" />
</template>

<script lang="ts" setup>
import type { SchemaData } from "../../../core/parser/src/types/schema";
import { computed, defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import { SchemaRender } from "../../../components";
import { enhance } from "./enhance";

const props = defineProps({
  schema: {
    type: Object as PropType<SchemaData>,
    required: true,
  },
});

const data = computed(() => enhance(props.schema));
</script>
