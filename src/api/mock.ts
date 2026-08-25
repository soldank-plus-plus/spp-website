import type { ApiResponse } from "./client";

const TOTAL_MAPS = 200;

const MAP_NAMES = [
    "mc_1octagon", "mc_1cube", "mc_1pentagon", "mc_1ebuc",
    "ctf_Ash", "ctf_B2b", "ctf_Blade", "ctf_Cobra", "ctf_Death",
    "ctf_Dropdown", "ctf_Equinox", "ctf_Flagstone", "ctf_Ghosttown", "ctf_Hook",
    "htf_Ash", "htf_Barrack", "htf_Daybreak", "htf_Goldpit", "htf_Neons",
    "inf_Abel", "inf_Arox", "inf_Baire", "inf_CompleteCamp", "inf_Darkness",
];

const HARDEST_MAP_NAMES = [
    "mc_1octagon", "mc_1cube", "mc_1pentagon", "mc_1ebuc",
    "ctf_Ash", "ctf_B2b", "ctf_Blade", "ctf_Cobra", "ctf_Death",
    "ctf_Dropdown", "ctf_Equinox", "ctf_Flagstone", "ctf_Ghosttown", "ctf_Hook",
    "htf_Ash", "htf_Barrack", "htf_Daybreak", "htf_Goldpit", "htf_Neons",
    "inf_Abel", "inf_Arox", "inf_Baire", "inf_CompleteCamp", "inf_Darkness",
    "ctf_Kampf", "ctf_Legend", "ctf_Maze", "ctf_Nerve", "ctf_Orbit",
    "ctf_Peak", "ctf_Quest", "ctf_Rage", "ctf_Storm", "ctf_Titan",
    "htf_Echo", "htf_Flare", "htf_Grotto", "htf_Haven", "htf_Impact",
    "inf_Ember", "inf_Forge", "inf_Glacial", "inf_Hollow", "inf_Ironwall",
    "ctf_Ub3r", "ctf_Venom", "ctf_Wrath", "ctf_Xroads", "ctf_Yavin",
    "ctf_Zenith", "htf_Jinn", "htf_Krypt", "htf_Lancer", "htf_Midway",
];

type SortKey = "unique_caps" | "hardest" | "gold" | "maps_created";

type MockUser = {
    id: number; rank: number; username: string; country_id: number | null;
    clan_id: number | null; passed: number; unique_caps: number; total_caps: number;
    hardest: number; gold: number; silver: number; bronze: number;
    no_medal: number; maps_created: number; playtime: number;
    created_at: number; last_active_at: number;
};

type MockMap = {
    id: number; mapname: string; user_id: string; date: number;
    anticoop: number; jets: number; m79: number; nade: number;
    switch: number; coop: number; m79c: number; hardest: number; records_count: number;
};

type MockStat = {
    id: number; position: number; user_id: number; username: string;
    map_id: number; mapname: string; record_time: number; record_date: number;
    team: number; status: number;
};

type MockEvent = {
    id: number; type: 1 | 3; map_id: number; mapname: string;
    user_id: number; username: string; medal: 1 | 2 | 3; event_date: number;
};

type MockClan = {
    id: number; clanname: string; tag: string | null; owner: number | null;
    members: string | null; unique_caps: number; total_caps: number;
    maps_created: number; hardest: number; gold: number; silver: number;
    bronze: number; users_count: number;
};

type MockCountry = {
    id: number; countryname: string; unique_caps: number; total_caps: number;
    maps_created: number; hardest: number; gold: number; silver: number;
    bronze: number; users_count: number;
};

type ActivityType = "records" | "golds" | "silvers" | "bronzes";

const ACTIVITY_STAT: Record<ActivityType, keyof MockUser> = {
    records: "unique_caps",
    golds: "gold",
    silvers: "silver",
    bronzes: "bronze",
};

