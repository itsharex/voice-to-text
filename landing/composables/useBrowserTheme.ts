import { computed, watch } from "vue";
import { useThemeStore } from "~/stores/theme";

export const useBrowserTheme = () => {
  const themeStore = useThemeStore();
  const { $vuetifyTheme } = useNuxtApp();
  const theme = $vuetifyTheme || null;

  const applyTheme = (name: "light" | "dark") => {
    themeStore.setTheme(name, true);
    theme?.change?.(name);
  };

  const initTheme = () => {
    if (!process.client) return;
    const initialTheme = themeStore.getInitialTheme();
    themeStore.setTheme(initialTheme, false);
    theme?.change?.(initialTheme);

    if (process.client && !themeStore.userSelected) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (event: MediaQueryListEvent) => {
        if (!themeStore.userSelected) {
          themeStore.setTheme(event.matches ? "dark" : "light", false);
          theme?.change?.(themeStore.current);
        }
      };
      mediaQuery.addEventListener("change", handler);
    }
  };

  const toggleTheme = () => {
    applyTheme(themeStore.current === "dark" ? "light" : "dark");
  };

  watch(
    () => themeStore.current,
    (value) => {
      theme?.change?.(value);
    }
  );

  return {
    currentTheme: computed(() => themeStore.current),
    isDark: computed(() => themeStore.current === "dark"),
    initTheme,
    toggleTheme
  };
};
