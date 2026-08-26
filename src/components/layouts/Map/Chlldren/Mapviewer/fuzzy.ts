function strChars(s: string): string[] {
    const list: Record<string, 1> = {};
    for (const ch of s) list[ch] = 1;
    return Object.keys(list);
}

function intersection(a: number[], b: number[]): number[] {
    const result: number[] = [];
    let ai = 0,
        bi = 0;
    while (ai < a.length && bi < b.length) {
        if (a[ai]! < b[bi]!) ai++;
        else if (a[ai]! > b[bi]!) bi++;
        else {
            result.push(a[ai++]!);
            bi++;
        }
    }
    return result;
}

export class FuzzySearch {
    private strings: string[] = [];
    private stringsLc: string[] = [];
    private dictionaries: Record<string, number[]> = {};

    constructor(strings?: string[]) {
        if (strings) this.addStrings(strings);
        for (const d in this.dictionaries)
            this.dictionaries[d]!.sort((a, b) => a - b);
    }

    addStrings(strings: string[]): void {
        strings.forEach((s) => this.addString(s));
    }

    addString(s: string): void {
        const lower = s.toLowerCase();
        const index = this.strings.length;
        this.strings.push(s);
        this.stringsLc.push(lower);
        for (const ch of strChars(lower)) {
            if (!this.dictionaries[ch]) this.dictionaries[ch] = [];
            this.dictionaries[ch]!.push(index);
        }
    }

    find(text: string): string[] {
        const lower = text.toLowerCase();
        const chars = strChars(lower);
        let empty = false;

        const dicts = chars.map(
            (ch) => this.dictionaries[ch] || ((empty = true), [] as number[])
        );
        if (empty || dicts.length === 0) return [];

        const strings = this.strings;
        const stringsLc = this.stringsLc;

        if (lower.length === 1) {
            const matches = dicts[0]!.map((i) => strings[i]!);
            matches.sort();
            return matches;
        }

        const re = new RegExp(lower.split("").join(".*"));
        const subset = dicts.slice(1).reduce(intersection, dicts[0]!);
        const numMatches = subset.filter((i) => re.test(stringsLc[i]!));

        numMatches.sort((a, b) => {
            const sa = stringsLc[a]!;
            const sb = stringsLc[b]!;
            const aa = +(sa.indexOf(lower) !== -1);
            const bb = +(sb.indexOf(lower) !== -1);
            return (
                bb - aa ||
                (strings[a]! < strings[b]! ? -1 : +(strings[a]! > strings[b]!))
            );
        });

        return numMatches.map((i) => strings[i]!);
    }
}
