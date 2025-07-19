export interface LoadTopItemsInput extends LoadItemsInput {
    timeRange: TopItemsTimeRange;
}

export interface LoadItemsInput {
    limit?: number;
    offset?: number;
}

export enum TopItemsTimeRange {
    SHORT_TERM = 'short_term',
    MEDIUM_TERM = 'medium_term',
    LONG_TERM = 'long_term',
}
