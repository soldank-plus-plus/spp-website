import type { components } from "@/api/schema";

export type EventType =
    | 1 // gained — took a medal position from another user or first cap
    | 2 // improved — same user beat their own time, medal position unchanged
    | 3; // lost — previous holder displaced by another capper

export type Medal = 1 | 2 | 3; // 1=gold, 2=silver, 3=bronze

export type Event = Omit<
    components["schemas"]["FindAllEventsDto"],
    "type" | "medal"
> & {
    type: EventType;
    medal: Medal | null;
};
