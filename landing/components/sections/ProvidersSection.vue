<script setup lang="ts">
import { providers } from "~/data/providers";

const { content } = useLandingContent();
const { t } = useI18n();

const items = computed(() =>
  providers.map((provider) =>
    content.value.providers.find((item) => item.id === provider.id)
  )
);
</script>

<template>
  <section id="providers" class="section anchor-offset">
    <v-container>
      <h2 class="text-h4 section-title">{{ t("nav.providers") }}</h2>
      <v-row class="ga-4">
        <v-col v-for="item in items" :key="item?.id" cols="12" md="4">
          <v-card class="pa-4" variant="outlined">
            <h3 class="text-h6 mb-2">{{ item?.name }}</h3>
            <p class="text-body-2">{{ item?.description }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
