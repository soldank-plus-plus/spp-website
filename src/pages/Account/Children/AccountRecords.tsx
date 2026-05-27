import React from "react";
import { useOutletContext } from "react-router-dom";
import { AccountOutletContext } from "@/pages/Account/Account";
import { UserRecords } from "@/components/layouts/Account/Children/Records/UserRecordsTable";

export const AccountRecords: React.FC = () => {
    const { user, loading } = useOutletContext<AccountOutletContext>();

    if (loading || !user) return null;

    return (
        <section className="flex justify-center px-4">
            <UserRecords userId={user.id} />
        </section>
    );
};