function generate(): MockUser[] {
    const names = [
        "Aqualord", "Blaze", "CryoHawk", "DarkStorm", "Echostrike",
        "FrostViper", "GhostRun", "HailBolt", "IcePeak", "JoltRider",
        "KineticX", "LunarEdge", "MireSniper", "NovaPulse", "OmegaFist",
        "PhantomArc", "QuasarBolt", "RavenMark", "ShadowLance", "TitanForce",
        "UltraWave", "VoidSlash", "WarpBlade", "XenonRift", "YellowHaze",
        "ZeroGrav", "ApexHunter", "BinaryFox", "ColdNight", "DriftKing",
        "EliteOne", "FluxCore", "GrimReaper", "HoloShot", "InfraRed",
        "JadeFang", "KryptoX", "LightYear", "MegaVolt", "NightCrawler",
        "OmegaZero", "PixelBurst", "QuantumX", "RedNova", "SkyDagger",
        "ToxicByte", "UltraZone", "VenomByte", "WidowMaker", "XtremePeak",
        "YoloSnipe", "ZapMaster", "ArcticWolf", "BlackMamba", "CrimsonEdge",
        "DeepSpace", "ElectraX", "FireBreath", "GlitchHunt", "HyperCore",
        "IronFist", "JoltPeak", "KamikazeX", "LiquidFire", "MegaStrike",
        "NeonGhost", "OverkillX", "PlasmaBolt", "QuickSilver", "RocketMan",
        "SteelWing", "TurboFly", "UltraKill", "VortexX", "WindBreaker",
        "XtremeRun", "YoloRush", "ZeroFox", "AlphaSnipe", "BlazeRun",
        "CobraByte", "DarkWave", "EliteHawk", "FluxWing", "GhostBlade",
        "HyperVolt", "IceBolt", "JadeStrike", "KryptoFang", "LunarHunter",
        "MechWarrior", "NovaBolt", "OmegaHawk", "PixelShot", "QuantumRift",
        "RavenEdge", "SkyHunter", "TitanBolt", "UltraFang", "VoidHawk",
        "WarpShot", "XenonBlade", "YellowBolt", "ZeroEdge", "ArcticFox",
    ];
    const COUNTRY_COUNT = 30;
    const CLAN_COUNT = 30;
    return names.map((username, i) => {
        const unique_caps = Math.floor(Math.abs(Math.sin(i * 3 + 1)) * (TOTAL_MAPS - 5)) + 1;
        const total_caps = unique_caps + Math.floor(Math.abs(Math.sin(i * 5 + 2)) * 300);
        const gold = Math.floor(Math.abs(Math.sin(i * 7 + 3)) * 80);
        const silver = Math.floor(Math.abs(Math.sin(i * 11 + 4)) * 200);
        const bronze = Math.floor(Math.abs(Math.sin(i * 13 + 5)) * 350);
        const country_id = (Math.floor(Math.abs(Math.sin(i * 7 + 1)) * COUNTRY_COUNT) % COUNTRY_COUNT) + 1;
        const clan_id = Math.abs(Math.sin(i * 11)) > 0.4
            ? (Math.floor(Math.abs(Math.sin(i * 13)) * CLAN_COUNT) % CLAN_COUNT) + 1
            : null;
        return {
            id: i + 1, rank: i + 1, username, country_id, clan_id,
            passed: Math.round((unique_caps / TOTAL_MAPS) * 100),
            unique_caps, total_caps,
            hardest: Math.floor(Math.abs(Math.sin(i * 17 + 6)) * 30),
            gold, silver, bronze,
            no_medal: Math.max(0, total_caps - gold - silver - bronze),
            maps_created: Math.floor(Math.abs(Math.sin(i * 23 + 5)) * 15),
            playtime: Math.floor(Math.abs(Math.sin(i * 29 + 7)) * 5_000_000) + 50_000,
            created_at: Date.now() - Math.floor(Math.abs(Math.sin(i * 31 + 8)) * 5e11),
            last_active_at: Date.now() - Math.floor(Math.abs(Math.sin(i * 37 + 9)) * 5e9),
        };
    });
}

