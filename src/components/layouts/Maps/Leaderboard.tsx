import React from "react";
import { useMapCreators } from "@/hooks/maps/useMapCreators";
import { useNavigate } from "react-router-dom";

export const Leaderboard: React.FC = () => {
    const { users, loading, error } = useMapCreators(20);
    const navigate = useNavigate();

    return (
        <div className="bg-white/5 rounded-lg border border-white/10 p-4 overflow-hidden mt-16">
            <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-blue-200 font-semibold text-sm w-5 text-right shrink-0">
                        #
                    </span>
                    <span className="text-blue-200 font-semibold text-sm">
                        Mappers
                    </span>
                </div>
                <span className="text-blue-200 font-semibold text-sm">
                    Created
                </span>
            </div>
            <hr className="border-border/30 mb-2" />

            {loading && (
                <p className="text-white/70 text-sm text-center py-4">
                    Loading...
                </p>
            )}

            {error && (
                <p className="text-red-500 text-sm text-center py-4">{error}</p>
            )}

            {!loading && (
                <ol className="space-y-1">
                    {users.map((user, index) => (
                        <li
                            key={user.id}
                            className="flex items-center justify-between gap-2 px-2 py-1.5"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-secondary font-bold text-sm w-5 text-right shrink-0">
                                    {index + 1}
                                </span>
                                <span
                                    className="text-secondary text-sm font-medium truncate cursor-pointer hover:text-foreground hover:underline"
                                    onClick={() =>
                                        navigate(`/profile/${user.username}`)
                                    }
                                >
                                    {user.username}
                                </span>
                            </div>
                            <span className="text-foreground text-sm shrink-0">
                                {user.mapsCreated}
                            </span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};
