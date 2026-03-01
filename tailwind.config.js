/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    darkMode: "class",
    extend: {
      keyframes: {
        'float-up':   { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(-50%)' } },
        'float-down': { '0%': { transform: 'translateY(-50%)' }, '100%': { transform: 'translateY(0)' } },
        'scan':       { '0%': { top: '0%' }, '100%': { top: '100%' } },
      },
      animation: {
        'float-up':   'float-up 20s linear infinite',
        'float-down': 'float-down 20s linear infinite',
        'scan':       'scan 2s linear infinite',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
            foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        brand: "var(--brand)",
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
    },
  },
  plugins: [],
};
