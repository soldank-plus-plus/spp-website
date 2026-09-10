// A browser strips these before it reads the scheme, so "java\tscript:" and
// " javascript:" both have to be normalised away before anything is matched
// eslint-disable-next-line no-control-regex
const IGNORED = /[\u0000-\u0020\u00a0\u1680\u2000-\u200d\u2028\u2029\ufeff]/g;

const SCHEME = /^([a-z][a-z0-9+.-]*):/i;

const SAFE_SCHEMES = ["http", "https", "mailto"];

const schemeOf = (value: string): string | null => {
    const match = SCHEME.exec(value.replace(IGNORED, ""));
    return match ? match[1]!.toLowerCase() : null;
};

// A url is safe to put in an attribute when it is relative (so it can only
// ever stay on this origin) or carries a scheme that cannot execute. Anything
// with no scheme at all is relative, which is the common case here
export const isSafeUrl = (value: string): boolean => {
    const scheme = schemeOf(value);
    return scheme === null || SAFE_SCHEMES.includes(scheme);
};

// Returned in place of an unsafe url. An empty src makes the image fail to
// load, which is the same thing a wrong path already does
export const safeUrl = (value: string, fallback = ""): string =>
    isSafeUrl(value) ? value : fallback;
