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
import { MAP_FLAGS, useMapFlags } from "@/hooks/maps/useMapFlags";

export const MapFilters: React.FC = () => {
    const { flags, toggleFlag } = useMapFlags();

    return (
        <Dialog>
            <DialogTrigger
                aria-label="Filter maps"
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/20 text-secondary transition-colors hover:border-white/40 hover:text-foreground"
            >
                <Filter className="h-4 w-4" />
                {flags.length > 0 && (
                    <span className="absolute -mt-5 ml-5 h-2 w-2 rounded-full bg-accent" />
                )}
            </DialogTrigger>

            <DialogContent className="max-w-[320px] rounded-[10px] border-white/20 bg-nocturne">
                <DialogHeader>
                    <DialogTitle>Climb mode:</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3">
                    {MAP_FLAGS.map((flag) => (
                        <div key={flag.key} className="flex items-center gap-2">
                            <Checkbox
                                id={flag.key}
                                checked={flags.includes(flag.key)}
                                onCheckedChange={() => toggleFlag(flag.key)}
                                className="border-white/30 data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-white"
                            />
                            <Label
                                htmlFor={flag.key}
                                className="cursor-pointer"
                            >
                                {flag.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
