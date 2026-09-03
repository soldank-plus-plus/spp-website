export type ClanCreator = {
    id: number;
    username: string;
};

// Hand-written until the backend's FindAllClansDto lands in the generated
// schemas; the shape mirrors what GET /clans returns.
export type Clan = {
    id: number;
    clanname: string;
    tag: string | null;
    gold: number | null;
    silver: number | null;
    bronze: number | null;
    uniqueCaps: number | null;
    totalCaps: number | null;
    mapsCreated: number | null;
    hardest: number | null;
    creators: ClanCreator[];
    usersCount: number;
};
