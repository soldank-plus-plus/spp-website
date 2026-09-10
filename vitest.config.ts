import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig((env) =>
    mergeConfig(viteConfig(env), {
        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: ["./src/test/setup.ts"],
            include: ["src/**/*.test.{ts,tsx}"],
            restoreMocks: true,
            unstubEnvs: true,
            unstubGlobals: true,
            coverage: {
                provider: "v8",
                reporter: ["text", "html"],
                include: ["src/**/*.{ts,tsx}"],
                exclude: [
                    "src/**/*.test.{ts,tsx}",
                    "src/test/**",
                    "src/api/generated/sppComponents.ts",
                    "src/api/generated/sppSchemas.ts",
                    "src/types/**",
                    "src/**/*.d.ts",
                ],
            },
        },
    })
);
