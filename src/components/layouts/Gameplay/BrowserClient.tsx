import { Button } from "@/components/ui/shadcn/button";
import wasm from "@/assets/technologies/wasm.png";
import emscripten from "@/assets/technologies/emscripten.png";

const browserClientUrl =
    "https://soldank-plus-plus.github.io/soldank-plus-plus/browser-client/";

export const BrowserClient = () => {
    return (
        <>
            <h1 className="mt-60 mb-6 text-center">Gameplay</h1>

            <section className="relative overflow-hidden px-6 sm:px-12 lg:px-20 pt-16 pb-40">
                <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 md:flex-row md:items-start">
                    <div className="relative shrink-0">
                        {/* a radial gradient instead of a blurred circle, so the section can clip it without a visible edge */}
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[1000px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(46,65,131,0.45)_0%,transparent_70%)]" />
                        <div className="relative flex h-52 w-52 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent">
                            <img
                                src={wasm}
                                alt="WebAssembly"
                                className="w-24 h-24 object-contain"
                            />
                            <span className="absolute bottom-4 font-tomorrow text-[10px] uppercase tracking-widest text-secondary">
                                WebAssembly
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p>
                            We compiled a test version of the game to WASM, so
                            you can feel the movement without downloading
                            anything. It is an early build, made to show how the
                            physics behave and how close they already are to
                            Soldat.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button asChild variant="default">
                                <a
                                    href={browserClientUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-inherit no-underline inline-flex items-center"
                                >
                                    Play in browser
                                </a>
                            </Button>
                            <span className="text-sm font-medium">using</span>
                            <img
                                src={emscripten}
                                alt="Emscripten"
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
