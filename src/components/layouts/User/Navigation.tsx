"use client";

import React from "react";
import { NavLink, useMatch, useParams } from "react-router-dom";

export const Navigation: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    // The profile root renders the overview without its own path segment
    const onProfileRoot = useMatch("/profile/:username") !== null;

    const navItems = [
        { label: "Overview", path: `/profile/${username}/overview` },
        { label: "Clan", path: `/profile/${username}/clan` },
        { label: "Records", path: `/profile/${username}/records` },
        { label: "Positions", path: `/profile/${username}/positions` },
        { label: "Medals", path: `/profile/${username}/medals` },
        { label: "Maps", path: `/profile/${username}/maps` },
    ];

    return (
        <div className="px-4 mt-24 sm:mt-32 lg:mt-48 mb-5">
            <nav className="flex justify-center">
                <div className="inline-flex flex-wrap justify-center gap-2 border-b border-white/20 pb-2">
                    {navItems.map((item) => {
                        const activeOnRoot =
                            onProfileRoot && item.label === "Overview";

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `relative px-3 py-1 transition-all duration-200 font-medium ${
                                        isActive || activeOnRoot
                                            ? "text-blue-500"
                                            : "text-secondary hover:text-blue-500"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span>{item.label}</span>
                                        {(isActive || activeOnRoot) && (
                                            <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded-t-full" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};
