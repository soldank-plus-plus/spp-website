import type {
    FindAllUsersDto,
    FindOneUserDto,
    ActivityDayDto,
    UserPlacementDto,
} from "@/api/generated/sppSchemas";

export type User = FindAllUsersDto;
export type AccountUser = FindOneUserDto;
export type UserPlacement = UserPlacementDto;

export type ActivityDay = ActivityDayDto;
