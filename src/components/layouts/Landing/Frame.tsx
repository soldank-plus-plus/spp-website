import React from "react";

export const Frame = () => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-20">
            <div
                className="relative overflow-hidden w-full"
                style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
            >
                <iframe
                    className="absolute top-0 left-0 w-full h-full border border-solid border-border rounded"
                    src="https://www.youtube.com/embed/nD0waXaUw5Y"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
};