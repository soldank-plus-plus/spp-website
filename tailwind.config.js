/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                tomorrow: ['"Tomorrow"', "Roboto", "sans-serif"],
            },
            fontWeight: {
                450: "450",
            },
            colors: {
                background: "#000000",
                foreground: "#ffffff",
                primary: "#000000",
                secondary: "#999999",
                border: "#A6A8B4",
                heading: "#ffffff",
                dark: "#9CA3AF",
                light: "#FFFFFFB3",
                accent: "#2e4183",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
