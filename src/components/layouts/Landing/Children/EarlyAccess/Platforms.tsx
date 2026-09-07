const platforms = [
    { name: "Steam", sub: "Windows · Linux · macOS" },
    { name: "Epic Games", sub: "Windows · macOS" },
    { name: "App Store", sub: "iOS · iPadOS" },
    { name: "Google Play", sub: "Android" },
    { name: "soldankpp.app", sub: "Cross-platform" },
    { name: "itch.io", sub: "Cross-platform" },
];

const Platforms = () => {
    return (
        <section className="w-full px-6 py-16 bg-background mb-20">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2 space-y-4">
                    <span className="font-tomorrow text-xs uppercase tracking-widest text-blue-200">
                        · deployment
                    </span>
                    <h2>Planned platforms</h2>
                    <p className="text-sm">
                        The game is planned to be released on platforms such as
                        Steam and Epic Games, but there is still a long road
                        ahead before the first full version is complete. Until
                        then, the game will be available as a direct build
                        download for Windows and Linux, so you can already play
                        and follow the development as it progresses.
                    </p>
                </div>

                <div className="md:w-1/2 border-l border-t border-[#1f1f1f] grid grid-cols-3 w-full">
                    {platforms.map((platform) => (
                        <div
                            key={platform.name}
                            className="border-r border-b border-[#1f1f1f] p-4"
                        >
                            <p className="font-tomorrow text-sm text-blue-200">
                                {platform.name}
                            </p>
                            <p className="text-xs text-secondary mt-1">
                                {platform.sub}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Platforms;
