import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  

  public getArtistIds(){

  }

  public getDetailedArtists(){

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
