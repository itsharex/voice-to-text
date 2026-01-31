<script setup lang="ts">
defineProps<{ title: string; description: string; icon: string }>();
</script>

<template>
  <v-card class="pa-4" variant="tonal">
    <v-icon :icon="icon" size="36" class="mb-3" />
    <h3 class="text-h6 mb-2">{{ title }}</h3>
    <p class="text-body-2">{{ description }}</p>
  </v-card>
</template>
