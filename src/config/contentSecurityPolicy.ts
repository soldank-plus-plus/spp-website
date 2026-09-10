// Built here rather than inside the vite config so the policy can be read
// without pulling the build toolchain in with it
export const buildContentSecurityPolicy = (apiBaseUrl: string | undefined) =>
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
