import React from "react";
import { useOutletContext } from "react-router-dom";
import { UserOutletContext } from "@/pages/User/User";
import { UserPositionsTable } from "@/components/layouts/User/Children/UserPositions/UserPositions";

export const UserPositions: React.FC = () => {
    const { user, loading } = useOutletContext<UserOutletContext>();

    if (loading || !user) return null;

    return (
        <section className="flex justify-center px-4">
            <UserPositionsTable userId={user.id} />
        </section>
    );
};
