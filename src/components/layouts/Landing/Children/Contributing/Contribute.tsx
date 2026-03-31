"use client";

import * as React from "react";
import { contributors } from "./contributors";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/shadcn/carousel";

const Contribute: React.FC = () => {
    return (
        <main>
            <section className="max-w-3xl mx-auto mb-16 text-center">
                <h1 className="mt-60 mb-6 text-center">Contributing</h1>
                <p className="mx-auto max-w-3xl text-center px-4 ">
                    Download the game to test it, or contribute directly by
                    forking the repository and submitting a pull request. Share
                    your improvements, fixes, or suggestions, and we’ll review
                    them together in #dev_chat on Discord. This is an
                    open-source community project, nothing is set in stone, and
                    plans can evolve based on contributions, giving everyone the
                    freedom to participate.
                </p>
            </section>

            <section className="max-w-6xl mx-auto mb-28 relative px-8">
                <Carousel opts={{ align: "start" }} className="w-full relative">
                    <CarouselContent className="-ml-4">
                        {contributors.map((c, idx) => (
                            <CarouselItem
                                key={idx}
                                className="pl-3 flex-shrink-0 md:basis-1/2 lg:basis-1/4"
                            >
                                <Card className="bg-sombre border-gray-800 rounded-xl shadow-md flex flex-col items-center h-96 w-full">
                                    <CardContent className="flex flex-col items-center text-center p-6 flex-1">
                                        <img
                                            src={c.icon}
                                            alt={c.role}
                                            className="w-20 h-20 mb-4 rounded-full"
                                        />
                                        <h4 className="font-semibold text-white mb-2">
                                            {c.role}
                                        </h4>
                                        <p className="text-gray-300">
                                            {c.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 text-white p-2 rounded-full ">
                        &#8249;
                    </CarouselPrevious>
                    <CarouselNext className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 text-white p-2 rounded-full">
                        &#8250;
                    </CarouselNext>
                </Carousel>
            </section>
        </main>
    );
};

export default Contribute;
