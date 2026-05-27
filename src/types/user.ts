export type ActivityDay = {
    day: string;
    count: number;
};

export type User = {
    id: number;
    username: string;
    clan_id: number | null;
    gold: number;
    silver: number;
    bronze: number;
    no_medal: number;
    unique_caps: number;
    total_caps: number;
    maps_created: number;
    hardest: number;
    playtime: number;
    created_at: number;
    last_active_at: number;
    // computed by the API, not stored in DB
    rank?: number;
    passed?: number;
};

export type AccountUser = User & {
    placement: {
        records: number;
        hardest: number;
        golds: number;
    };
};
