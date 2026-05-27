import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "http";

const TOTAL_MAPS = 200;

type MockStat = {
    id: number;
    position: number;
    user_id: number;
    username: string;
    map_id: number;
    mapname: string;
    record_time: number;
    record_date: number;
    team: number;
    status: number;
};

const MAP_NAMES = [
    "ctf_Ash", "ctf_B2b", "ctf_Blade", "ctf_Cobra", "ctf_Death",
    "ctf_Dropdown", "ctf_Equinox", "ctf_Flagstone", "ctf_Ghosttown", "ctf_Hook",
    "htf_Ash", "htf_Barrack", "htf_Daybreak", "htf_Goldpit", "htf_Neons",
    "inf_Abel", "inf_Arox", "inf_Baire", "inf_CompleteCamp", "inf_Darkness",
];

function generateStats(users: { id: number; username: string }[]): MockStat[] {
    const stats: MockStat[] = [];
    let id = 1;
    const now = Date.now();

    for (let mapIdx = 0; mapIdx < MAP_NAMES.length; mapIdx++) {
        const mapname = MAP_NAMES[mapIdx]!;
        const mapId = mapIdx + 1;
        const shuffled = [...users].sort(() => Math.sin(mapIdx * 7 + 1) - 0.5);
        const count = Math.min(shuffled.length, 10 + (mapIdx % 6));

        for (let pos = 0; pos < count; pos++) {
            const user = shuffled[pos]!;
            const baseTime = 8000 + mapIdx * 1200;
            const recordTime = baseTime + pos * 600 + Math.floor(Math.abs(Math.sin(id * 13)) * 500);
            const recordDate = now - Math.floor(Math.abs(Math.sin(id * 7)) * 1.2e10) - pos * 3600000;

            stats.push({
                id: id++,
                position: pos + 1,
                user_id: user.id,
                username: user.username,
                map_id: mapId,
                mapname,
                record_time: recordTime,
                record_date: recordDate,
                team: 0,
                status: 1,
            });
        }
    }

    return stats.sort((a, b) => b.record_date - a.record_date);
}

type MockEvent = {
    id: number;
    type: 1 | 3;
    map_id: number;
    mapname: string;
    user_id: number;
    username: string;
    medal: 1 | 2 | 3;
    event_date: number;
};

function generateEvents(users: { id: number; username: string }[]): MockEvent[] {
    const events: MockEvent[] = [];
    const now = Date.now();

    for (let i = 0; i < 300; i++) {
        const userIdx = Math.floor(Math.abs(Math.sin(i * 17)) * users.length);
        const mapIdx = Math.floor(Math.abs(Math.sin(i * 11)) * MAP_NAMES.length);
        const user = users[userIdx]!;
        const type: 1 | 3 = i % 3 === 0 ? 3 : 1;
        const medal = ((Math.floor(Math.abs(Math.sin(i * 5)) * 3)) + 1) as 1 | 2 | 3;

        events.push({
            id: i + 1,
            type,
            map_id: mapIdx + 1,
            mapname: MAP_NAMES[mapIdx]!,
            user_id: user.id,
            username: user.username,
            medal,
            event_date: now - Math.floor(Math.abs(Math.sin(i * 3)) * 1.2e10),
        });
    }

    return events.sort((a, b) => b.event_date - a.event_date);
}

type MockUser = {
    id: number;
    rank: number;
    username: string;
    clan_id: number | null;
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
        const unique_caps = Math.floor(Math.random() * (TOTAL_MAPS - 5)) + 1;
        const total_caps = unique_caps + Math.floor(Math.random() * 300);
        const gold = Math.floor(Math.random() * 80);
        const silver = Math.floor(Math.random() * 200);
        const bronze = Math.floor(Math.random() * 350);
        const no_medal = total_caps - gold - silver - bronze;
        // Assign country/clan deterministically so they don't change on hot-reload
        const country_id = (Math.floor(Math.abs(Math.sin(i * 7 + 1)) * COUNTRY_COUNT) % COUNTRY_COUNT) + 1;
        const clan_id = Math.abs(Math.sin(i * 11)) > 0.4
            ? (Math.floor(Math.abs(Math.sin(i * 13)) * CLAN_COUNT) % CLAN_COUNT) + 1
            : null;

        return {
            id: i + 1,
            rank: i + 1,
            username,
            country_id,
            clan_id,
            passed: Math.round((unique_caps / TOTAL_MAPS) * 100),
            unique_caps,
            total_caps,
            hardest: Math.floor(Math.random() * 30),
            gold,
            silver,
            bronze,
            no_medal: Math.max(0, no_medal),
            maps_created: Math.floor(Math.random() * 8),
            playtime: Math.floor(Math.random() * 5_000_000) + 50_000,
            created_at: Date.now() - Math.floor(Math.random() * 5e11),
            last_active_at: Date.now() - Math.floor(Math.random() * 5e9),
        };
    });
}

