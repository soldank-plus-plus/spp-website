import { useState } from "react";
import { Play } from "lucide-react";
import poster from "@/assets/backgrounds/game.png";

const VIDEO_ID = "nD0waXaUw5Y";

export const Frame = () => {
    const [playerRequested, setPlayerRequested] = useState(false);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-20">
            <div
                className="relative overflow-hidden w-full"
                style={{ paddingTop: "56.25%" }} // 16:9 aspect ratio
            >
                {playerRequested ? (
                    <iframe
                        className="absolute top-0 left-0 w-full h-full border border-solid border-border rounded"
                        src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    // the player is mounted on demand, so no request reaches
                    // YouTube until a visitor asks for the video
                    <button
                        type="button"
                        onClick={() => setPlayerRequested(true)}
                        aria-label="Play the trailer, which loads the player from YouTube"
                        className="absolute top-0 left-0 w-full h-full p-0 border border-solid border-border rounded group cursor-pointer"
                    >
                        <img
                            src={poster}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 transition-colors group-hover:bg-black/40">
                            <Play
                                className="w-16 h-16 text-white"
                                fill="currentColor"
                            />
                            <span className="font-tomorrow text-xs uppercase tracking-widest text-blue-200">
                                Play trailer
                            </span>
                            <span className="text-xs text-white/70">
                                Playing loads the video from YouTube
                            </span>
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};
