/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                background: '#09090b', // zinc-950
                primary: '#3b82f6', // electric blue
                secondary: '#8b5cf6', // cyber purple
            },
        },
    },
    plugins: [],
}
