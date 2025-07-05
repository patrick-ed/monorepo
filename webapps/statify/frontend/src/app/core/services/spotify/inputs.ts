export interface LoadTopItemsInput {
    type: TopItemsType;
    timeRange: TopItemsTimeRange;
    limit?: number;
    offset?: number;
}

export enum TopItemsType {
    ARTISTS = 'artists',
    TRACKS = 'tracks',
}

export enum TopItemsTimeRange {
    SHORT_TERM = 'short_term',
    MEDIUM_TERM = 'medium_term',
    LONG_TERM = 'long_term',
}
