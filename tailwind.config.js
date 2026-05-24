/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Muted, deep sage / olive green ──
        sage: {
          50:  '#F3F5F0',
          100: '#E4EAE0',
          200: '#C8D5C0',
          300: '#A8BC9B',
          400: '#869F78',
          500: '#6B8260',
          600: '#52664A',
          700: '#3F503A',
          800: '#2E3B2A',
          900: '#1E271C',
        },
        // ── Warm terracotta / clay accent ──
        terra: {
          50:  '#FDF4EF',
          100: '#FAE6D8',
          200: '#F4CCAF',
          300: '#EBA882',
          400: '#DE8156',
          500: '#C96B3F',
          600: '#A85530',
          700: '#874125',
          800: '#6B321C',
          900: '#542516',
        },
        // ── Warm neutrals / gray ──
        warm: {
          50:  '#FAF8F5',
          100: '#F2EDE7',
          200: '#E5DDD5',
          300: '#D4C9BE',
          400: '#BEB0A4',
          500: '#A0907F',
          600: '#7D6E60',
          700: '#5C5149',
          800: '#3D3530',
          900: '#241F1B',
        },
        // ── Dusty rose / blush (softer than before) ──
        blush: {
          50:  '#FDF5F3',
          100: '#FAE8E4',
          200: '#F4CECA',
          300: '#E8AAA4',
          400: '#D67E77',
          500: '#C05E58',
          600: '#9E4844',
          700: '#7D3836',
          800: '#5F2B2A',
          900: '#4A2120',
        },
        // ── Muted lavender / lilac ──
        lilac: {
          50:  '#F7F4FB',
          100: '#EEE8F7',
          200: '#DCCFEF',
          300: '#C3ADE2',
          400: '#A487CF',
          500: '#8A68BA',
          600: '#6F519E',
          700: '#573E7E',
          800: '#402E5E',
          900: '#2E2144',
        },
        // ── Cream page background ──
        cream: '#FAF8F5',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        wider: '0.08em',
        widest: '0.15em',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'warm-xs': '0 1px 4px rgba(60,40,20,0.06)',
        'warm-sm': '0 2px 8px rgba(60,40,20,0.08), 0 1px 3px rgba(60,40,20,0.05)',
        'warm-md': '0 4px 20px rgba(60,40,20,0.10), 0 2px 6px rgba(60,40,20,0.06)',
        'warm-lg': '0 8px 32px rgba(60,40,20,0.12), 0 2px 8px rgba(60,40,20,0.06)',
        'inner-warm': 'inset 0 1px 3px rgba(60,40,20,0.08)',
      },
      backgroundImage: {
        'cream-gradient': 'linear-gradient(135deg, #FAF8F5 0%, #F4EDE4 50%, #F0EAF5 100%)',
        'sage-gradient':  'linear-gradient(135deg, #6B8260 0%, #52664A 100%)',
        'terra-gradient': 'linear-gradient(135deg, #C96B3F 0%, #A85530 100%)',
      },
    },
  },
  plugins: [],
}

