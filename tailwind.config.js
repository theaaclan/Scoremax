import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.{js,jsx,ts,tsx}', // Ensures that Tailwind scans JS/JSX files
        './resources/css/**/*.css',          // Corrected glob pattern for CSS files
      
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Ensure red is defined
                red: {
                  500: '#ef4444', // Example red shade
                },
              },
        },
    },

    plugins: [forms],
};
