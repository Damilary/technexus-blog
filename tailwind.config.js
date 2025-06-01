/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#2563EB', // Primary Blue
          hover: '#1E40AF',   // Hover state
          active: '#1E3A8A',  // Active state
        },
        secondary: {
          DEFAULT: '#0D9488', // Secondary Teal
          hover: '#0F766E',   // Hover state
          active: '#115E59',  // Active state
        },
        accent: {
          DEFAULT: '#F97316', // Accent Orange
          hover: '#EA580C',   // Hover state
          active: '#C2410C',  // Active state
        },
        
        // Neutral Colors
        dark: {
          DEFAULT: '#1E293B', // Dark
          light: '#334155',   // Light variant for secondary text
        },
        medium: {
          DEFAULT: '#64748B', // Medium
          light: '#94A3B8',   // Light variant
        },
        light: {
          DEFAULT: '#F1F5F9', // Light
          dark: '#E2E8F0',    // Dark variant
          extraLight: '#F8FAFC', // Extra light variant
        },
        
        // Semantic Colors
        success: '#10B981',   // Success
        warning: '#F59E0B',   // Warning
        error: '#EF4444',     // Error
        info: '#3B82F6',      // Info
        
        // Dark Mode Colors
        darkMode: {
          bg: '#0F172A',      // Dark mode background
          text: '#F1F5F9',    // Dark mode text
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '1.875rem',    // 30px
        '4xl': '2.25rem',     // 36px
        '5xl': '3rem',        // 48px
        '6xl': '3.75rem',     // 60px
      },
      lineHeight: {
        tight: '1.2',         // For headings
        snug: '1.3',          // For subheadings
        normal: '1.5',        // For body text
        relaxed: '1.6',       // For body text with more spacing
      },
      borderRadius: {
        'sm': '0.25rem',      // 4px
        DEFAULT: '0.375rem',  // 6px
        'md': '0.5rem',       // 8px
        'lg': '0.75rem',      // 12px
        'xl': '1rem',         // 16px
        'full': '9999px',     // For circular elements
      },
      spacing: {
        // Base spacing unit: 4px
        '0': '0',
        '0.5': '0.125rem',    // 2px
        '1': '0.25rem',       // 4px
        '2': '0.5rem',        // 8px
        '3': '0.75rem',       // 12px
        '4': '1rem',          // 16px
        '5': '1.25rem',       // 20px
        '6': '1.5rem',        // 24px
        '8': '2rem',          // 32px
        '10': '2.5rem',       // 40px
        '12': '3rem',         // 48px
        '16': '4rem',         // 64px
        '20': '5rem',         // 80px
        '24': '6rem',         // 96px
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      transitionDuration: {
        'fast': '150ms',      // Micro-interactions, buttons
        DEFAULT: '300ms',     // Most UI elements
        'slow': '500ms',      // Larger transitions, modals
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)', // Standard
        'in': 'cubic-bezier(0.4, 0, 1, 1)',      // Ease-in (for exits)
        'out': 'cubic-bezier(0, 0, 0.2, 1)',     // Ease-out (for entrances)
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark mode with class-based switching
}
