<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <v-chip color="primary" variant="outlined">
    {{ label }}
  </v-chip>
</template>
