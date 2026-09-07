import React from "react";
import { Filter } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Label } from "@/components/ui/shadcn/label";
import {
    GAME_FEATURES,
    GAME_STYLES,
    useGameFilters,
} from "@/hooks/gamemodes/useGameFilters";

const groupClass = "grid grid-cols-2 gap-3";
const checkboxClass =
    "border-white/30 data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-white";

export const GamemodeFilters: React.FC = () => {
    const { styles, features, selected, toggleStyle, toggleFeature } =
        useGameFilters();

    return (
        <Dialog>
            <DialogTrigger
                aria-label="Filter gamemodes"
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/20 text-secondary transition-colors hover:border-white/40 hover:text-foreground"
            >
                <Filter className="h-4 w-4" />
                {selected > 0 && (
                    <span className="absolute -mt-5 ml-5 h-2 w-2 rounded-full bg-accent" />
                )}
            </DialogTrigger>

            <DialogContent className="max-w-[320px] rounded-[10px] border-white/20 bg-nocturne">
                <DialogHeader>
                    <DialogTitle>Game style:</DialogTitle>
                </DialogHeader>

                <div className={groupClass}>
                    {GAME_STYLES.map((style) => (
                        <div
                            key={style.key}
                            className="flex items-center gap-2"
                        >
                            <Checkbox
                                id={style.key}
                                checked={styles.includes(style.key)}
                                onCheckedChange={() => toggleStyle(style.key)}
                                className={checkboxClass}
                            />
                            <Label
                                htmlFor={style.key}
                                className="cursor-pointer"
                            >
                                {style.label}
                            </Label>
                        </div>
                    ))}
                </div>

                <h2 className="mt-2 text-lg font-semibold leading-none tracking-tight">
                    Features:
                </h2>

                <div className={groupClass}>
                    {GAME_FEATURES.map((feature) => (
                        <div
                            key={feature.key}
                            className="flex items-center gap-2"
                        >
                            <Checkbox
                                id={feature.key}
                                checked={features.includes(feature.key)}
                                onCheckedChange={() =>
                                    toggleFeature(feature.key)
                                }
                                className={checkboxClass}
                            />
                            <Label
                                htmlFor={feature.key}
                                className="cursor-pointer"
                            >
                                {feature.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
