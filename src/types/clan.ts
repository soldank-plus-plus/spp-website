export type Clan = {
    id: number;
    clanname: string;
    tag: string | null;
    owner: number | null;
    members: string | null;
    unique_caps: number;
    total_caps: number;
    maps_created: number;
    hardest: number;
    gold: number;
    silver: number;
    bronze: number;
    users_count: number;
};
