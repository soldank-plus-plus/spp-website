import React from "react";
import { Button } from "@/components/ui/shadcn/button";
import { CiServer } from "react-icons/ci";
import { Link } from "react-router-dom";

const YourServer = () => {
    return (
        <section className="w-full px-6 py-16 bg-background">
            <div className="max-w-4xl mx-auto text-left space-y-6">
                <h2 className="flex items-center gap-2">
                    <CiServer className="text-3xl" />
                    Host your own server
                </h2>
                <p className="text-sm text-white/70">
                    Launch a dedicated server and fully control your gameplay
                    experience. <br />
                    Customize your rules, maps, mods, and player limits —
                    perfect for communities and private events.
                </p>
                <Button asChild variant="default">
                    <Link
                        to="/hosting"
                        className="text-inherit no-underline inline-flex items-center"
                    >
                        Learn more
                    </Link>
                </Button>
            </div>
        </section>
    );
};

export default YourServer;
