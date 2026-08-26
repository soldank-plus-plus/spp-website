import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/radio-group";
import { Label } from "@/components/ui/shadcn/label";
import { CheckCircle, Clock } from "lucide-react";
import { features } from "./roadmapData";

const FeatureItem = ({
    item,
}: {
    item: { name: string; status: "done" | "planned" };
}) => (
    <div className="flex items-start gap-2 py-2">
        {item.status === "done" ? (
            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
        ) : (
            <Clock className="w-5 h-5 text-yellow-500 mt-1" />
        )}
        <span className="text-xs whitespace-normal break-words">
            {item.name}
        </span>
    </div>
);

export default function RoadmapFeat() {
    const [selectedCategory, setSelectedCategory] =
        useState<keyof typeof features>("core");

    return (
        <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 flex flex-col items-center">
            <RadioGroup
                value={selectedCategory}
                onValueChange={(value) =>
                    setSelectedCategory(value as keyof typeof features)
                }
                className="flex gap-4 mb-6 flex-wrap justify-center"
            >
                {Object.keys(features).map((category) => (
                    <div
                        key={category}
                        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
                            selectedCategory === category
                                ? "bg-gray-800 text-heading font-semibold"
                                : "text-secondary"
                        }`}
                    >
                        <RadioGroupItem
                            value={category}
                            id={category}
                            className="hidden"
                        />
                        <Label htmlFor={category}>{category}</Label>
                    </div>
                ))}
            </RadioGroup>

            <div className="w-full max-w-3xl mb-16">
                {(features[selectedCategory] ?? [])
                    .filter((f) => f.status === "done")
                    .map((f, idx) => (
                        <FeatureItem key={`done-${idx}`} item={f} />
                    ))}

                {(features[selectedCategory] ?? [])
                    .filter((f) => f.status === "planned")
                    .map((f, idx) => (
                        <FeatureItem key={`planned-${idx}`} item={f} />
                    ))}
            </div>
        </div>
    );
}
