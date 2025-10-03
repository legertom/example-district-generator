/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./public/index.html",
    "./src/**/*",
  ],
  safelist: [
    "rounded-xl",
    "rounded-2xl",
    "border",
    "border-slate-200",
    "border-slate-300",
    "bg-white",
    "bg-white/70",
    "bg-slate-50/60",
    "shadow-sm",
    "hover:shadow-md",
    "focus:ring-4",
    "focus:ring-indigo-200",
    "focus:border-indigo-400",
    "ring-indigo-100",
    "text-slate-900",
    "text-slate-500",
    "text-indigo-600",
    "bg-indigo-600",
    "hover:bg-indigo-700",
    "text-white",
    "py-3",
    "px-5",
    "w-full",
    "max-w-3xl",
    "max-w-2xl",
    "mx-auto",
    "p-6",
    "p-3",
    "gap-8",
    "gap-5",
    "gap-2",
    "items-center",
    "justify-center",
    "transition",
    "outline-none",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1E40AF',
          green: '#10B981',
          orange: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