function generateMaps(users: MockUser[]): MockMap[] {
    const now = Date.now();
    const threeYears = 3 * 365 * 24 * 3600 * 1000;
    const ids = HARDEST_MAP_NAMES.map((_, i) =>
        300 + i * 103 + Math.floor(Math.abs(Math.sin(i * 7 + 3)) * 80)
    ).sort((a, b) => a - b);
    return HARDEST_MAP_NAMES.map((mapname, i) => {
        const id = ids[i]!;
        const authorIdx = Math.floor(Math.abs(Math.sin(i * 31 + 7)) * users.length);
        const author = users[authorIdx]!;
        const ageFraction = 1 - id / (ids[ids.length - 1]! + 1);
        return {
            id, mapname, user_id: author.username,
            date: now - Math.floor(ageFraction * threeYears),
            anticoop: Math.round(Math.abs(Math.sin(i * 3))) as 0 | 1,
            jets: Math.round(Math.abs(Math.sin(i * 5))) as 0 | 1,
            m79: Math.round(Math.abs(Math.sin(i * 7))) as 0 | 1,
            nade: Math.round(Math.abs(Math.sin(i * 9))) as 0 | 1,
            switch: Math.round(Math.abs(Math.sin(i * 11))) as 0 | 1,
            coop: Math.round(Math.abs(Math.sin(i * 17))) as 0 | 1,
            m79c: Math.round(Math.abs(Math.sin(i * 19))) as 0 | 1,
            hardest: i + 1,
            records_count: 5 + Math.floor(Math.abs(Math.sin(i * 37 + 3)) * 95),
        };
    });
}

function generateStats(users: MockUser[], mapIdLookup: Map<string, number>): MockStat[] {
    const stats: MockStat[] = [];
    let id = 1;
    const now = Date.now();
    for (let mapIdx = 0; mapIdx < MAP_NAMES.length; mapIdx++) {
        const mapname = MAP_NAMES[mapIdx]!;
        const mapId = mapIdLookup.get(mapname) ?? mapIdx + 1;
        const shuffled = [...users].sort(() => Math.sin(mapIdx * 7 + 1) - 0.5);
        const count = Math.min(shuffled.length, 10 + (mapIdx % 6));
        for (let pos = 0; pos < count; pos++) {
            const user = shuffled[pos]!;
            const baseTime = 8000 + mapIdx * 1200;
            const recordTime = baseTime + pos * 600 + Math.floor(Math.abs(Math.sin(id * 13)) * 500);
            const recordDate = now - Math.floor(Math.abs(Math.sin(id * 7)) * 1.2e10) - pos * 3600000;
            stats.push({
                id: id++, position: pos + 1, user_id: user.id, username: user.username,
                map_id: mapId, mapname, record_time: recordTime, record_date: recordDate,
                team: 0, status: 1,
            });
        }
    }
    return stats.sort((a, b) => b.record_date - a.record_date);
}

function generateEvents(users: MockUser[], mapIdLookup: Map<string, number>): MockEvent[] {
    const events: MockEvent[] = [];
    const now = Date.now();
    for (let i = 0; i < 300; i++) {
        const userIdx = Math.floor(Math.abs(Math.sin(i * 17)) * users.length);
        const mapIdx = Math.floor(Math.abs(Math.sin(i * 11)) * MAP_NAMES.length);
        const user = users[userIdx]!;
        const mapname = MAP_NAMES[mapIdx]!;
        const type: 1 | 3 = i % 3 === 0 ? 3 : 1;
        const medal = ((Math.floor(Math.abs(Math.sin(i * 5)) * 3)) + 1) as 1 | 2 | 3;
        events.push({
            id: i + 1, type, map_id: mapIdLookup.get(mapname) ?? mapIdx + 1,
            mapname, user_id: user.id, username: user.username, medal,
            event_date: now - Math.floor(Math.abs(Math.sin(i * 3)) * 1.2e10),
        });
    }
    return events.sort((a, b) => b.event_date - a.event_date);
}

