import React from "react";
import underconstr from "@/assets/icons/underconstr.png";

export const More: React.FC = () => {
    return (
        <section className="flex justify-center items-center min-h-screen px-4">
            <img src={underconstr} alt="Under construction" />
        </section>
    );
};
