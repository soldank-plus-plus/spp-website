import React from "react";
import { Users, Trophy, Flag, Map } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useClan } from "@/hooks/clans/useClan";

const boxClass =
    "flex items-center gap-2.5 rounded border border-white/10 px-3 py-2 transition-colors hover:bg-sombre";
const labelClass = "text-[11px] uppercase tracking-wider text-secondary";

interface StatProps {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
}

const Stat: React.FC<StatProps> = ({ icon: Icon, label, value }) => (
    <div className={boxClass}>
        <Icon className="h-5 w-5 shrink-0 text-secondary" />
        <div className="min-w-0">
            <span className={labelClass}>{label}</span>
            <p className="text-base text-foreground">{value}</p>
        </div>
    </div>
);

interface Props {
    clanId: number;
    clanname: string;
}

export const MainStats: React.FC<Props> = ({ clanId, clanname }) => {
    const { clan, loading, error } = useClan({ clanId, clanname });

    if (error || (!loading && !clan)) return null;

    return (
        <section className="border-t border-white/10 mt-10 pt-8">
            <h3 className="mb-4">Main stats</h3>

            <div className="grid grid-cols-2 gap-3 pl-6 lg:grid-cols-4">
                {!clan
                    ? [0, 1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-[66px] rounded" />
                      ))
                    : [
                          {
                              icon: Users,
                              label: "Members",
                              value: clan.usersCount ?? 0,
                          },
                          {
                              icon: Trophy,
                              label: "Records",
                              value: clan.uniqueCaps ?? 0,
                          },
                          {
                              icon: Flag,
                              label: "Total caps",
                              value: clan.totalCaps ?? 0,
                          },
                          {
                              icon: Map,
                              label: "Maps created",
                              value: clan.mapsCreated ?? 0,
                          },
                      ].map((stat) => (
                          <Stat
                              key={stat.label}
                              icon={stat.icon}
                              label={stat.label}
                              value={stat.value}
                          />
                      ))}
            </div>
        </section>
    );
};
