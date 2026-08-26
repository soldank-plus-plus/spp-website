// Maps country names to ISO 3166-1 alpha-2 codes.
// The order matches the mock data country list (id 1 = Poland, id 2 = Germany, …).
const COUNTRY_ISO: Record<string, string> = {
    Poland: "PL",
    Germany: "DE",
    "United States": "US",
    Brazil: "BR",
    France: "FR",
    Netherlands: "NL",
    Sweden: "SE",
    Finland: "FI",
    Norway: "NO",
    Denmark: "DK",
    Canada: "CA",
    Australia: "AU",
    "United Kingdom": "GB",
    Russia: "RU",
    Ukraine: "UA",
    "Czech Republic": "CZ",
    Slovakia: "SK",
    Hungary: "HU",
    Romania: "RO",
    Serbia: "RS",
    Italy: "IT",
    Spain: "ES",
    Portugal: "PT",
    Turkey: "TR",
    Israel: "IL",
    "South Korea": "KR",
    Japan: "JP",
    China: "CN",
    Argentina: "AR",
    Mexico: "MX",
};

const COUNTRY_NAMES_ORDERED = Object.keys(COUNTRY_ISO);

function isoToEmoji(iso: string): string {
    // Each letter maps to a Unicode Regional Indicator Symbol (U+1F1E6 = 'A')
    return [...iso.toUpperCase()]
        .map((c) => String.fromCodePoint(0x1f1a5 + c.charCodeAt(0)))
        .join("");
}

export function getFlagByName(name: string): string {
    const iso = COUNTRY_ISO[name];
    return iso ? isoToEmoji(iso) : "";
}

export function getFlagById(id: number | null | undefined): string {
    if (!id) return "";
    const name = COUNTRY_NAMES_ORDERED[id - 1];
    return name ? getFlagByName(name) : "";
}
