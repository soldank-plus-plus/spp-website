import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
    { label: "Global", path: "/ranking/global" },
    { label: "Country", path: "/ranking/country" },
    { label: "Clan", path: "/ranking/clan" },
    { label: "Records", path: "/ranking/records" },
    { label: "Positions", path: "/ranking/positions" },
    { label: "More", path: "/ranking/more" },
];

export const Navigation: React.FC = () => {
    return (
        <div className="mb-8 px-4">
            <h1 className="mt-60 mb-6 text-center text-foreground">Ranking</h1>

            <nav className="max-w-5xl mx-auto">
                <div className="inline-flex flex-wrap justify-start gap-1 px-6 py-3 rounded-xl ">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `px-4 py-2 font-tomorrow font-bold uppercase transition-colors duration-200 ${
                                    isActive
                                        ? "text-foreground border-b-2 border-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
};
