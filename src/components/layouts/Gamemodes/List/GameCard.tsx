import React from "react";
import { Link } from "react-router-dom";

const cardClass =
    "block w-full xs:w-60 sm:w-52 overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300";

interface GameCardProps {
    slug?: string;
    title: string;
    description: string;
    image: string;
}

export const GameCard: React.FC<GameCardProps> = ({
    slug,
    title,
    description,
    image,
}) => {
    const content = (
        <>
            <div className="relative overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-40 sm:h-56 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
            </div>
            <div className="p-4 h-48 bg-sombre">
                <h4 className="text-heading break-words">{title}</h4>
                <p className="text-sm text-secondary">{description}</p>
            </div>
        </>
    );

    // A mode without a page of its own is still listed, just not clickable
    if (!slug) {
        return <div className={cardClass}>{content}</div>;
    }

    return (
        <Link to={`/gamemodes/${slug}`} className={`group ${cardClass}`}>
            {content}
        </Link>
    );
};
