import React from "react";
import { useOutletContext } from "react-router-dom";
import { AccountOutletContext } from "@/pages/Account/Account";
import { UserRecordsTable } from "@/components/layouts/Account/Children/UserRecords/UserRecords";

export const UserRecords: React.FC = () => {
    const { user, loading } = useOutletContext<AccountOutletContext>();

    if (loading || !user) return null;

    return (
        <section className="flex justify-center px-4">
            <UserRecordsTable userId={user.id} />
        </section>
    );
};
