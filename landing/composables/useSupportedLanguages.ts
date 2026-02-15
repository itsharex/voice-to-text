import { useApiClient } from "~/api";
import { LanguagesRepository } from "~/api/repositories";
import type { LanguageInfo } from "~/api/types";

/**
 * Composable для получения списка поддерживаемых языков nova-3.
 * Использует useAsyncData — данные загружаются на сервере (SSR),
 * секция рендерится сразу и не вызывает CLS.
 */
export function useSupportedLanguages() {
  const client = useApiClient();
  const repo = new LanguagesRepository(client);

  const { data: languages, status } = useAsyncData(
    "supported-languages",
    async () => {
      const data = await repo.getNova3Languages();

      // Убираем дубликаты по country_code (оставляем первый — обычно базовый вариант)
      const seen = new Set<string>();
      return data.languages.filter((lang) => {
        if (seen.has(lang.country_code)) return false;
        seen.add(lang.country_code);
        return true;
      });
    },
    {
      default: () => [] as LanguageInfo[],
    }
  );

  const loading = computed(() => status.value === "pending");

  return { languages, loading };
}