function generateClans(users: MockUser[]): MockClan[] {
    const clanDefs = [
        { name: "Arctic Wolves", tag: "AW" }, { name: "BladeRunners", tag: "BR" },
        { name: "CryptoForce", tag: "CF" }, { name: "Dark Matter", tag: "DM" },
        { name: "Echo Squad", tag: "ES" }, { name: "Frost Hunters", tag: "FH" },
        { name: "Ghost Protocol", tag: "GP" }, { name: "HyperNova", tag: "HN" },
        { name: "Iron Legion", tag: "IL" }, { name: "Jade Phoenix", tag: "JP" },
        { name: "Kraken Crew", tag: "KC" }, { name: "LunarStrike", tag: "LS" },
        { name: "Midnight Ops", tag: "MO" }, { name: "Nova Battalion", tag: "NB" },
        { name: "Omega Squad", tag: "OS" }, { name: "Pixel Raiders", tag: "PR" },
        { name: "Quantum Force", tag: "QF" }, { name: "RavenClaw", tag: "RC" },
        { name: "ShadowPact", tag: "SP" }, { name: "Titan Guard", tag: "TG" },
        { name: "UltraVoid", tag: null }, { name: "Vortex Team", tag: "VT" },
        { name: "WarpGate", tag: "WG" }, { name: "Xenon Division", tag: "XD" },
        { name: "Yellow Jacket", tag: "YJ" }, { name: "Zero Gravity", tag: "ZG" },
        { name: "Apex Predators", tag: "AP" }, { name: "Binary Storm", tag: "BS" },
        { name: "Cobalt Strike", tag: "CS" }, { name: "Delta Force", tag: "DF" },
    ];
    return clanDefs.map((def, i) => {
        const memberCount = 3 + (i % 8);
        const seed = i + 1;
        const unique_caps = Math.floor(Math.abs(Math.sin(seed * 17)) * (TOTAL_MAPS * memberCount * 0.4)) + memberCount * 3;
        const total_caps = unique_caps + Math.floor(Math.abs(Math.sin(seed * 5)) * 800);
        const gold = Math.floor(Math.abs(Math.sin(seed * 3)) * memberCount * 25);
        const silver = Math.floor(Math.abs(Math.sin(seed * 7)) * memberCount * 60);
        const bronze = Math.floor(Math.abs(Math.sin(seed * 11)) * memberCount * 100);
        const ownerIdx = (i * 3) % users.length;
        return {
            id: i + 1, clanname: def.name, tag: def.tag,
            owner: users[ownerIdx]?.id ?? null, members: null,
            unique_caps, total_caps,
            maps_created: Math.floor(Math.abs(Math.sin(seed * 13)) * memberCount * 3),
            hardest: Math.floor(Math.abs(Math.sin(seed * 19)) * 30),
            gold, silver, bronze, users_count: memberCount,
        };
    });
}

function generateCountries(): MockCountry[] {
    const countryNames = [
        "Poland", "Germany", "United States", "Brazil", "France",
        "Netherlands", "Sweden", "Finland", "Norway", "Denmark",
        "Canada", "Australia", "United Kingdom", "Russia", "Ukraine",
        "Czech Republic", "Slovakia", "Hungary", "Romania", "Serbia",
        "Italy", "Spain", "Portugal", "Turkey", "Israel",
        "South Korea", "Japan", "China", "Argentina", "Mexico",
    ];
    return countryNames.map((name, i) => {
        const playerCount = 2 + (i % 12);
        const seed = i + 100;
        const unique_caps = Math.floor(Math.abs(Math.sin(seed * 17)) * (TOTAL_MAPS * playerCount * 0.45)) + playerCount * 4;
        const total_caps = unique_caps + Math.floor(Math.abs(Math.sin(seed * 5)) * 1200);
        const gold = Math.floor(Math.abs(Math.sin(seed * 3)) * playerCount * 30);
        const silver = Math.floor(Math.abs(Math.sin(seed * 7)) * playerCount * 70);
        const bronze = Math.floor(Math.abs(Math.sin(seed * 11)) * playerCount * 120);
        return {
            id: i + 1, countryname: name, unique_caps, total_caps,
            maps_created: Math.floor(Math.abs(Math.sin(seed * 13)) * playerCount * 4),
            hardest: Math.floor(Math.abs(Math.sin(seed * 19)) * 30),
            gold, silver, bronze, users_count: playerCount,
        };
    });
}

