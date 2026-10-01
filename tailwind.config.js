/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{jsx,html}'],
    theme: {
        extend: {
            colors: {
                mi: {
                    dark1: '#202a3a', // Dark gray blue (Primary Background)
                    dark2: '#374455', // Dark gray blue (Secondary Background/Cards)
                    blue: '#4a7ea9',  // Azure (Primary buttons/accents)
                    cyan: '#50c6e9',  // Azure (Highlights/Text Gradients)
                    light: '#e3edf1'  // Light Azure (Text)
                }
            }
        }
    }
};
