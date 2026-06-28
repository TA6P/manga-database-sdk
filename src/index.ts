export * from "./types.ts";
import type {
  BaseCharacterData,
  Chapter,
  CharacterInfoSpec,
  MangaEntry,
  MangaProvider,
  Page,
} from "./types";
import ky, { type KyInstance } from "ky";

export default class MangaDatabaseSDK {
  private api: KyInstance;
  private malApi: KyInstance;

  constructor(
    private readonly baseDatabaseUrl: string,
    private readonly baseMalUrl: string,
    private readonly timeout = 10_000,
    private readonly retryLimit = 5,
    private readonly backOffLimit = 3000,
  ) {
    this.api = ky.create({
      baseUrl: this.baseDatabaseUrl,
      timeout: this.timeout,
      retry: {
        limit: this.retryLimit,
        methods: ["get", "post"],
        backoffLimit: this.backOffLimit,
      },
    });
    this.malApi = ky.create({
      baseUrl: baseMalUrl,
      timeout: this.timeout,
      retry: {
        limit: this.retryLimit,
        methods: ["get", "post"],
        backoffLimit: this.backOffLimit,
      },
    });
  }

  async downloadPages(pageUrl: string): Promise<Uint8Array> {
    const url = new URL(`https://atsu.moe/${pageUrl}`);

    const response = await this.api.get(url).then((r) => r.bytes());

    return response;
  }

  async fetchPages(chapterId: string): Promise<Page[]> {
    const url = new URL(`/pages/${chapterId}`, this.baseDatabaseUrl);

    const response = await this.api
      .get<{ data: Page[] }>(url)
      .then((r) => r.json());

    return response.data;
  }

  async fetchChapters(chapterId: string, providerId: number): Promise<Chapter[]> {
    const url = new URL(`/chapters/${chapterId}/${providerId}`, this.baseDatabaseUrl);

    const response = await this.api
      .get<{ data: Chapter[] }>(url)
      .then((r) => r.json());

    return response.data;
  }

  async fetchProvider(mangaId: string): Promise<MangaProvider> {
    const url = new URL(`/bestProvider/${mangaId}`, this.baseDatabaseUrl);

    const response = await this.api
      .get<{ data: MangaProvider }>(url)
      .then((r) => r.json());

    return response.data;
  }

  async fetchTop({
    sortBy,
    page,
    pageSize,
  }: {
    sortBy: string[];
    page?: number;
    pageSize?: number;
  }): Promise<MangaEntry[]> {
    const url = new URL("/top", this.baseDatabaseUrl);

    url.searchParams.set("sort_by", sortBy.join(","));
    if (page) url.searchParams.set("page", page.toString());
    if (pageSize) url.searchParams.set("page_size", pageSize.toString());

    const response = await this.api
      .get<{ data: MangaEntry[] }>(url)
      .then((r) => r.json());

    return response.data;
  }

  async fetchCharacters(malId: number): Promise<BaseCharacterData[]> {
    const url = new URL(`/manga/${malId}/characters`, this.baseMalUrl);

    const response = await this.malApi
      .get<{ data: BaseCharacterData[] }>(url)
      .then((r) => r.json());

    return response.data;
  }

  async fetchCharacterInfoSpecs(
    characterMalId: number,
  ): Promise<CharacterInfoSpec[]> {
    const url = new URL(`/characters/${characterMalId}/full`, this.baseMalUrl);

    const response = await this.malApi
      .get<{ data: CharacterInfoSpec[] }>(url)
      .then((r) => r.json());

    return response.data;
  }
}