const mockUsers = generate();
const mockStats = generateStats(mockUsers);
const mockEvents = generateEvents(mockUsers);
const mockClans = generateClans(mockUsers);
const mockCountries = generateCountries(mockUsers);

type MockClan = {
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

function generateClans(users: { id: number; username: string }[]): MockClan[] {
    const clanDefs = [
        { name: "Arctic Wolves",   tag: "AW"  },
        { name: "BladeRunners",    tag: "BR"  },
        { name: "CryptoForce",     tag: "CF"  },
        { name: "Dark Matter",     tag: "DM"  },
        { name: "Echo Squad",      tag: "ES"  },
        { name: "Frost Hunters",   tag: "FH"  },
        { name: "Ghost Protocol", tag: "GP"  },
        { name: "HyperNova",       tag: "HN"  },
        { name: "Iron Legion",     tag: "IL"  },
        { name: "Jade Phoenix",    tag: "JP"  },
        { name: "Kraken Crew",     tag: "KC"  },
        { name: "LunarStrike",     tag: "LS"  },
        { name: "Midnight Ops",    tag: "MO"  },
        { name: "Nova Battalion",  tag: "NB"  },
        { name: "Omega Squad",     tag: "OS"  },
        { name: "Pixel Raiders",   tag: "PR"  },
        { name: "Quantum Force",   tag: "QF"  },
        { name: "RavenClaw",       tag: "RC"  },
        { name: "ShadowPact",      tag: "SP"  },
        { name: "Titan Guard",     tag: "TG"  },
        { name: "UltraVoid",       tag: null  },
        { name: "Vortex Team",     tag: "VT"  },
        { name: "WarpGate",        tag: "WG"  },
        { name: "Xenon Division",  tag: "XD"  },
        { name: "Yellow Jacket",   tag: "YJ"  },
        { name: "Zero Gravity",    tag: "ZG"  },
        { name: "Apex Predators",  tag: "AP"  },
        { name: "Binary Storm",    tag: "BS"  },
        { name: "Cobalt Strike",   tag: "CS"  },
        { name: "Delta Force",     tag: "DF"  },
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
            id: i + 1,
            clanname: def.name,
            tag: def.tag,
            owner: users[ownerIdx]?.id ?? null,
            members: null,
            unique_caps,
            total_caps,
            maps_created: Math.floor(Math.abs(Math.sin(seed * 13)) * memberCount * 3),
            hardest: Math.floor(Math.abs(Math.sin(seed * 19)) * 30),
            gold,
            silver,
            bronze,
            users_count: memberCount,
        };
    });
}

type MockCountry = {
    id: number;
    countryname: string;
    unique_caps: number;
    total_caps: number;
    maps_created: number;
    hardest: number;
    gold: number;
    silver: number;
    bronze: number;
    users_count: number;
};

function generateCountries(users: { id: number; username: string }[]): MockCountry[] {
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
            id: i + 1,
            countryname: name,
            unique_caps,
            total_caps,
            maps_created: Math.floor(Math.abs(Math.sin(seed * 13)) * playerCount * 4),
            hardest: Math.floor(Math.abs(Math.sin(seed * 19)) * 30),
            gold,
            silver,
            bronze,
            users_count: playerCount,
        };
    });
}

// ── Shared helpers ─────────────────────────────────────────────────────────

type SortKey = "unique_caps" | "hardest" | "gold";

function sortUsers(users: MockUser[], sort: string): MockUser[] {
    const key = (["unique_caps", "hardest", "gold"].includes(sort) ? sort : "unique_caps") as SortKey;
    return [...users].sort((a, b) => b[key] - a[key]);
}

type ActivityType = "records" | "golds" | "silvers" | "bronzes";

