import type { FindAllPositionsDto } from "@/api/generated/sppSchemas";

export type PositionType =
    | 1 // gained — took a medal position from another user or first cap
    | 2 // improved — same user beat their own time, medal position unchanged
    | 3; // lost — previous holder displaced by another capper

export type Medal = 1 | 2 | 3; // 1=gold, 2=silver, 3=bronze

export type Position = Omit<FindAllPositionsDto, "type" | "medal"> & {
    type: PositionType;
    medal: Medal | null;
};
