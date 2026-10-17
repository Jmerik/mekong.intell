/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{jsx,js,html}'],
    theme: {
        extend: {
            colors: {
                mi: {
                    dark1: '#202a3a', // Primary background
                    dark2: '#374455', // Secondary background / cards
                    blue: '#4a7ea9',  // Primary buttons / accents
                    cyan: '#50c6e9',  // Highlights / gradients
                    light: '#e3edf1'  // Text
                }
            }
        }
    }
};
