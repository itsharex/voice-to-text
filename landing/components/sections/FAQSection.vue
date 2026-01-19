<script setup lang="ts">
const { content } = useLandingContent();
const { t } = useI18n();
</script>

<template>
  <section id="faq" class="section anchor-offset">
    <v-container>
      <h2 class="text-h4 section-title">{{ t("nav.faq") }}</h2>
      <v-expansion-panels variant="accordion">
        <v-expansion-panel v-for="item in content.faq" :key="item.id">
          <v-expansion-panel-title>{{ item.question }}</v-expansion-panel-title>
          <v-expansion-panel-text>{{ item.answer }}</v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </section>
</template>
