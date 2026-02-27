import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                ultra: {
                    bg: '#0C0F14',
                    'bg-secondary': '#11151C',
                    card: '#151A22',
                    surface: '#1A2029',
                    sidebar: '#0F141B',
                    silver: '#C9CED6',
                    'silver-bright': '#E5E7EB',
                    'silver-muted': '#9CA3AF',
                    'silver-dark': '#6B7280',
                    accent: '#BFC5CE',
                    hover: '#D1D5DB',
                    border: '#2A313C',
                },
            },
            fontFamily: {
                tajawal: ['Tajawal', 'sans-serif'],
            },
            borderRadius: {
                ultra: '18px',
            },
            boxShadow: {
                ultra: '0 15px 40px rgba(0,0,0,0.45)',
                glow: '0 0 20px rgba(229,231,235,0.08)',
            },
            transitionDuration: {
                ultra: '300ms',
            },
            animation: {
                marquee: 'marquee 35s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide')
    ],
};

export default config;
