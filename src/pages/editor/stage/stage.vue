<template>
  <SchemaRender :schema="data" />
</template>

<script lang="ts" setup>
import type {
  Child,
  Component,
  SchemaData,
} from "../../../core/parser/src/types/schema";
import { computed, defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import { SchemaRender } from "../../../components";
import Block from "../block";

const props = defineProps({
  schema: {
    type: Object as PropType<SchemaData>,
    required: true,
  },
});

const data = computed(() => enhance(props.schema));

function enhance(schema: Child): SchemaData {
  if (typeof schema === "string") {
    return schema as unknown as SchemaData;
  }

  return {
    ...schema,
    children: schema.children?.map((child, idx) => {
      return enhanceBlock(enhance(child), idx);
    }),
  };
}

function enhanceBlock(node: Child, index: number): Child {
  return {
    name: Block,
    __uuid: 0,
    children: [node],
    props: {
      name: node.name.name,
      index,
    },
  };
}
</script>
