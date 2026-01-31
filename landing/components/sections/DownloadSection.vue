<script setup lang="ts">
import { downloadAssets } from "~/data/downloads";

const { content } = useLandingContent();
const { t } = useI18n();
const downloadStore = useDownloadStore();

onMounted(() => downloadStore.init());
</script>

<template>
  <section id="download" class="section anchor-offset">
    <v-container>
      <h2 class="text-h4 section-title">{{ content.download.title }}</h2>
      <p class="text-body-2 mb-6">{{ content.download.note }}</p>
      <v-row class="ga-4">
        <v-col v-for="asset in downloadAssets" :key="asset.id" cols="12" md="4">
          <v-card
            class="pa-4"
            :variant="downloadStore.selectedId === asset.id ? 'tonal' : 'outlined'"
          >
            <h3 class="text-h6 mb-2">{{ asset.label }}</h3>
            <v-btn color="primary" :href="asset.url" @click="downloadStore.setSelected(asset.id)">
              {{ t("download.title") }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
