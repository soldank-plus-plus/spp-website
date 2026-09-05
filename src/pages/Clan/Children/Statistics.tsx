import React from "react";
import { StatisticsChart } from "@/components/layouts/Clan/Statistics";

interface Props {
    clanId: number;
}

export const Statistics: React.FC<Props> = ({ clanId }) => (
    <StatisticsChart clanId={clanId} />
);
