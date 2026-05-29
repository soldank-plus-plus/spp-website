import React from "react";
import { useOutletContext } from "react-router-dom";
import Performance from "@/components/layouts/Account/Children/Overview/Performance/Performance";
import { Activity } from "@/components/layouts/Account/Children/Overview/Activity/Activity";
import { AccountOutletContext } from "@/pages/Account/Account";

export const Overview: React.FC = () => {
    const { user, loading } = useOutletContext<AccountOutletContext>();

    return (
        <section>
            <Performance user={user ?? undefined} loading={loading} />
            {user && <Activity userId={user.id} />}
        </section>
    );
};
