import React, { useState } from "react";
import { UserRecordsTable } from "@/components/layouts/User/Children/UserRecords/UserRecords";
import { Medal } from "@/types/position";
import goldIcon from "@/assets/icons/medal-gold.png";
import silverIcon from "@/assets/icons/medal-silver.png";
import bronzeIcon from "@/assets/icons/medal-bronze.png";

const MEDALS: { value: Medal; label: string; icon: string }[] = [
    { value: 1, label: "Gold", icon: goldIcon },
    { value: 2, label: "Silver", icon: silverIcon },
    { value: 3, label: "Bronze", icon: bronzeIcon },
];

interface Props {
    userId: number;
}

export const UserMedals: React.FC<Props> = ({ userId }) => {
    const [selected, setSelected] = useState<Medal>(1);

    const filter = (
        <div className="flex items-center gap-2">
            {MEDALS.map((medal) => {
                const active = medal.value === selected;

                return (
                    <button
                        key={medal.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelected(medal.value)}
                        className={`flex items-center rounded border px-2.5 py-1.5 transition-colors ${
                            active
                                ? "border-white/20 bg-sombre"
                                : "border-transparent hover:bg-sombre/60"
                        }`}
                    >
                        <img
                            src={medal.icon}
                            alt={medal.label}
                            className={`h-5 w-5 transition ${
                                active ? "" : "opacity-40 grayscale"
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );

    return (
        <UserRecordsTable
            key={selected}
            userId={userId}
            medal={selected}
            toolbar={filter}
        />
    );
};
