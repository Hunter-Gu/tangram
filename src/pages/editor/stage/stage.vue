<template>
  <SchemaRender :schema="data" />
</template>

<script lang="ts" setup>
import type { Child, SchemaData } from "../../../core/parser/src/types/schema";
import { computed, defineProps } from "@vue/runtime-core";
import type { PropType } from "@vue/runtime-core";
import { SchemaRender } from "../../../components";
import Block from "../block";
import { PathManager } from "../../../plugins/utils/path-manager";

const props = defineProps({
  schema: {
    type: Object as PropType<SchemaData>,
    required: true,
  },
});

const data = computed(() => enhance(props.schema));

function enhance(schema: Child, path = ""): SchemaData {
  if (typeof schema === "string") {
    return schema as unknown as SchemaData;
  }

  return {
    ...schema,
    children: schema.children?.map((child, idx) => {
      const nodePath = PathManager.concat(
        path,
        PathManager.ChildrenPropName,
        idx
      );
      return enhanceBlock(enhance(child, nodePath), nodePath);
    }),
  };
}

function enhanceBlock(node: Child, path: string): Child {
  return {
    name: Block,
    __uuid: 0,
    children: [node],
    props: {
      name: node.name.name,
      path,
    },
  };
}
</script>
