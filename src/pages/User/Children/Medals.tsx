import React from "react";
import { useOutletContext } from "react-router-dom";
import { UserOutletContext } from "@/pages/User/User";
import { UserMedals } from "@/components/layouts/User/Children/Medals/Medals";

export const Medals: React.FC = () => {
    const { user, loading } = useOutletContext<UserOutletContext>();

    if (loading || !user) return null;

    return (
        <section className="flex justify-center px-4">
            <UserMedals userId={user.id} />
        </section>
    );
};
