function ordinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!);
}

// Record times come from the API as milliseconds, shown as m:ss.cc
export function formatRecordTime(ms: number): string {
    const totalCs = Math.floor(ms / 10);
    const cs = totalCs % 100;
    const totalSec = Math.floor(totalCs / 100);
    const sec = totalSec % 60;
    const min = Math.floor(totalSec / 60);
    return `${min}:${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export function formatPlaytime(ms: number): string {
    const hours = Math.floor(ms / 3_600_000);
    return `${hours.toLocaleString()}h`;
}

// 10:28:09 PM on 26th February 2015
export function formatFullDate(timestamp: number): string {
    const d = new Date(timestamp);
    const time = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    const day = ordinal(d.getDate());
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    return `${time} on ${day} ${month} ${year}`;
}

// 26/02/2015
export function formatNumericDate(timestamp: number): string {
    const d = new Date(timestamp);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// Feb 26, 2015
export function formatShortDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
