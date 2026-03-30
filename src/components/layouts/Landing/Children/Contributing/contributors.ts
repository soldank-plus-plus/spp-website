import cpp from "@/assets/technologies/cpp.png";
import dart from "@/assets/technologies/dart.png";
import artist from "@/assets/icons/artist.png";
import tester from "@/assets/icons/tester.png";

export type Contributor = {
    role: string;
    icon: string;
    description: string;
};

export const contributors: Contributor[] = [
    {
        role: "C++ Developer",
        icon: cpp,
        description:
            "The entire game core is written in C++, so there’s plenty to work on. Developers can help implement features, fix bugs, and optimize game mechanics.",
    },
    {
        role: "Dart Developer",
        icon: dart,
        description:
            "The game launcher (GUI) is written in Flutter, so contributions here involve improving the launcher, adding new features, and fixing bugs.",
    },
    {
        role: "2D Game Artist",
        icon: artist,
        description:
            "Needed for creating in-game graphics, icons, and various visual assets for the project. Artists can contribute textures or UI elements to enhance the game’s visual experience.",
    },
    {
        role: "Tester",
        icon: tester,
        description:
            "Test updates, verify new features, and provide feedback. We especially welcome testers with macOS experience to help ensure cross-platform stability.",
    },
];
