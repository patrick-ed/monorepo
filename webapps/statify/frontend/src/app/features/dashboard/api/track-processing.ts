import { catchError, forkJoin, map, Observable, of, startWith, tap } from "rxjs";
import { Error, Loading, Result, Status, Success } from "../../../core/models/result.model";
import { Artist, ArtistDetails, MultipleArtistDetails, Paging, TrackDetails } from "../../../core/models/spotify.model";
import { ApiService } from "../../../core/services/spotify/api.service";
import { Injectable } from "@angular/core";
import { GenreLink as GenreLink } from "../../../core/d3/interfaces";
import { link } from "d3";

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

    public condenseGenres(artistDetails: ArtistDetails[]): string[][] {
        const genres: string[][] = []
        artistDetails.forEach(artist => {
            if (artist.genres.length > 1) {
                genres.push(artist.genres)
            }

        })
        return genres
    }

    public linkGenres(genreGroups: string[][]): GenreLink[] {
        const genreLinks: GenreLink[] = []
        genreGroups.forEach(genreGroup =>
            genreLinks.push(...this.connectNodes([], genreGroup))
        )
        return genreLinks
    }

    public connectNodes(genreLinks: GenreLink[] = [], genreGroup: string[]): GenreLink[] {
        var srcNode = genreGroup.pop()!!;
        var srcPointer = genreGroup.length - 1;

        if (genreGroup.length >= 2) {
            for (var i = srcPointer; i >= 0; i--) {

                var trgNode = genreGroup[i]
                const link: GenreLink = {
                    source: srcNode,
                    target: trgNode,
                    lineWeight: 1
                }
                genreLinks.push(link)
            }
        }

        if (genreGroup.length != 1) {
            this.connectNodes(genreLinks, genreGroup)
        }
        return genreLinks

    }
}

