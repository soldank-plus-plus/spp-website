import React from "react";
import cpp from "@/assets/technologies/cpp.png";
import dart from "@/assets/technologies/dart.png";
import dascript from "@/assets/technologies/dascript.png";
import golang from "@/assets/technologies/golang.png";
import nestjs from "@/assets/technologies/nestjs.png";
import rct from "@/assets/technologies/rct.png";

const technologies = [
    { src: cpp, alt: "C++" },
    { src: dart, alt: "Dart" },
    { src: golang, alt: "Go" },
    { src: dascript, alt: "DaSlang" },
    { src: rct, alt: "React" },
    { src: nestjs, alt: "NestJS" },
];

const techIconClass =
    "w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px] object-contain";

export const TechShowcase = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-5 w-full bg-sombre px-[30px] py-[120px] overflow-hidden relative">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 w-full max-w-[1000px]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
                        {technologies.map((tech, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center"
                            >
                                <img
                                    src={tech.src}
                                    alt={tech.alt}
                                    className={techIconClass}
                                />
                                <p className="mt-2 text-heading text-sm font-medium">
                                    {tech.alt}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col justify-center items-start gap-y-4 text-left max-w-sm">
                        <h3 className="text-heading text-xl font-semibold">
                            Powered by versatile programming languages
                        </h3>
                        <p className="text-sm text-white/70">
                            Developed as a passion project, the game is still in
                            progress and made using popular, flexible
                            programming languages. Each repository is open
                            source and welcome to contributions. The development
                            team intentionally chose these technologies to
                            explore new standards and expand their skills.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
