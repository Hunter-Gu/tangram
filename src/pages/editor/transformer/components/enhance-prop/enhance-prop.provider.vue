<template>
  <enhance-prop v-bind="props" @update-props="handleInput" />
</template>

<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import { useStore } from "vuex";
import { Mutations } from "../../../../../plugins/store";
import EnhanceProp from "./enhance-prop.vue";
import { getComponentProps } from "./constants";
import { UpdateParams } from "./types";

const props = defineProps(getComponentProps());

const store = useStore();

function handleInput(params: UpdateParams) {
  store.commit(Mutations.UPDATE_ELEMENT_PROPS, params);
}
</script>
