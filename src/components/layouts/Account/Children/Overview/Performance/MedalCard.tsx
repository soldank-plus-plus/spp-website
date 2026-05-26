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
        <div className="flex flex-col gap-4 justify-between h-full">
            {medalData.map((m, index) => (
                <div key={index} className="flex items-center gap-3">
                    <img src={m.icon} className="w-6 h-6" alt="Medal icon" />
                    <span className="font-semibold text-sm tabular-nums">{m.count}</span>
                </div>
            ))}
        </div>
    );
};

export default MedalCard;
