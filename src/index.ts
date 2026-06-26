import type { Chapter, MangaEntry, MangaProvider, Page } from "./types";
import ky, { type KyInstance } from "ky";

export default class MangaDatabaseSDK {
  private api: KyInstance;

  constructor(
    private readonly baseUrl: string,
    private readonly timeout = 3_000,
    private readonly retryLimit = 5,
    private readonly backOffLimit = 3000,
  ) {
    this.api = ky.create({
      baseUrl: this.baseUrl,
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
    const url = new URL(`/pages/${chapterId}`, this.baseUrl);

    const response = await this.api
      .get<{ data: Page[] }>(url)
      .then((r) => r.json());

    return response.data;
  }

  async fetchChapters(providerId: string): Promise<Chapter[]> {
    const url = new URL(`/chapters/${providerId}`, this.baseUrl);

    const response = await this.api
      .get<{ data: Chapter[] }>(url)
      .then((r) => r.json());

    return response.data;
  }

  async fetchProvider(mangaId: string): Promise<MangaProvider> {
    const url = new URL(`/bestProvider/${mangaId}`, this.baseUrl);

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
    page: number;
    pageSize: number;
  }): Promise<MangaEntry[]> {
    const url = new URL("/top", this.baseUrl);

    url.searchParams.set("sort_by", sortBy.join(","));
    url.searchParams.set("page", page.toString());
    url.searchParams.set("page_size", pageSize.toString());

    const response = await this.api
      .get<{ data: MangaEntry[] }>(url)
      .then((r) => r.json());

    return response.data;
  }
}
