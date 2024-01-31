export interface AggregatedData {
    aantal_spellen: number;
    aantal_spelers: number;
    api: ApiItem[];
}

export interface ApiItem {
    api: string;
    aantal: number;
}