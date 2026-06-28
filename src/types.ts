export interface Page {
  id: string;
  number: number;
  width: number;
  height: number;
  url: string;
  aspectRatio: number;
}

export interface Chapter {
  id: string;
  chapter_number: number;
  title?: string;
  fetched_at: Date;
}

export interface MangaEntry {
  id: string;
  title: string;
  type: string;
  year?: number;
  anime?: string;
  rating?: number;
  status?: string;
  has_anime: boolean;
  description?: string;
  is_licensed: boolean;
  native_title?: string;
  content_rating: string;
  total_chapters?: string;
  last_updated_at: string;
  romanized_title?: string;
  popularity?: number;
  sources: SourceOrigin[];

  action_score?: number;
  normalized_action_score: number;
  romance_score?: number;
  slice_of_life_score?: number;

  tags: string[];
  links: string[];
  genres: string[];
  authors: string[];
  artists: string[];
  end_date?: string;
  start_date?: string;
  end_date_is_estimated?: boolean;
  start_date_is_estimated?: boolean;
  cover?: any;
}

export interface MangaProvider {
  id: number;
  provider_name: string;
  scanlator_name?: string;
  external_id: string;
  base_url: string;

  mangaEntryId: string;
}

export interface BaseCharacterData {
  role: string;
  character: {
    mal_id: number;
    url: string;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
      webp: {
        image_url: string;
      };
    };
  };
}

export interface CharacterInfoSpec {
  name: string;
  spoilers: string[];
  nicknames: string[];
  imageUrl: string;
  about: string;
}

export interface SourceOrigin {
  name: string;
  cover: string;
  id: string;
  rating: number;
  last_updated_at: Date;
  rating_normalized: number;
}
