import { ImageObject } from "./ImageObject.model";
import {GenreGraphData} from '../d3/interfaces';

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: ImageObject[];
  followers: { total: number };
  country: string;
  product: string;
}

export interface UserData {
  userProfile: UserProfile;
  topTracks: TrackDetails[];
  topArtists: Artist[];
  genreGraphData: GenreGraphData;
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

export interface TrackAnalysis {
  trackName: string;
  sections: Section[];
  segments: Segment[];

}

export interface Section {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
}
export interface Segment {
  start: number;
  duration: number;
  confidence: number;
  loudness_start: number;
  loudness_max: number;
  loudness_max_time: number;
  loudness_end: number;
  pitches: number[];
  timbre: number[];

}

export interface TrackAnalysisDetails {}

export interface Paging<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}
