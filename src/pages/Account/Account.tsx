import React from "react";
import { useParams, Outlet } from "react-router-dom";
import { Header } from "@/components/ui/custom/core/Header";
import { Navigation } from "@/components/layouts/Account/Navigation";
import Sidebar from "@/components/layouts/Account/Children/Sidebar";
import { Footer } from "@/components/ui/custom/core/Footer";
import { useUser } from "@/hooks/users/useUser";
import { AccountUser } from "@/types/user";

export interface AccountOutletContext {
    user: AccountUser | null;
    loading: boolean;
}

const Account: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const { user, loading, error } = useUser(username);

    return (
        <>
            <Header />
            <main>
                <Navigation />
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_3fr] gap-8 px-4 mb-20">
                    <Sidebar user={user} loading={loading} />
                    {error && <p className="text-red-500 p-4">{error}</p>}
                    {!error && (
                        <Outlet
                            context={
                                { user, loading } satisfies AccountOutletContext
                            }
                        />
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Account;
