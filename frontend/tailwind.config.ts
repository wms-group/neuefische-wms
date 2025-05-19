module.exports = {
    content: [
        "./src/**/*.{html,js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./layouts/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        "grid-cols-1",
        "grid-cols-2",
        "grid-cols-3",
        "sm:grid-cols-1",
        "sm:grid-cols-2",
        "sm:grid-cols-3",
        "xl:grid-cols-1",
        "xl:grid-cols-2",
        "xl:grid-cols-3",
    ],
    plugins: [],
}
