import { Moon, Sun, Monitor } from "lucide-react"; // Use Monitor instead of Laptop if Laptop not available, or check lucide version. lucide-react Usually has Laptop. Laptop2. Monitor.
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
        aria-label="Toggle theme"
      >
        <span className="dark:hidden">
          <Sun className="h-5 w-5 text-orange-500" />
        </span>
        <span className="hidden dark:block">
          <Moon className="h-5 w-5 text-blue-400" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden text-gray-700 dark:text-gray-200">
          <button
            onClick={() => { setTheme("light"); setIsOpen(false); }}
            className={`w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${theme === 'light' ? 'text-cyan-500 font-medium bg-cyan-50/50 dark:bg-cyan-900/20' : ''}`}
          >
            <Sun size={16} /> Light
          </button>
          <button
            onClick={() => { setTheme("dark"); setIsOpen(false); }}
            className={`w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${theme === 'dark' ? 'text-cyan-500 font-medium bg-cyan-50/50 dark:bg-cyan-900/20' : ''}`}
          >
            <Moon size={16} /> Dark
          </button>
          <button
            onClick={() => { setTheme("system"); setIsOpen(false); }}
            className={`w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${theme === 'system' ? 'text-cyan-500 font-medium bg-cyan-50/50 dark:bg-cyan-900/20' : ''}`}
          >
            <Monitor size={16} /> System
          </button>
        </div>
      )}
    </div>
  );
}
