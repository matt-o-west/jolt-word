/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary.black': '#05050',
        'secondary.black': '#1F1F1F',
        'tertiary.black': '#2D2D2D',
        'quaternary.black': '#3A3A3A',
        'primary.gray': '#757575',
        'secondary.gray': '#E9E9E9',
        'tertiary.gray': '#F4F4F4',
        red: '#FF5252',
        purple: '#A445ED',
        'purple.100': '#E8D0FB',
        'purple.200': '#D8B9F7',
        'purple.300': '#C8A2F4',
        'purple.400': '#B88BEF',
        'purple.500': '#A974EA',
        'light.purple': '#E8D0FB',
        'dark.purple': '#523B63',
        'dark.feature.purple': '#5F288A',
        background: '#F2F2F2',
      },
      fontFamily: {
        'sans-serif': ['Work Sans', 'sans-serif'],
        serif: ['Lora', 'serif'],
        mono: ['Inconsolata', 'monospace'],
        subhead: ['Caveat', 'cursive'],
      },
      fontSize: {
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      screens: {
        phone: '320px',
        // => @media (min-width: 320px) { ... }

        tablet: '640px',
        // => @media (min-width: 640px) { ... }

        laptop: '1024px',
        // => @media (min-width: 1024px) { ... }

        desktop: '1280px',
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
}
