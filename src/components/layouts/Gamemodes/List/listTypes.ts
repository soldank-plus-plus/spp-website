import boostmodeImg from "@/assets/gamemodes/boostmode.png";
import capturetheflagImg from "@/assets/gamemodes/capturetheflag.png";
import climbImg from "@/assets/gamemodes/climb.png";
import comingsoonImg from "@/assets/gamemodes/comingsoon.jpg";
import hoverraceImg from "@/assets/gamemodes/hoverrace.png";
import portalImg from "@/assets/gamemodes/portal.png";
import questionmarkImg from "@/assets/gamemodes/questionmark.png";
import saveclimbImg from "@/assets/gamemodes/saveclimb.png";

export type GameStyle =
    | "custom"
    | "movement"
    | "objective"
    | "aim"
    | "shooting";

export type GamePlayers = "singleplayer" | "multiplayer";

export interface Game {
    // Matches the gamemode slugs the backend serves, and the /gamemodes/:slug
    // route. A mode without one has no page yet and its card stays inert
    slug?: string;
    title: string;
    description: string;
    image: string;
    // Filters on the gamemode list, a mode can belong to several styles
    styles: GameStyle[];
    players?: GamePlayers;
    // Detail page content, every link is skipped while its field is missing
    about?: string[];
    discordUrl?: string;
    tutorialUrl?: string;
    mappackUrl?: string;
    scriptUrl?: string;
    serverSetupUrl?: string;
}

