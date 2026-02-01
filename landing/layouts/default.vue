<template>
  <v-app>
    <AppHeader />
    <SupportedLanguages />
    <v-main>
      <div>
        <slot />
      </div>
    </v-main>
    <AppFooter />
  </v-app>
</template>
