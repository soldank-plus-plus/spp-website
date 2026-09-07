import React from "react";

export const Guidelines: React.FC = () => {
    return (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm">
                Want to create your first map? Read the mapping guidelines of
                the game and go through the mapping tutorial{" "}
                {/* Becomes a link once the tutorial page exists */}
                <span className="cursor-pointer text-foreground underline underline-offset-4">
                    here
                </span>
                !
            </p>
        </div>
    );
};
