import React from "react";
import { useOutletContext } from "react-router-dom";
import { AccountOutletContext } from "@/pages/Account/Account";
import { UserPositions } from "@/components/layouts/Account/Children/Positions/UserPositionsTable";

export const AccountPositions: React.FC = () => {
    const { user, loading } = useOutletContext<AccountOutletContext>();

    if (loading || !user) return null;

    return (
        <section className="flex justify-center px-4">
            <UserPositions userId={user.id} />
        </section>
    );
};