const ACTIVITY_STAT: Record<ActivityType, keyof MockUser> = {
    records: "unique_caps",
    golds:   "gold",
    silvers: "silver",
    bronzes: "bronze",
};

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

function sendJson(res: ServerResponse, status: number, body: unknown) {
    const json = JSON.stringify(body);
    res.writeHead(status, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    res.end(json);
}

export function mockApiPlugin(): Plugin {
    return {
        name: "mock-api",
        configureServer(server) {
            server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
                if (!req.url) return next();

                const { URL } = require("url") as typeof import("url");
                const url = new URL(req.url, "http://localhost");

                // GET /stats
                if (url.pathname === "/stats" && req.method === "GET") {
                    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
                    const pageSize = Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "30"));
                    const search = (url.searchParams.get("search") ?? "").toLowerCase();

                    const filtered = search
                        ? mockStats.filter((s) => s.username.toLowerCase().includes(search))
                        : mockStats;

                    const total = filtered.length;
                    const totalPages = Math.max(1, Math.ceil(total / pageSize));
                    const data = filtered.slice((page - 1) * pageSize, page * pageSize);

                    return sendJson(res, 200, { data, meta: { total, totalPages, page, pageSize } });
                }

                // GET /events
                if (url.pathname === "/events" && req.method === "GET") {
                    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
                    const pageSize = Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "30"));
                    const search = (url.searchParams.get("search") ?? "").toLowerCase();

                    const filtered = search
                        ? mockEvents.filter((e) => e.username.toLowerCase().includes(search))
                        : mockEvents;

                    const total = filtered.length;
                    const totalPages = Math.max(1, Math.ceil(total / pageSize));
                    const data = filtered.slice((page - 1) * pageSize, page * pageSize);

                    return sendJson(res, 200, { data, meta: { total, totalPages, page, pageSize } });
                }

                // GET /users
                if (url.pathname === "/users" && req.method === "GET") {
                    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
                    const pageSize = Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "20"));
                    const search = (url.searchParams.get("search") ?? "").toLowerCase();
                    const sort = url.searchParams.get("sort") ?? "unique_caps";
                    const countryIdParam = url.searchParams.get("countryId");
                    const countryId = countryIdParam ? parseInt(countryIdParam) : null;

                    let filtered = mockUsers;

                    if (countryId) {
                        filtered = filtered.filter((u) => u.country_id === countryId);
                    }

                    if (search) {
                        filtered = filtered.filter((u) =>
                            u.username.toLowerCase().includes(search)
                        );
                    }

                    const sorted = sortUsers(filtered, sort).map((u, i) => ({
                        ...u,
                        rank: i + 1,
                    }));

                    const total = sorted.length;
                    const totalPages = Math.max(1, Math.ceil(total / pageSize));
                    const data = sorted.slice((page - 1) * pageSize, page * pageSize);

                    return sendJson(res, 200, { data, meta: { total, totalPages, page, pageSize } });
                }

                // GET /users/by-username/:username
                const byUsernameMatch = url.pathname.match(/^\/users\/by-username\/(.+)$/);
                if (byUsernameMatch && req.method === "GET") {
                    const username = decodeURIComponent(byUsernameMatch[1]);
                    const user = mockUsers.find(
                        (u) => u.username.toLowerCase() === username.toLowerCase()
                    );
                    if (!user) return sendJson(res, 404, { message: "User not found" });

                    const rankBy = (key: SortKey) =>
                        [...mockUsers]
                            .sort((a, b) => b[key] - a[key])
                            .findIndex((u) => u.id === user.id) + 1;

                    const data = {
                        ...user,
                        placement: {
                            records: rankBy("unique_caps"),
                            hardest: rankBy("hardest"),
                            golds: rankBy("gold"),
                        },
                    };
                    return sendJson(res, 200, { data });
                }

                // GET /users/:id/stats
                const userStatsMatch = url.pathname.match(/^\/users\/(\d+)\/stats$/);
                if (userStatsMatch && req.method === "GET") {
                    const id = parseInt(userStatsMatch[1]!);
                    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
                    const pageSize = Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "30"));
                    const search = (url.searchParams.get("search") ?? "").toLowerCase();

                    let filtered = mockStats.filter((s) => s.user_id === id);
                    if (search) filtered = filtered.filter((s) => s.mapname.toLowerCase().includes(search));

                    const total = filtered.length;
                    const totalPages = Math.max(1, Math.ceil(total / pageSize));
                    const data = filtered.slice((page - 1) * pageSize, page * pageSize);
                    return sendJson(res, 200, { data, meta: { total, totalPages, page, pageSize } });
                }

                // GET /users/:id/events
                const userEventsMatch = url.pathname.match(/^\/users\/(\d+)\/events$/);
                if (userEventsMatch && req.method === "GET") {
                    const id = parseInt(userEventsMatch[1]!);
                    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
                    const pageSize = Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "30"));
                    const search = (url.searchParams.get("search") ?? "").toLowerCase();

                    let filtered = mockEvents.filter((e) => e.user_id === id);
                    if (search) filtered = filtered.filter((e) => e.mapname.toLowerCase().includes(search));

                    const total = filtered.length;
                    const totalPages = Math.max(1, Math.ceil(total / pageSize));
                    const data = filtered.slice((page - 1) * pageSize, page * pageSize);
                    return sendJson(res, 200, { data, meta: { total, totalPages, page, pageSize } });
                }

                // GET /users/:id/activity?type=records|golds|silvers|bronzes
                const activityMatch = url.pathname.match(/^\/users\/(\d+)\/activity$/);
                if (activityMatch && req.method === "GET") {
                    const id = parseInt(activityMatch[1]);
                    const user = mockUsers.find((u) => u.id === id);
                    if (!user) return sendJson(res, 404, { message: "User not found" });

                    const rawType = url.searchParams.get("type") ?? "records";
                    const validTypes: ActivityType[] = ["records", "golds", "silvers", "bronzes"];
                    const type: ActivityType = validTypes.includes(rawType as ActivityType) ? (rawType as ActivityType) : "records";
                    const statKey = ACTIVITY_STAT[type];
                    const total = user[statKey] as number;
                    const data = generateActivityData(total, user.id + Object.keys(ACTIVITY_STAT).indexOf(type) * 1000);
                    return sendJson(res, 200, { data });
                }

                // GET /users/:id
                const byIdMatch = url.pathname.match(/^\/users\/(\d+)$/);
                if (byIdMatch && req.method === "GET") {
                    const id = parseInt(byIdMatch[1]);
                    const user = mockUsers.find((u) => u.id === id);
                    if (user) return sendJson(res, 200, { data: user });
                    return sendJson(res, 404, { message: "User not found" });
                }

                // GET /clans
                if (url.pathname === "/clans" && req.method === "GET") {
                    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
                    const pageSize = Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "20"));
                    const search = (url.searchParams.get("search") ?? "").toLowerCase();
                    const sort = url.searchParams.get("sort") ?? "unique_caps";

                    let filtered = mockClans;
                    if (search) {
                        filtered = filtered.filter(
                            (c) =>
                                c.clanname.toLowerCase().includes(search) ||
                                (c.tag?.toLowerCase().includes(search) ?? false)
                        );
                    }

                    const key = (["unique_caps", "hardest", "gold"].includes(sort) ? sort : "unique_caps") as SortKey;
                    const sorted = [...filtered].sort((a, b) => b[key] - a[key]);

                    const total = sorted.length;
                    const totalPages = Math.max(1, Math.ceil(total / pageSize));
                    const data = sorted.slice((page - 1) * pageSize, page * pageSize);

                    return sendJson(res, 200, { data, meta: { total, totalPages, page, pageSize } });
                }

                // GET /countries
                if (url.pathname === "/countries" && req.method === "GET") {
                    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
                    const pageSize = Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "20"));
                    const search = (url.searchParams.get("search") ?? "").toLowerCase();
                    const sort = url.searchParams.get("sort") ?? "unique_caps";

                    let filtered = mockCountries;
                    if (search) {
                        filtered = filtered.filter((c) =>
                            c.countryname.toLowerCase().includes(search)
                        );
                    }

                    const key = (["unique_caps", "hardest", "gold"].includes(sort) ? sort : "unique_caps") as SortKey;
                    const sorted = [...filtered].sort((a, b) => b[key] - a[key]);

                    const total = sorted.length;
                    const totalPages = Math.max(1, Math.ceil(total / pageSize));
                    const data = sorted.slice((page - 1) * pageSize, page * pageSize);

                    return sendJson(res, 200, { data, meta: { total, totalPages, page, pageSize } });
                }

                next();
            });
        },
    };
}
