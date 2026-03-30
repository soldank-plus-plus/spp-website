import React from "react";
import { FiGitMerge } from "react-icons/fi";
import { contributors } from "./contributors";

const Contribute = () => {
    return (
        <main>
            <h1 className="mt-60 mb-6 text-center">Contributing</h1>

            <p className="mb-10 max-w-3xl mx-auto px-4">
                We welcome everyone — whether you’re a developer, tester, artist
                or just a gamer. Your ideas, skills, and feedback are highly
                valued. Join us and contribute at your own pace in this
                community project, where nothing is set in stone, and plans can
                change based on your contributions.
            </p>

            <div className="flex flex-col gap-6 w-full items-center mt-14 mb-20">
                {contributors.map((c, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-lg hover:bg-gray-800 transition-colors w-full max-w-3xl"
                    >
                        <img
                            src={c.icon}
                            alt={c.role}
                            className="w-14 h-14 flex-shrink-0"
                        />
                        <div className="flex-1 text-center sm:text-left">
                            <h4>{c.role}</h4>
                            <p className="text-sm text-white/70">
                                {c.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <section className="w-full px-6 pb-16 bg-background">
                <div className="max-w-4xl mx-auto text-left space-y-6">
                    <h2 className="flex items-center justify-center gap-2 text-center">
                        <FiGitMerge className="text-3xl" />
                        Join the project
                    </h2>
                    <p className="text-sm text-center text-white/70">
                        The best way to get involved is to join us on Discord.
                        Download the game to test it or contribute directly by
                        forking the repository and submitting a pull request.
                        Share your ideas, improvements, or fixes, and we’ll
                        review them together in #dev_chat on Discord.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Contribute;
