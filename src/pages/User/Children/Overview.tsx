import React from "react";
import { useOutletContext } from "react-router-dom";
import Performance from "@/components/layouts/User/Children/Overview/Performance/Performance";
import { Activity } from "@/components/layouts/User/Children/Overview/Activity/Activity";
import { UserOutletContext } from "@/pages/User/User";

export const Overview: React.FC = () => {
    const { user, loading } = useOutletContext<UserOutletContext>();

    return (
        <section>
            <Performance user={user ?? undefined} loading={loading} />
            {user && <Activity userId={user.id} />}
        </section>
    );
};
