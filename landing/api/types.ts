/**
 * Стандартная обёртка ответа бэкенда
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Информация о поддерживаемом языке
 */
export interface LanguageInfo {
  code: string;
  name: string;
  country_code: string;
}

/**
 * Ответ эндпоинта /api/v1/languages/nova3
 */
export interface Nova3LanguagesData {
  model: string;
  languages: LanguageInfo[];
}