function generateActivityData(total: number, seed: number): { day: string; count: number }[] {
    if (total === 0) return [];
    const today = new Date();
    const result: { day: string; count: number }[] = [];
    let placed = 0;
    for (let i = 0; i < 365 && placed < total; i++) {
        const rng = Math.abs(Math.sin(seed + i * 31) * 10000) % 1;
        if (rng > 0.72) {
            const count = Math.min(total - placed, Math.max(1, Math.floor(rng * 6)));
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            result.push({ day: d.toISOString().slice(0, 10), count });
            placed += count;
        }
    }
    return result;
}

function sortUsers(users: MockUser[], sort: string): MockUser[] {
    const key = (["unique_caps", "hardest", "gold", "maps_created"].includes(sort) ? sort : "unique_caps") as SortKey;
    return [...users].sort((a, b) => b[key] - a[key]);
}

const mockUsers = generate();
const mockMaps = generateMaps(mockUsers);
const mapIdLookup = new Map(mockMaps.map((m) => [m.mapname, m.id]));
const mockStats = generateStats(mockUsers, mapIdLookup);
const mockEvents = generateEvents(mockUsers, mapIdLookup);
const mockClans = generateClans(mockUsers);
const mockCountries = generateCountries();

function paginate<T>(items: T[], page: number, pageSize: number) {
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const data = items.slice((page - 1) * pageSize, page * pageSize);
    return { data, meta: { itemsPerPage: pageSize, totalItems, currentPage: page, totalPages } };
}

