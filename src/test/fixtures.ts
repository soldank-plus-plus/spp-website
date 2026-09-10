import type { Clan } from "@/types/clan";
import type { Map } from "@/types/map";
import type { User } from "@/types/user";

// Fixtures derive from the generated dtos, so a schema change breaks the
// tests rather than letting them keep asserting against a shape the backend
// stopped sending
export const makeUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    username: "player",
    clanId: null,
    countryId: null,
    gold: 0,
    silver: 0,
    bronze: 0,
    noMedal: 0,
    uniqueCaps: 0,
    totalCaps: 0,
    mapsCreated: 0,
    hardest: 0,
    playtime: 0,
    createdAt: null,
    lastActiveAt: null,
    passed: 0,
    ...overrides,
});

export const makeClan = (overrides: Partial<Clan> = {}): Clan => ({
    id: 1,
    clanname: "clan",
    tag: null,
    gold: 0,
    silver: 0,
    bronze: 0,
    uniqueCaps: 0,
    totalCaps: 0,
    mapsCreated: 0,
    hardest: 0,
    creators: [],
    usersCount: 0,
    ...overrides,
});

export const makeMap = (overrides: Partial<Map> = {}): Map => ({
    id: 1,
    mapname: "kamikaze",
    date: null,
    anticoop: null,
    jets: null,
    m79: null,
    nade: null,
    switch: null,
    coop: null,
    m79c: null,
    hardest: null,
    creators: [],
    recordsCount: 0,
    ...overrides,
});
