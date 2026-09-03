import React from "react";
import { useOutletContext } from "react-router-dom";
import { UserOutletContext } from "@/pages/User/User";
import { UserRecordsTable } from "@/components/layouts/User/Children/UserRecords/UserRecords";

export const UserRecords: React.FC = () => {
    const { user, loading } = useOutletContext<UserOutletContext>();

    if (loading || !user) return null;

    return (
        <section className="flex justify-center px-4">
            <UserRecordsTable userId={user.id} />
        </section>
    );
};
