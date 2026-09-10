import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

export const SRC = join(process.cwd(), "src");

// The static scans below read the application's own source. The test support
// directories are skipped: the payload corpus is full of the very markup and
// api names those assertions look for
const SKIPPED = new Set(["test", "__tests__"]);

const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            return SKIPPED.has(entry) ? [] : walk(full);
        }
        return /\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)
            ? [full]
            : [];
    });

export interface SourceFile {
    path: string;
    relative: string;
    text: string;
}

export const appSources = (): SourceFile[] =>
    walk(SRC).map((path) => ({
        path,
        relative: path.replace(`${process.cwd()}/`, ""),
        text: readFileSync(path, "utf8"),
    }));

// Every line of app source matching a pattern, labelled with where it is, so
// a failing scan names the file rather than just the count
export const grepSources = (
    pattern: RegExp,
    sources: SourceFile[] = appSources()
): string[] =>
    sources.flatMap(({ relative, text }) =>
        text
            .split("\n")
            .map((line, index) => ({ line: line.trim(), number: index + 1 }))
            .filter(({ line }) => pattern.test(line))
            .map(({ line, number }) => `${relative}:${number}: ${line}`)
    );
