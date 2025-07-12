import { Injectable } from '@angular/core';
import { Artist, ArtistDetails } from '../../models/spotify.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }



  // public getArtistIds(artists: Artist[]): string[] {
  //   return ["a"]
  // }

  public getDistinctArtists(artists: Artist[]) {
    const distinctArtists: { [key: string]: Artist } = {};
    artists.forEach(artist => {
      if (!(artist.id in distinctArtists)) {
        distinctArtists[artist.id] = artist;
      }
    });
    return Object.values(distinctArtists);
  }

  public getDetailedArtists() {

  }

  public countOccurences<T extends string>(item: T, dictionary: { [key: string]: number }) {

    if (!(item in dictionary)) {
      dictionary[item] = 1;
    }
    else {
      dictionary[item] += 1;
    }
  }
}
