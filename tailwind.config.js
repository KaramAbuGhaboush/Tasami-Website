/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'rockwell': ['Rockwell', 'serif'],
        'hacen': ['Hacen-Algeria', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-1': 'float-1 4s ease-in-out infinite',
        'float-2': 'float-2 5s ease-in-out infinite',
        'float-3': 'float-3 3.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'scroll': 'scroll 20s linear infinite',
        'carousel': 'carousel-slide 12s ease-in-out infinite',
        'fade-in-left': 'fadeInLeft 0.8s ease-out',
        'fade-in-right': 'fadeInRight 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'text-reveal': 'textReveal 0.8s ease-out forwards',
        'grid-shift': 'grid-shift 20s linear infinite',
        'float-gentle': 'float-gentle 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'float-1': {
          '0%, 100%': { transform: 'translateY(0px) rotate(3deg)' },
          '50%': { transform: 'translateY(-25px) rotate(3deg)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-30px) rotate(-2deg)' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translateY(0px) rotate(4deg)' },
          '50%': { transform: 'translateY(-22px) rotate(4deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(104, 18, 247, 0.3), 0 0 40px rgba(104, 18, 247, 0.1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(104, 18, 247, 0.5), 0 0 60px rgba(104, 18, 247, 0.2)' 
          },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'carousel-slide': {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-100%)' },
          '75%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(-200%)' },
        },
        fadeInLeft: {
          from: { opacity: '0', transform: 'translateX(-50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          from: { opacity: '0', transform: 'translateX(50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        textReveal: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'grid-shift': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(40px, 40px)' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
