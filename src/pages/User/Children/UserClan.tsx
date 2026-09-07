import React from "react";
import { useOutletContext } from "react-router-dom";
import { UserOutletContext } from "@/pages/User/User";
import { UserClanMembers } from "@/components/layouts/User/Children/UserClan/UserClan";

export const UserClan: React.FC = () => {
    const { user, loading } = useOutletContext<UserOutletContext>();

    if (loading || !user) return null;

    return (
        <section className="flex items-start justify-center px-4">
            {user.clanId === null ? (
                <p className="text-secondary">This player has no clan.</p>
            ) : (
                <UserClanMembers clanId={user.clanId} />
            )}
        </section>
    );
};
