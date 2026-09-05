import React from "react";
import { useOutletContext } from "react-router-dom";
import { UserOutletContext } from "@/pages/User/User";
import { UserMaplist } from "@/components/layouts/User/Children/UserMaps/UserMaps";

export const UserMaps: React.FC = () => {
    const { user, loading } = useOutletContext<UserOutletContext>();

    if (loading || !user) return null;

    return (
        <section className="flex justify-center px-4">
            <UserMaplist userId={user.id} />
        </section>
    );
};
