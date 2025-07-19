import { ImageObject } from "./ImageObject.model";

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: ImageObject[];
  followers: { total: number };
  country: string;
  product: string;
}

/**
 * Spotify only provides full artist details from the `/artists` endpoint.
 */
export interface Artist {
  id: string;
  name: string;
  href: string;
  external_urls: { spotify: string };
  uri: string;
  type: string;
}

export interface ArtistDetails extends Artist {
  genres: string[];
  popularity: number;
  followers: { total: number };
  images: ImageObject[];
}

export interface MultipleArtistDetails {
  artists: ArtistDetails[]
}

export interface Album {
  id: string;
  name: string;
  images: ImageObject[];
  release_date: string;
}

export interface TrackDetails {
  added_at: string;
  track: {
    id: string;
    name: string;
    artists: Artist[];
    album: Album;
    duration_ms: number;
    preview_url: string | null;
  }
}

export interface Paging<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}