import type { HttpClient } from "../http-client";
import type { ApiResponse, Nova3LanguagesData } from "../types";

/**
 * Репозиторий для работы с языками.
 * Инкапсулирует логику запросов к /languages эндпоинтам.
 */
export class LanguagesRepository {
  constructor(private readonly http: HttpClient) {}

  async getNova3Languages(): Promise<Nova3LanguagesData> {
    const response = await this.http.get<ApiResponse<Nova3LanguagesData>>(
      "/api/v1/languages/nova3"
    );
    return response.data;
  }
}
