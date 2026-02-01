<template>
  <v-app>
    <AppHeader />
    <v-main>
      <SupportedLanguages />
      <div>
        <slot />
      </div>
    </v-main>
    <AppFooter />
  </v-app>
</template>
