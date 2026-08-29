import type {
    FindAllUsersDto,
    ActivityDayDto,
} from "@/api/generated/sppSchemas";

export type User = FindAllUsersDto;

// The backend doesn't compute rank/passed or a full account placement yet,
// so this is just an alias for now rather than an extended type.
export type AccountUser = User;

export type ActivityDay = ActivityDayDto;
