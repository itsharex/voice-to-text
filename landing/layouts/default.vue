<template>
  <v-app>
    <AppHeader />
    <v-main>
      <div class="page">
        <slot />
      </div>
    </v-main>
    <AppFooter />
  </v-app>
</template>
