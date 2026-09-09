import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

const buildContentSecurityPolicy = (apiBaseUrl: string | undefined) =>
    [
        "default-src 'self'",
        "script-src 'self'",
        // Radix and the shadcn chart component append <style> tags at runtime,
        // and neither can be given a nonce from a static build
        "style-src 'self' 'unsafe-inline'",
        // the YouTube player pulls its poster frame from this host, and it
        // is only ever reached after a visitor asks for the video
        "img-src 'self' data: https://i.ytimg.com",
        "font-src 'self'",
        ["connect-src 'self'", apiBaseUrl].filter(Boolean).join(" "),
        "frame-src https://www.youtube-nocookie.com",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
    ].join("; ");

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