export function mockGet(pathname: string, params: Record<string, string>): ApiResponse<unknown> {
    const p = (key: string, fallback: string) =>
        key === "pageSize" ? (params["limit"] ?? params["pageSize"] ?? fallback) : (params[key] ?? fallback);
    const page = Math.max(1, parseInt(p("page", "1")));
    const pageSize = Math.max(1, parseInt(p("pageSize", "20")));
    const search = p("search", "").toLowerCase();
    const sort = p("sort", "unique_caps");

    if (pathname === "/stats") {
        const ps = Math.max(1, parseInt(p("pageSize", "30")));
        const filtered = search ? mockStats.filter((s) => s.username.toLowerCase().includes(search)) : mockStats;
        return paginate(filtered, page, ps);
    }

    if (pathname === "/events") {
        const ps = Math.max(1, parseInt(p("pageSize", "30")));
        const filtered = search ? mockEvents.filter((e) => e.username.toLowerCase().includes(search)) : mockEvents;
        return paginate(filtered, page, ps);
    }

    if (pathname === "/users") {
        const countryId = params["countryId"] ? parseInt(params["countryId"]) : null;
        let filtered = mockUsers;
        if (countryId) filtered = filtered.filter((u) => u.country_id === countryId);
        if (search) filtered = filtered.filter((u) => u.username.toLowerCase().includes(search));
        const sorted = sortUsers(filtered, sort).map((u, i) => ({ ...u, rank: i + 1 }));
        return paginate(sorted, page, pageSize);
    }

    const byUsernameMatch = pathname.match(/^\/users\/by-username\/(.+)$/);
    if (byUsernameMatch) {
        const username = decodeURIComponent(byUsernameMatch[1]!);
        const user = mockUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());
        if (!user) throw new Error("User not found");
        const rankBy = (key: SortKey) =>
            [...mockUsers].sort((a, b) => b[key] - a[key]).findIndex((u) => u.id === user.id) + 1;
        return { data: { ...user, placement: { records: rankBy("unique_caps"), hardest: rankBy("hardest"), golds: rankBy("gold") } } };
    }

    const userStatsMatch = pathname.match(/^\/users\/(\d+)\/stats$/);
    if (userStatsMatch) {
        const id = parseInt(userStatsMatch[1]!);
        const ps = Math.max(1, parseInt(p("pageSize", "30")));
        let filtered = mockStats.filter((s) => s.user_id === id);
        if (search) filtered = filtered.filter((s) => s.mapname.toLowerCase().includes(search));
        return paginate(filtered, page, ps);
    }

    const userEventsMatch = pathname.match(/^\/users\/(\d+)\/events$/);
    if (userEventsMatch) {
        const id = parseInt(userEventsMatch[1]!);
        const ps = Math.max(1, parseInt(p("pageSize", "30")));
        let filtered = mockEvents.filter((e) => e.user_id === id);
        if (search) filtered = filtered.filter((e) => e.mapname.toLowerCase().includes(search));
        return paginate(filtered, page, ps);
    }

    const activityMatch = pathname.match(/^\/users\/(\d+)\/activity$/);
    if (activityMatch) {
        const id = parseInt(activityMatch[1]!);
        const user = mockUsers.find((u) => u.id === id);
        if (!user) throw new Error("User not found");
        const rawType = p("type", "records");
        const validTypes: ActivityType[] = ["records", "golds", "silvers", "bronzes"];
        const type: ActivityType = validTypes.includes(rawType as ActivityType) ? (rawType as ActivityType) : "records";
        const statKey = ACTIVITY_STAT[type];
        const total = user[statKey] as number;
        return { data: generateActivityData(total, user.id + Object.keys(ACTIVITY_STAT).indexOf(type) * 1000) };
    }

    const userByIdMatch = pathname.match(/^\/users\/(\d+)$/);
    if (userByIdMatch) {
        const id = parseInt(userByIdMatch[1]!);
        const user = mockUsers.find((u) => u.id === id);
        if (!user) throw new Error("User not found");
        return { data: user };
    }

    if (pathname === "/clans") {
        let filtered = mockClans;
        if (search) filtered = filtered.filter((c) => c.clanname.toLowerCase().includes(search) || (c.tag?.toLowerCase().includes(search) ?? false));
        const key = (["unique_caps", "hardest", "gold"].includes(sort) ? sort : "unique_caps") as SortKey;
        const sorted = [...filtered].sort((a, b) => b[key] - a[key]);
        return paginate(sorted, page, pageSize);
    }

    const mapStatsMatch = pathname.match(/^\/maps\/(\d+)\/stats$/);
    if (mapStatsMatch) {
        const id = parseInt(mapStatsMatch[1]!);
        const ps = Math.max(1, parseInt(p("pageSize", "30")));
        const map = mockMaps.find((m) => m.id === id);
        if (!map) throw new Error("Map not found");
        const filtered = mockStats.filter((s) => s.mapname === map.mapname).sort((a, b) => a.position - b.position);
        return paginate(filtered, page, ps);
    }

    const mapEventsMatch = pathname.match(/^\/maps\/(\d+)\/events$/);
    if (mapEventsMatch) {
        const id = parseInt(mapEventsMatch[1]!);
        const ps = Math.max(1, parseInt(p("pageSize", "30")));
        const map = mockMaps.find((m) => m.id === id);
        if (!map) throw new Error("Map not found");
        const filtered = mockEvents.filter((e) => e.map_id === id).sort((a, b) => b.event_date - a.event_date);
        return paginate(filtered, page, ps);
    }

    const mapByIdMatch = pathname.match(/^\/maps\/(\d+)$/);
    if (mapByIdMatch) {
        const id = parseInt(mapByIdMatch[1]!);
        const map = mockMaps.find((m) => m.id === id);
        if (!map) throw new Error("Map not found");
        return { data: map };
    }

    if (pathname === "/maps") {
        const ps = Math.max(1, parseInt(p("pageSize", "50")));
        const filtered = search ? mockMaps.filter((m) => m.mapname.toLowerCase().includes(search)) : mockMaps;
        return paginate(filtered, page, ps);
    }

    if (pathname === "/countries") {
        let filtered = mockCountries;
        if (search) filtered = filtered.filter((c) => c.countryname.toLowerCase().includes(search));
        const key = (["unique_caps", "hardest", "gold"].includes(sort) ? sort : "unique_caps") as SortKey;
        const sorted = [...filtered].sort((a, b) => b[key] - a[key]);
        return paginate(sorted, page, pageSize);
    }

    throw new Error(`Mock: unhandled route ${pathname}`);
}
