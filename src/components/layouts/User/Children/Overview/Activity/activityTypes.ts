export type ActivityFilter = "records" | "golds" | "silvers" | "bronzes";

export const FILTERS: { key: ActivityFilter; label: string }[] = [
    { key: "records", label: "Records" },
    { key: "golds", label: "Golds" },
    { key: "silvers", label: "Silvers" },
    { key: "bronzes", label: "Bronzes" },
];

export const PALETTE: Record<
    ActivityFilter,
    [string, string, string, string, string]
> = {
    records: ["#2a2a2a", "#14532d", "#15803d", "#16a34a", "#4ade80"],
    golds: ["#2a2a2a", "#FFD700", "#FFD700", "#FFD700", "#FFD700"],
    silvers: ["#2a2a2a", "#C0C0C0", "#C0C0C0", "#C0C0C0", "#C0C0C0"],
    bronzes: ["#2a2a2a", "#CD7F32", "#CD7F32", "#CD7F32", "#CD7F32"],
};

// A full year of squares, padded with empty cells so January starts the first
// column and the last week is complete
export function generateYear(year: number): string[] {
    const days: string[] = [];
    const date = new Date(Date.UTC(year, 0, 1));

    for (let i = 0; i < date.getUTCDay(); i++) days.push("");

    while (date.getUTCFullYear() === year) {
        days.push(date.toISOString().slice(0, 10));
        date.setUTCDate(date.getUTCDate() + 1);
    }

    while (days.length % 7 !== 0) days.push("");

    return days;
}

export function getColor(count: number, palette: string[]): string {
    const step =
        count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;

    return palette[step] ?? palette[palette.length - 1] ?? "transparent";
}

export function getMonthLabels(
    days: string[]
): { index: number; label: string }[] {
    const labels: { index: number; label: string }[] = [];
    days.forEach((day, i) => {
        const date = new Date(day);
        if (date.getDate() === 1) {
            labels.push({
                index: i,
                label: date.toLocaleString("default", { month: "short" }),
            });
        }
    });
    return labels;
}
