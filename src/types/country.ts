// Hand-written until the backend's FindAllCountriesDto lands in the generated
// schemas; the shape mirrors what GET /countries returns.
export type Country = {
    id: number;
    countryname: string;
    code: string;
    gold: number | null;
    silver: number | null;
    bronze: number | null;
    uniqueCaps: number | null;
    totalCaps: number | null;
    mapsCreated: number | null;
    hardest: number | null;
    usersCount: number;
};
