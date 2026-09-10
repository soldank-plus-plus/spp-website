// Map names and gamemode categories reach these paths straight from the
// ?name= and ?category= query params, so nothing here may be interpolated
// raw: a slash, a dot dot or a question mark in one of them would otherwise
// climb out of the mapviewer data directory or start a query string of its own

// encodeURIComponent throws URIError on a surrogate without its pair, which a
// truncated name from the api can easily contain, and an unhandled throw here
// would blank the page that is only trying to show a screenshot
const LONE_SURROGATE =
    /[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g;

// One name that has to stay one path segment, so an embedded slash is encoded
// rather than passed through as structure
// No map name or category is ever just dots, and there is no way to encode
// such a segment so that it stays literal: the url parser removes a dot
// segment whether it was written as "." or as "%2E". So the segment is
// replaced outright, and the request 404s instead of climbing a directory
const DOTS_ONLY = /^\.+$/;

export const encodeSegment = (value: string): string => {
    const cleaned = value.replace(LONE_SURROGATE, "�");

    return DOTS_ONLY.test(cleaned) ? "_" : encodeURIComponent(cleaned);
};

const isRealSegment = (segment: string) =>
    segment !== "" && segment !== "." && segment !== "..";

// The download builder names zip entries after the same relative paths it
// fetches. A ".." left in an entry name is a zip slip in whatever unpacks the
// archive, so the traversal segments are dropped from the name as well
export const normalizePath = (path: string): string =>
    path.split("/").filter(isRealSegment).join("/");

// A relative path the app assembles itself, where the slashes are real
// directory separators but the names between them still come from map data
export const encodePath = (path: string): string =>
    normalizePath(path).split("/").map(encodeSegment).join("/");

export const mapDataUrl = (category: string, path: string): string =>
    `/mapviewer/data/${encodeSegment(category)}/${encodePath(path)}`;

export const mapFileUrl = (category: string, mapname: string): string =>
    `/mapviewer/data/${encodeSegment(category)}/maps/${encodeSegment(mapname)}.pms`;

export const mapTextureUrl = (category: string, texture: string): string =>
    `/mapviewer/data/${encodeSegment(category)}/textures/${encodeSegment(texture)}`;

export const mapScreenshotUrl = (category: string, mapname: string): string =>
    `/mapviewer/screenshots/${encodeSegment(category)}_${encodeSegment(mapname)}.png`;

// The download attribute names the file the browser saves. Browsers drop path
// separators themselves, but a control character, a leading dot or a name long
// enough to hide its own extension still reach the save dialog
// eslint-disable-next-line no-control-regex
const UNSAFE_IN_FILENAME = /[/\\:*?"<>|\u0000-\u001f\u007f]/g;

export const safeFileName = (name: string): string => {
    const cleaned = name
        .replace(UNSAFE_IN_FILENAME, "_")
        .replace(/^[.\s]+/, "")
        .trim()
        .slice(0, 100);

    return cleaned === "" ? "map" : cleaned;
};
