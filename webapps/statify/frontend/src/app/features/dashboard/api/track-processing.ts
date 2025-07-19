import { catchError, forkJoin, map, Observable, of, startWith, tap } from "rxjs";
import { Error, Loading, Result, Status, Success } from "../../../core/models/result.model";
import { Artist, ArtistDetails, MultipleArtistDetails, Paging, TrackDetails } from "../../../core/models/spotify.model";
import { ApiService } from "../../../core/services/spotify/api.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TrackProcessing {

    private readonly ARTIST_CHUNK_LIMIT = 50;

    public fetchAllArtistIds(tracks: TrackDetails[]): Set<string> {
        const artistIds = new Set<string>
        tracks.forEach(track =>
            track.track.artists.forEach(artist =>
                artistIds.add(artist.id)
            )
        )
        return artistIds
    }

    public fetchAllArtistDetails(
        spotifyApiService: ApiService,
        artistIds: Set<string>
    ): Observable<Result<ArtistDetails[]>> {

        if (artistIds.size === 0) {
            return of(new Success([]));
        }
        const idsArray = [...artistIds];
        const chunks: string[][] = [];
        for (let i = 0; i < idsArray.length; i += this.ARTIST_CHUNK_LIMIT) {
            chunks.push(idsArray.slice(i, i + this.ARTIST_CHUNK_LIMIT));
        }

        const chunkObservables: Observable<MultipleArtistDetails>[] = chunks.map(chunk => {
            const idsString = chunk.join(',');
            return spotifyApiService.getArtistDetails(idsString);
        });

        if (chunkObservables.length === 0) {
            return of(new Success([]));
        }

        return forkJoin(chunkObservables).pipe(
            map(results => {
                const allArtists: ArtistDetails[] = results.flatMap(result => result.artists);
                return new Success(allArtists);
            }),
            startWith(new Loading()),
            catchError(error => {
                console.error("Failed to fetch artist details:", error);
                return of(new Error("An error occurred while fetching artist details."));
            })
        );
    }
}

