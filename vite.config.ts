import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import { buildContentSecurityPolicy } from "./src/config/contentSecurityPolicy";

// only the production build carries a policy, since the dev server serves an
// inline script for hot reload and talks to itself over a websocket
const contentSecurityPolicy = (apiBaseUrl: string | undefined): Plugin => ({
    name: "content-security-policy",
    apply: "build",
    transformIndexHtml: () => [
        {
            tag: "meta",
            attrs: {
                "http-equiv": "Content-Security-Policy",
                content: buildContentSecurityPolicy(apiBaseUrl),
            },
            injectTo: "head-prepend",
        },
    ],
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react(), contentSecurityPolicy(env.VITE_API_BASE_URL)],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        server: {
            proxy: {
                "/api": {
                    target: "http://localhost:3000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    };
});
