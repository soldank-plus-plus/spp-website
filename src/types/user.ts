export type User = {
    id: number;
    rank: number;
    username: string;
    passed: number;
    points: number;
    hardest: number;
    gold: number;
    silver: number;
    bronze: number;
    todo_maps: string;
    created_at: number;
    last_active_at: number;
    avatar?: string | null;
    country?: string | null;
};
