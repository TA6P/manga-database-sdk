export * from "./types.ts";
import type {
  BaseCharacterData,
  Chapter,
  CharacterInfoSpec,
  MangaEntry,
  MangaProvider,
  Page,
} from "./types";
import axios, { type AxiosInstance } from "axios";

export default class MangaDatabaseSDK {
  api: AxiosInstance;
  malApi: AxiosInstance;

  constructor(
    private readonly baseDatabaseUrl: string,
    private readonly baseMalUrl: string,
  ) {
    this.api = axios.create({
      baseURL: this.baseDatabaseUrl,
    });
    this.malApi = axios.create({
      baseURL: baseMalUrl,
    });
  }

  async downloadPages(pageUrl: string): Promise<Uint8Array> {
    const url = new URL(pageUrl, "https://atsu.moe");

    const { data: response } = await this.api.get(String(url));

    return response;
  }

  async fetchPages(chapterId: string, mangaId: string): Promise<Page[]> {
    const url = new URL(`/pages/${mangaId}/${chapterId}`);

    const { data: response } = await this.api.get<{ data: Page[] }>(
      String(url),
    );

    return response.data;
  }

  async fetchChapters(mangaId: string): Promise<Chapter[]> {
    const url = new URL(`/allChapters/${mangaId}`, this.baseDatabaseUrl);

    const { data: response } = await this.api.get<{ data: Chapter[][] }>(
      String(url),
    );

    const bestChapterCollection = response.data.sort(
      (a, b) => b.length - a.length,
    )[0]!;

    return bestChapterCollection;
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

    const { data: response } = await this.api.get<{ data: MangaEntry[] }>(
      String(url),
    );

    return response.data;
  }

  async fetchCharacters(malId: number): Promise<BaseCharacterData[]> {
    const url = new URL(`/manga/${malId}/characters`, this.baseMalUrl);

    const { data: response } = await this.malApi.get<{
      data: BaseCharacterData[];
    }>(String(url));

    return response.data;
  }

  async fetchCharacterInfoSpecs(
    characterMalId: number,
  ): Promise<CharacterInfoSpec> {
    const url = new URL(`/characters/${characterMalId}/full`, this.baseMalUrl);

    const { data: response } = await this.malApi.get<{
      data: CharacterInfoSpec;
    }>(String(url));

    return response.data;
  }
}
