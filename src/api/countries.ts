import { legacyApiClient, ApiResponse } from "@/api/client";
import { Country } from "@/types/country";

export type CountrySortKey = "unique_caps" | "hardest" | "gold";

export interface GetCountriesParams {
    page: number;
    pageSize: number;
    search?: string;
    sort?: CountrySortKey;
    signal?: AbortSignal;
}

export interface GetCountriesResponse extends ApiResponse<Country[]> {
    meta: {
        totalPages: number;
        total: number;
        page: number;
        pageSize: number;
    };
}

export const countriesApi = {
    getCountries: async ({
        page,
        pageSize,
        search,
        sort,
        signal,
    }: GetCountriesParams): Promise<GetCountriesResponse> => {
        return legacyApiClient.get<Country[]>(
            "/countries",
            {
                page: String(page),
                pageSize: String(pageSize),
                ...(search && { search }),
                ...(sort && { sort }),
            },
            signal
        );
    },
};
