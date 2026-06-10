import cpp from "@/assets/technologies/cpp.png";
import electron from "@/assets/technologies/electron.png";
import artist from "@/assets/icons/artist.png";
import tester from "@/assets/icons/tester.png";
import dascript from "@/assets/technologies/dascript.png";

export type Contributor = {
    role: string;
    tag: string;
    icon: string;
    description: string;
};

export const contributors: Contributor[] = [
    {
        role: "C++ Developer",
        tag: "C++",
        icon: cpp,
        description:
            "The core of the game is written in C++, possibility of contributing in networking, game mechanics, improving performance, and implement new functionalities.",
    },
    {
        role: "Electron Developer",
        tag: "ELECTRON",
        icon: electron,
        description:
            "The game launcher (GUI) is written in Electron, so contributions here involve improving the launcher, adding new features, and fixing bugs.",
    },
    {
        role: "2D Game Artist",
        tag: "ART",
        icon: artist,
        description:
            "Needed for creating in-game graphics, icons, and various visual assets for the project. Artists can contribute textures or UI elements to enhance the game’s visual experience.",
    },
    {
        role: "Tester",
        tag: "TESTING",
        icon: tester,
        description:
            "Test updates, verify new features, and provide feedback. We especially welcome testers with macOS experience to help ensure cross-platform stability.",
    },
    {
        role: "Daslang Scripter",
        tag: "DASLANG",
        icon: dascript,
        description:
            "Write scripts for in-game dedicated servers and shape gameplay logic. Create custom gamemodes or modify existing ones.",
    },
];
