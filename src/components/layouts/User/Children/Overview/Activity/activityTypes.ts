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

// The window ends on `endDay` (YYYY-MM-DD) instead of today, so a player whose
// activity is years old still gets a filled grid
export function generateCalendar(endDay?: string): string[] {
    const end = endDay ? new Date(`${endDay}T00:00:00Z`) : new Date();
    const days: string[] = [];

    for (let i = 364; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(end.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
    }

    const remainder = days.length % 7;
    if (remainder > 0) days.splice(0, remainder);

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