export const games: Game[] = [
    {
        title: "Aimlab",
        description:
            "Training platform to help sharpen up your core aiming skills, similar to the Aimlabs game.",
        image: comingsoonImg,
        slug: "aimlab",
        styles: ["aim"],
        players: "singleplayer",
    },
    {
        title: "Boostmode",
        description:
            "Use speed-boosting weapons to reach the enemy base as quickly as possible.",
        image: boostmodeImg,
        slug: "boostmode",
        styles: [],
    },
    {
        title: "Capture The Flag",
        description:
            "The goal is for each team to steal the enemy's flag and bring it to your own base.",
        image: capturetheflagImg,
        slug: "capture-the-flag",
        styles: ["objective", "shooting"],
        players: "multiplayer",
    },
    {
        title: "Chase & Run",
        description:
            "Chasers must choose a weapon to eliminate the runners. Avoiding capture requires agility and map knowledge.",
        image: comingsoonImg,
        slug: "chase-and-run",
        discordUrl: "https://discord.gg/pPSguMQcyF",
        styles: ["movement"],
        players: "multiplayer",
    },
    {
        title: "Climb",
        description:
            "Main gamemode is based on passing various maps of difficulty with achieving faster times than other players.",
        image: climbImg,
        slug: "climb",
        styles: ["movement"],
        players: "singleplayer",
        about: [
            "The goal is to climb up to the flag and capture it. Some maps are equipped with deadly polygons, obstacles, bouncy polygons, teleports and other challenges. This mode requires good movement control, precise timing and knowledge of various trick jumps.",
            "Other variants of climb mode add unique mechanics such as weapon boosting, air-nade techniques or cooperation with another player.",
        ],
        discordUrl: "https://discord.gg/szCFTBdqC5",
        tutorialUrl: "https://www.youtube.com/watch?v=oNGk-Zgu-iw",
    },
    {
        title: "Deathmatch",
        description:
            "As the name implies, kill everything that moves. The player with the most frags wins the match.",
        image: comingsoonImg,
        slug: "deathmatch",
        styles: ["shooting"],
        players: "multiplayer",
    },
    {
        title: "Dodgeball",
        description:
            "Two teams face off in an arena with a ball. Once hit, you're out for the rest of the round.",
        image: comingsoonImg,
        slug: "dodgeball",
        discordUrl: "https://discord.gg/bdTNUZT",
        styles: ["custom", "aim"],
    },
    {
        title: "Hold The Flag",
        description:
            "The team that holds the yellow flag gets points every couple of seconds.",
        image: comingsoonImg,
        slug: "hold-the-flag",
        styles: ["objective"],
        players: "multiplayer",
    },
    {
        title: "Hoverrace",
        description:
            "The Minigun’s rapid backward-fired pellets generate strong recoil, causing significant backward momentum.",
        image: hoverraceImg,
        slug: "hoverrace",
        styles: ["movement"],
        players: "singleplayer",
    },
    {
        title: "Infiltration",
        description:
            "The goal of the Alpha team is to steal the black flag from Bravo team's base.",
        image: comingsoonImg,
        slug: "infiltration",
        styles: ["objective", "shooting"],
        players: "multiplayer",
    },
    {
        title: "JumpTestLong",
        description:
            "A two-team game mode where players must make long-distance jumps to reach the enemy base.",
        image: comingsoonImg,
        slug: "jumptestlong",
        styles: ["shooting"],
    },
    {
        title: "Last Stand",
        description:
            "The zombie apocalypse is here, and your goal is to eliminate the spawning zombie plagues as long as possible.",
        image: comingsoonImg,
        slug: "last-stand",
        discordUrl: "https://discord.gg/wEPVukU",
        styles: ["shooting"],
        players: "multiplayer",
    },
    {
        title: "Missile Tag",
        description:
            "A missile gets faster every second. Hit another player to pass it on before it catches you.",
        image: comingsoonImg,
        slug: "missile-tag",
        styles: ["aim"],
        players: "multiplayer",
    },
    {
        title: "Pirates vs Ninjas",
        description:
            "Pirates are armed with guns, while invisible Ninjas rely on health regeneration and the Combat Knife.",
        image: comingsoonImg,
        slug: "pirates-vs-ninjas",
        styles: ["objective", "shooting"],
        players: "multiplayer",
    },
    {
        title: "Pointmatch",
        description:
            "Similar to Hold The Flag mode, but it's deathmatch instead of team-based format.",
        image: comingsoonImg,
        slug: "pointmatch",
        styles: ["shooting"],
        players: "multiplayer",
    },
    {
        title: "Portal",
        description:
            "Inspired by the Portal game series, players solve puzzles using two linked portals.",
        image: portalImg,
        slug: "portal",
        styles: ["custom"],
        players: "singleplayer",
    },
    {
        title: "Prop Hunt",
        description:
            "The props are disguised as objects around the map and merge with the environment hiding from the hunter.",
        image: comingsoonImg,
        slug: "prop-hunt",
        styles: ["custom"],
        players: "multiplayer",
    },
    {
        title: "Rambomatch",
        description:
            "Similar to Deathmatch with one main tweak: Rambo Bow spawns at a set location on each map.",
        image: comingsoonImg,
        slug: "rambomatch",
        styles: ["shooting"],
        players: "multiplayer",
    },
    {
        title: "Runmode",
        description:
            "Fast-paced gamemode focused on speedrunning through custom maps and their routes, improving your movement.",
        image: comingsoonImg,
        slug: "runmode",
        styles: ["movement"],
        players: "singleplayer",
    },
    {
        title: "Save Climb",
        description:
            "This mode is just like the main climb gamemode, but you get 5 saves per map.",
        image: saveclimbImg,
        slug: "save-climb",
        styles: ["movement"],
        players: "singleplayer",
    },
    {
        title: "Teammatch",
        description:
            "Purpose is for each team to kill as many players as possible from the other teams.",
        image: comingsoonImg,
        slug: "teammatch",
        styles: ["shooting"],
        players: "multiplayer",
    },
    {
        title: "Volleyball",
        description:
            "A game mode similar to volleyball, where teams hit a ball back and forth trying to score on the opposing side.",
        image: comingsoonImg,
        slug: "volleyball",
        styles: ["custom"],
        players: "multiplayer",
    },
    {
        title: "Create gamemode",
        description:
            "Got an idea for a gamemode? Click here to learn how you can create your own.",
        image: questionmarkImg,
        // Every style, so the card stays in the grid whatever is filtered
        styles: ["custom", "movement", "objective", "aim", "shooting"],
    },
];

export const findGame = (slug: string | undefined): Game | undefined =>
    slug ? games.find((game) => game.slug === slug) : undefined;
