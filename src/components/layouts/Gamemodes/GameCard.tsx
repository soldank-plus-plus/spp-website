import React from "react";
import { Link } from "react-router-dom";

interface GameCardProps {
    title: string;
    description: string;
    image: string;
    link: string;
}

export const GameCard: React.FC<GameCardProps> = ({ title, description, image, link }) => {
    return (
        <Link
            to={link}
            className="group block w-full xs:w-60 sm:w-52 overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
            <div className="relative overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-40 sm:h-56 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
            </div>
            <div className="p-4 h-40 bg-sombre">
                <h4 className="text-heading break-words">{title}</h4>
                <p className="text-sm text-secondary">{description}</p>
            </div>
        </Link>
    );
};