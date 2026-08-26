export type MapCreator = {
    id: number;
    username: string;
};

export type Map = {
    id: number;
    mapname: string;
    date: number;
    anticoop: number;
    jets: number;
    m79: number;
    nade: number;
    switch: number;
    coop: number;
    m79c: number;
    hardest: number;
    creators: MapCreator[];
    recordsCount: number;
};
