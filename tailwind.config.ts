import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy surfaces (NOT gray — has a blue tint that reads as "technical")
        surface: {
          0: '#08090f',   // Page background — near-black with blue ghost
          1: '#0d1117',   // Sidebar, primary cards
          2: '#111827',   // Hover cards, secondary surfaces
          3: '#1a2235',   // Input tracks, tertiary surfaces
          4: '#1f2d45',   // Borders, dividers
        },
        // Violet → Indigo — primary brand (more personality than flat blue)
        violet: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          900: '#3b0764',
        },
        // Cyan accent for interactive states and highlights
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Warm text (avoid pure cold white)
        ink: {
          0: '#f4f6fb',   // Headings
          1: '#c8d3e8',   // Body prose
          2: '#7a8daa',   // Labels, captions
          3: '#3d4f6b',   // Muted, disabled
        },
        // Semantic (keep for InfoCards)
        success: '#10b981',
        warning: '#f59e0b',
        danger:  '#f43f5e',
        info:    '#06b6d4',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        // Tighter line heights for display sizes — makes headings punchier
        '5xl': ['3rem',    { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1',    letterSpacing: '-0.04em' }],
        '7xl': ['4.5rem',  { lineHeight: '0.95', letterSpacing: '-0.04em' }],
      },
      backgroundImage: {
        // Core gradient — used on hero, CTAs, progress bars
        'gradient-brand':  'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #22d3ee 100%)',
        // Subtle ambient gradient for cards
        'gradient-card':   'linear-gradient(145deg, rgba(124,58,237,0.06) 0%, rgba(34,211,238,0.03) 100%)',
        // Mesh gradient for hero background
        'gradient-mesh':   'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(34,211,238,0.1) 0%, transparent 60%)',
        // Grid pattern overlay
        'grid-pattern':    'linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      boxShadow: {
        // Glow effects — key differentiator from generic dark UIs
        'glow-violet': '0 0 20px rgba(124,58,237,0.25), 0 0 60px rgba(124,58,237,0.1)',
        'glow-cyan':   '0 0 20px rgba(34,211,238,0.2),  0 0 60px rgba(34,211,238,0.08)',
        'glow-sm':     '0 0 10px rgba(124,58,237,0.2)',
        'lift':        '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
        'lift-lg':     '0 20px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.4)',
        'card':        '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover':  '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.3)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'shimmer':      'shimmer 2s linear infinite',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':        'float 6s ease-in-out infinite',
        'gradient':     'gradient-shift 8s ease infinite',
        'glow-pulse':   'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(124,58,237,0.2)' },
          '50%':      { boxShadow: '0 0 30px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.15)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
