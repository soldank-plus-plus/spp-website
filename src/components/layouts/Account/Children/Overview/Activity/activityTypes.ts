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

export function generateCalendar(): string[] {
    const today = new Date();
    const days: string[] = [];

    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
    }

    const remainder = days.length % 7;
    if (remainder > 0) days.splice(0, remainder);

    return days;
}

export function getColor(count: number, palette: string[]): string {
    if (count === 0) return palette[0];
    if (count < 3) return palette[1];
    if (count < 6) return palette[2];
    if (count < 10) return palette[3];
    return palette[4];
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
