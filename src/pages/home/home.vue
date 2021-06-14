<template>
  <ul>
    <li v-for="route in routes" :key="route.path" v-show="route.component">
      <router-link :to="route.path">
        {{ route.name || route.path }}
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { routes } from "../../routes";
</script>
