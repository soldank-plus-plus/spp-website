import React from "react";
import { useOutletContext } from "react-router-dom";
import { AccountOutletContext } from "@/pages/Account/Account";
import { UserPositionsTable } from "@/components/layouts/Account/Children/UserPositions/UserPositionsTable";

export const UserPositions: React.FC = () => {
    const { user, loading } = useOutletContext<AccountOutletContext>();

    if (loading || !user) return null;

    return (
        <section className="flex justify-center px-4">
            <UserPositionsTable userId={user.id} />
        </section>
    );
};
