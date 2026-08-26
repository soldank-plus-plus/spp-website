import React, { useState } from "react";
import { contributors } from "./contributors";

const Contribute: React.FC = () => {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    return (
        <main>
            <section className="max-w-3xl mx-auto mb-16 text-center">
                <p className="font-tomorrow text-xs uppercase tracking-[0.2em] text-blue-200 mb-6">
                    ◎&nbsp;&nbsp;open source
                </p>

                <h1 className="mt-60 mb-6 text-center">Contributing</h1>
                <p className="mx-auto max-w-3xl text-center px-4">
                    Download the game to test it, or contribute directly by
                    forking the repository and submitting a pull request. Share
                    your improvements, fixes, or suggestions, and we'll review
                    them together in #dev_chat on Discord. This is an
                    open-source community project, nothing is set in stone, and
                    plans can evolve based on contributions, giving everyone the
                    freedom to participate.
                </p>
            </section>

            <section className="max-w-3xl mx-auto mb-28 px-8">
                <div
                    className="flex flex-col md:flex-row md:h-96 border border-[#1f1f1f] overflow-hidden"
                    onMouseLeave={() => setActiveIdx(null)}
                >
                    {contributors.map((c, idx) => {
                        const isActive = idx === activeIdx;
                        return (
                            <div
                                key={idx}
                                onMouseEnter={() => setActiveIdx(idx)}
                                onClick={() => setActiveIdx(idx)}
                                className={[
                                    "flex flex-col overflow-hidden cursor-pointer",
                                    "transition-all duration-500 ease-in-out",
                                    "border-b md:border-b-0 md:border-r border-[#1f1f1f] last:border-b-0 md:last:border-r-0",
                                    isActive
                                        ? "md:flex-[1] bg-sombre"
                                        : "md:flex-[0.5] bg-nocturne",
                                ].join(" ")}
                            >
                                <div
                                    className={
                                        isActive
                                            ? "flex flex-col h-full p-6"
                                            : "flex md:hidden flex-col h-full p-6"
                                    }
                                >
                                    <span className="font-tomorrow text-xs uppercase tracking-widest text-blue-200 mb-5">
                                        {String(idx + 1).padStart(2, "0")}
                                        &nbsp;·&nbsp;{c.tag}
                                    </span>
                                    <div className="flex-1 flex items-center">
                                        <img
                                            src={c.icon}
                                            alt={c.role}
                                            className="w-14 h-14 object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="mb-2">{c.role}</h3>
                                        <p className="text-sm">
                                            {c.description}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={
                                        isActive
                                            ? "hidden"
                                            : "hidden md:flex flex-col h-full items-center justify-between py-5 px-2"
                                    }
                                >
                                    <span className="font-tomorrow text-[10px] text-secondary">
                                        {String(idx + 1).padStart(2, "0")}
                                    </span>
                                    <img
                                        src={c.icon}
                                        alt={c.role}
                                        className="w-7 h-7 object-contain opacity-40"
                                    />
                                    <span />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
};

export default Contribute;
