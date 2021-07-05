<template>
  <v-container :fluid="true" class="no-padding">
    <v-row no-gutters class="height-100">
      <v-col cols="2"> 1 </v-col>

      <v-col cols="32">
        <v-card class="height-100">auto</v-card>
      </v-col>

      <v-col cols="2"> 2 </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup></script>

<style scoped>
.no-padding {
  padding: 0;
}
.height-100 {
  height: 100vh;
}
</style>
