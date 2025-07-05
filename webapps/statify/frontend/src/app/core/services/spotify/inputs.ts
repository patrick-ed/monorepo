export interface LoadTopItemsInput {
    type: 'artists' | 'tracks';
    timeRange: 'short_term' | 'medium_term' | 'long_term';
    limit?: number;
    offset?: number;
}