/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Poppins", "system-ui"],
            },
            boxShadow: {
                card: "0px 0px 20px 0px rgba(0, 0, 0, 0.15)",
            },
            transitionDuration: {
                DEFAULT: "300ms",
            },
            minHeight: {
                24: "96px"
            },
            colors: {
                cyan: {
                    500: "#46b6bf",
                    700: "#0f929a",
                    200: "#bceff3"
                },
                red: {
                    500: "#ee4322"
                },
                black: "#1d1e1c",
                white: "#ffffff",
                primary: "#2E4D34", //#2E4D34 #A3B89C
                secondary: "#C9A85C",
                transparent: "transparent",
            },
        },
        container: {
            padding: "2rem",
            center: true,
        },
    },
    plugins: [],
}