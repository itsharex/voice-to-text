<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { screenshots } from "~/data/screenshots";

const { t } = useI18n();
</script>

<template>
  <ClientOnly>
    <Swiper
      :modules="[A11y, Keyboard, Pagination]"
      :slides-per-view="1.1"
      :space-between="16"
      :grab-cursor="true"
      :keyboard="{ enabled: true }"
      :a11y="{ enabled: true }"
      :pagination="{ clickable: true }"
      :breakpoints="{
        640: { slidesPerView: 1.6 },
        960: { slidesPerView: 2.4 },
        1280: { slidesPerView: 3.2 }
      }"
    >
      <SwiperSlide v-for="shot in screenshots" :key="shot.id">
        <v-card class="pa-4 screenshot-card" variant="outlined">
          <div class="text-caption text-medium-emphasis">{{ t(shot.labelKey) }}</div>
          <img
            class="screenshot-image mt-4"
            :src="shot.src"
            :alt="t(shot.labelKey)"
            :width="shot.width"
            :height="shot.height"
            loading="lazy"
            decoding="async"
          />
        </v-card>
      </SwiperSlide>
    </Swiper>
    <template #fallback>
      <v-row class="ga-4" align="stretch">
        <v-col v-for="shot in screenshots" :key="shot.id" cols="12" md="6" lg="3">
          <v-card class="pa-4 screenshot-card" variant="outlined">
            <div class="text-caption text-medium-emphasis">{{ t(shot.labelKey) }}</div>
            <img
              class="screenshot-image mt-4"
              :src="shot.src"
              :alt="t(shot.labelKey)"
              :width="shot.width"
              :height="shot.height"
              loading="lazy"
              decoding="async"
            />
          </v-card>
        </v-col>
      </v-row>
    </template>
  </ClientOnly>
</template>

<style scoped>
.screenshot-card {
  height: 100%;
}

.screenshot-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  display: block;
}
</style>
