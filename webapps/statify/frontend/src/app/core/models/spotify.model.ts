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

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: ImageObject[];
}

export interface Album {
  id: string;
  name: string;
  images: ImageObject[];
  release_date: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  preview_url: string | null;
}

export interface PagingObject<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}