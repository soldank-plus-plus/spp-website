"use client";

import React from "react";
import { NavLink, useParams } from "react-router-dom";

export const Navigation: React.FC = () => {
    const { username } = useParams<{ username: string }>();

    const navItems = [
        { label: "Overview", path: `/account/${username}/overview` },
        { label: "Clan", path: `/account/${username}/clan` },
        { label: "Records", path: `/account/${username}/records` },
        { label: "Positions", path: `/account/${username}/positions` },
        { label: "Medals", path: `/account/${username}/medals` },
        { label: "Maps", path: `/account/${username}/maps` },
    ];

    return (
        <div className="px-4 mt-24 sm:mt-32 lg:mt-48 mb-5">
            <nav className="flex justify-center">
                <div className="inline-flex flex-wrap justify-center gap-2 border-b border-white/20 pb-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `relative px-3 py-1 transition-all duration-200 font-medium ${
                                    isActive
                                        ? "text-blue-500"
                                        : "text-secondary hover:text-blue-500"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded-t-full" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
};
