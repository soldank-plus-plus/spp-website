import React, { useState } from "react";

interface Props {
    mapname: string;
    category?: string;
    className?: string;
}

export const Preview: React.FC<Props> = ({ mapname, category = "climb", className }) => {
    const [failed, setFailed] = useState(false);

    if (!mapname || failed) return null;

    return (
        <img
            src={`/mapviewer/screenshots/${category}_${mapname}.png`}
            alt={mapname}
            onError={() => setFailed(true)}
            className={className ?? "w-full max-w-[800px] block object-contain mx-auto mt-32 mb-24"}
        />
    );
};
