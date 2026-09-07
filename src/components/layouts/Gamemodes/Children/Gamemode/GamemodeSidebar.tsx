import React from "react";
import { Link } from "react-router-dom";
import {
    BookOpen,
    FileCode,
    Map,
    Package,
    Server,
    Signal,
    Timer,
    Trophy,
    Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Game } from "@/components/layouts/Gamemodes/List/listTypes";
import { useGamemode } from "@/hooks/gamemodes/useGamemode";
import { useGamemodeTotals } from "@/hooks/gamemodes/useGamemodeTotals";

const tileClass = "rounded border border-white/10 p-4";
const titleClass =
    "mb-3 block font-tomorrow text-[11px] uppercase tracking-wider text-secondary";
const rowClass = "flex items-center gap-2.5 py-1.5 text-sm";
const linkClass = `${rowClass} text-secondary no-underline transition-colors hover:text-foreground`;

type IconType = LucideIcon | React.ComponentType<{ className?: string }>;

interface RowProps {
    icon: IconType;
    label: string;
    to?: string;
    url?: string;
}

// A link with nowhere to go stays visible but muted, so the tile always shows
// everything the mode can offer
const Row: React.FC<RowProps> = ({ icon: Icon, label, to, url }) => {
    const content = (
        <>
            <Icon className="h-4 w-4 shrink-0" />
            {label}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={linkClass}>
                {content}
            </Link>
        );
    }

    if (url) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
            >
                {content}
            </a>
        );
    }

    return <div className={`${rowClass} text-secondary/50`}>{content}</div>;
};

interface Props {
    game: Game;
}

export const GamemodeSidebar: React.FC<Props> = ({ game }) => {
    const { gamemodes } = useGamemode();
    // Only the modes the backend serves have a ranking, even the ones whose
    // database is not wired up yet and that land on the coming soon state
    const mode = gamemodes.find((entry) => entry.slug === game.slug);
    const available = mode?.available ?? false;
    const totals = useGamemodeTotals(available);

    const stats = [
        { icon: Users, label: "players", value: totals.players },
        { icon: Timer, label: "records", value: totals.records },
        { icon: Map, label: "maps", value: totals.maps },
    ];

    return (
        <aside className="space-y-4">
            <div className={tileClass}>
                <span className={titleClass}>Get started</span>

                <Row
                    icon={Signal}
                    label="Servers"
                    to={`/servers?gamemode=${game.slug}`}
                />
                <Row icon={FaDiscord} label="Discord" url={game.discordUrl} />
                <Row icon={BookOpen} label="Tutorial" url={game.tutorialUrl} />
            </div>

            <div className={tileClass}>
                <span className={titleClass}>Stats</span>

                <Row
                    icon={Trophy}
                    label="Ranking"
                    to={
                        mode
                            ? `/ranking/global?gamemode=${game.slug}`
                            : undefined
                    }
                />

                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`${rowClass} ${
                            available ? "text-secondary" : "text-secondary/50"
                        }`}
                    >
                        <stat.icon className="h-4 w-4 shrink-0" />
                        {totals.loading ? (
                            <Skeleton className="h-4 w-32" />
                        ) : (
                            <span>
                                {stat.value === null
                                    ? "—"
                                    : stat.value.toLocaleString()}{" "}
                                {stat.label}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className={tileClass}>
                <span className={titleClass}>Assets</span>

                <Row icon={Package} label="Mappack" url={game.mappackUrl} />
                <Row icon={FileCode} label="Script" url={game.scriptUrl} />
                <Row icon={Server} label="Server" url={game.serverSetupUrl} />
            </div>
        </aside>
    );
};
