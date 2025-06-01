import React from "react";
import discord from "@/assets/icons/discord.png";

export const Contact = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-5 w-full px-[30px] py-[60px] overflow-hidden relative">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 w-full max-w-[1000px]">
                    <div className="flex flex-col justify-center items-start gap-y-4 text-left max-w-sm">
                        <h3 className="text-white text-xl font-semibold">
                            You didn't find your question?
                        </h3>
                        <p className="text-sm text-white/70 [&_a]:underline [&_a:hover]:underline">
                            For additional questions, the easiest and fastest way
                            is to contact us at:  <a href="https://discord.gg/gvhsk8NZHD">
                            https://discord.gg/gvhsk8NZHD</a> or  send an email to Nedi
                            directly:  <a href="mailto:kknedi@gmail.com">kknedi@gmail.com</a>.
                        </p>
                    </div>

                    <a href="https://discord.gg/gvhsk8NZHD">
                        <img
                            src={discord}
                            alt="Discord"
                            className="transition-opacity duration-300 hover:opacity-50"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};