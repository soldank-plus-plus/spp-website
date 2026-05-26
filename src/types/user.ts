export type ActivityDay = {
    day: string;
    count: number;
};

export type User = {
    id: number;
    rank: number;
    username: string;
    passed: number;
    unique_caps: number;
    total_caps: number;
    hardest: number;
    gold: number;
    silver: number;
    bronze: number;
    no_medal: number;
    maps_created: number;
    playtime: number;
    created_at: number;
    last_active_at: number;
};

export type AccountUser = User & {
    placement: {
        records: number;
        hardest: number;
        golds: number;
    };
};
