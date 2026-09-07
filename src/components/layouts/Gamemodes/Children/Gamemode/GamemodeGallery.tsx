import React, { useState } from "react";

// Every mode reads its shots from assets/gamemodes/gamemode/<slug>, so adding
// a screenshot is a matter of dropping the file in that folder
const shots = import.meta.glob<string>(
    "/src/assets/gamemodes/gamemode/*/*.{png,jpg,jpeg}",
    { eager: true, import: "default" }
);

const shotsFor = (slug: string) =>
    Object.entries(shots)
        .filter(([path]) => path.includes(`/gamemode/${slug}/`))
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([, url]) => url);

interface Props {
    slug?: string;
}

export const GamemodeGallery: React.FC<Props> = ({ slug }) => {
    const images = slug ? shotsFor(slug) : [];
    const [current, setCurrent] = useState(0);

    if (images.length === 0) return null;

    return (
        <div>
            <img
                src={images[current]}
                alt=""
                className="aspect-video w-full rounded-lg border border-white/10 object-cover"
            />

            <div className="mt-4 flex flex-wrap gap-3">
                {images.map((image, index) => (
                    <button
                        key={image}
                        type="button"
                        onClick={() => setCurrent(index)}
                        className={`h-16 w-24 overflow-hidden rounded border transition-colors ${
                            index === current
                                ? "border-accent"
                                : "border-white/10 hover:border-white/40"
                        }`}
                    >
                        <img
                            src={image}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};
