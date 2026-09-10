// Route ids address a database row, so only a plain positive integer is one.
// Number() on its own would also take "0x10", "1e3", "", " ", "Infinity" and
// "-1", each of which passes an isNaN check and then reaches the api as a
// lookup for something the url never asked for
const POSITIVE_INTEGER = /^[0-9]+$/;

export function parseRouteId(value: string | undefined): number | null {
    if (value === undefined || !POSITIVE_INTEGER.test(value)) return null;

    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}
