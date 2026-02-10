<template>
  <v-chip size="small" variant="tonal" color="primary">
    revision #{{ store.revision }}
  </v-chip>
</template>

<script setup lang="ts">
import { useDemoStore } from '../demoStore';

const store = useDemoStore();
</script>
