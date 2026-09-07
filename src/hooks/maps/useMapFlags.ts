import { useSearchParams } from "react-router-dom";

// Column name in the maps table paired with the name climbers use for it
export const MAP_FLAGS = [
    { key: "anticoop", label: "flag-throw" },
    { key: "jets", label: "jets" },
    { key: "m79", label: "m79" },
    { key: "nade", label: "nade" },
    { key: "switch", label: "switch" },
    { key: "coop", label: "coop" },
    { key: "m79c", label: "m79 coop" },
] as const;

export type MapFlag = (typeof MAP_FLAGS)[number]["key"];

const isMapFlag = (value: string): value is MapFlag =>
    MAP_FLAGS.some((flag) => flag.key === value);

export const useMapFlags = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const flags = (searchParams.get("flags") ?? "")
        .split(",")
        .filter(isMapFlag);

    const setFlags = (next: MapFlag[]) => {
        const params = new URLSearchParams(searchParams);

        if (next.length === 0) {
            params.delete("flags");
        } else {
            params.set("flags", next.join(","));
        }

        setSearchParams(params);
    };

    const toggleFlag = (flag: MapFlag) =>
        setFlags(
            flags.includes(flag)
                ? flags.filter((current) => current !== flag)
                : [...flags, flag]
        );

    return { flags, toggleFlag, clearFlags: () => setFlags([]) };
};
