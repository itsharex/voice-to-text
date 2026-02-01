<script setup lang="ts">
const { languages, loading } = useSupportedLanguages();

const { t } = useI18n();
</script>

<template>
  <div v-if="!loading && languages.length > 0" class="supported-languages">
    <v-container class="supported-languages__container">
      <span class="supported-languages__label text-medium-emphasis">
        {{ t("languages.supported") }}
      </span>
      <div class="supported-languages__flags">
        <Icon
          v-for="lang in languages"
          :key="lang.code"
          :name="`circle-flags:${lang.country_code}`"
          class="supported-languages__flag"
          :title="lang.name"
        />
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.supported-languages {
  background: rgba(var(--v-theme-surface-variant), 0.08);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
  padding: 8px 0;
}

.supported-languages__container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.supported-languages__label {
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.supported-languages__flags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.supported-languages__flag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.supported-languages__flag:hover {
  transform: scale(1.3);
}

@media (max-width: 600px) {
  .supported-languages__container {
    flex-direction: column;
    gap: 6px;
  }

  .supported-languages__flags {
    gap: 4px;
  }

  .supported-languages__flag {
    width: 18px;
    height: 18px;
  }
}
</style>
