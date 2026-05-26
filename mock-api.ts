import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "http";

// Total maps on the server — used to compute "passed" percentage
const TOTAL_MAPS = 200;

type MockUser = {
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

    return names.map((username, i) => {
        const unique_caps = Math.floor(Math.random() * (TOTAL_MAPS - 5)) + 1;
        const total_caps = unique_caps + Math.floor(Math.random() * 300);
        const gold = Math.floor(Math.random() * 80);
        const silver = Math.floor(Math.random() * 200);
        const bronze = Math.floor(Math.random() * 350);
        const no_medal = total_caps - gold - silver - bronze;

        return {
            id: i + 1,
            rank: i + 1,
            username,
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

                // GET /users
                if (url.pathname === "/users" && req.method === "GET") {
                    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
                    const pageSize = Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "20"));
                    const search = (url.searchParams.get("search") ?? "").toLowerCase();
                    const sort = url.searchParams.get("sort") ?? "unique_caps";

                    let filtered = mockUsers;

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

                next();
            });
        },
    };
}
