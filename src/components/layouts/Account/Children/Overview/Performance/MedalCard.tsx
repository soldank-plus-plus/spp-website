"use client";

import React from "react";
import goldIcon from "@/assets/icons/medal-gold.png";
import silverIcon from "@/assets/icons/medal-silver.png";
import bronzeIcon from "@/assets/icons/medal-bronze.png";

interface Medals {
    gold: number;
    silver: number;
    bronze: number;
}

interface MedalCardProps {
    medals: Medals;
}

const MedalCard: React.FC<MedalCardProps> = ({ medals }) => {
    const medalData = [
        { icon: goldIcon, count: medals.gold },
        { icon: silverIcon, count: medals.silver },
        { icon: bronzeIcon, count: medals.bronze },
    ];

    return (
        <div className="flex min-w-[235px] p-4 gap-4 items-start">
            <div className="w-px self-stretch bg-gradient-to-b from-transparent via-white/30 to-transparent" />

            <div className="flex flex-col gap-3 pl-4">
                {medalData.map((m, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <img
                            src={m.icon}
                            className="w-6 h-6"
                            alt="Medal icon"
                        />
                        <span className="font-semibold text-xs">{m.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedalCard;
