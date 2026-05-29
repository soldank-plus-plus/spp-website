import type { RendererConfig } from "../render";

export const SPAWN_LABELS = [
    "General", "Alpha", "Bravo", "Charlie", "Delta",
    "Alpha Flag", "Bravo Flag", "Grenades", "Medkits", "Clusters",
    "Vest", "Flamer", "Berserker", "Predator", "Yellow Flag",
    "Rambo Bow", "Stat Gun",
];

export const HIGHLIGHT_LABELS = [
    "Normal", "Only Bullets Collide", "Only Players Collide", "No Collide",
    "Ice", "Deadly", "Bloody deadly", "Hurts", "Regenerates", "Lava",
    "Alpha Bullets", "Alpha Players", "Bravo Bullets", "Bravo Players",
    "Charlie Bullets", "Charlie Players", "Delta Bullets", "Delta Players",
    "Bouncy", "Explosive", "Hurt Flaggers", "Flagger Collides",
    "Non Flagger Collides", "Flag Collides", "Background", "Background Transition",
];

export const SIDEBAR_WIDTH = 256;

export const defaultConfig: RendererConfig = {
    background: true,
    scenery_back: true,
    scenery_middle: true,
    scenery_front: true,
    polygons: true,
    texture: true,
    wireframe: false,
    colliders: false,
    highlight: false,
    highlight_list: [],
    objects: true,
    objects_list: SPAWN_LABELS.map((_, i) => i),
};

export function escapeUrl(s: string): string {
    return s.replace(/#/g, "%23");
}
