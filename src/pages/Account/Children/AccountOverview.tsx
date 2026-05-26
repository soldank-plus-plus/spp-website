import React from "react";
import { useOutletContext } from "react-router-dom";
import Performance from "@/components/layouts/Account/Children/Overview/Performance/Performance";
import { Activity } from "@/components/layouts/Account/Children/Overview/Activity/Activity";
import { AccountOutletContext } from "@/pages/Account/Account";

export const AccountOverview: React.FC = () => {
    const { user, loading, error } = useOutletContext<AccountOutletContext>();

    if (loading) return <p className="text-muted-foreground p-4">Loading...</p>;
    if (error) return <p className="text-red-500 p-4">{error}</p>;
    if (!user) return null;

    return (
        <section>
            <Performance user={user} />
            <Activity userId={user.id} />
        </section>
    );
};
