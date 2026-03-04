import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "motion/react";

export function ThemeToggle() {
  const { isDark, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="md:w-10 md:h-10 w-8 h-8 flex items-center justify-center rounded-xl bg-background hover:bg-background/80  transition-colors border border-border  relative overflow-hidden backdrop-blur-sm"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ y: 20, opacity: 0, rotate: 45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: -45 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="md:h-5 md:w-5 h-4 w-4 text-blue-400" />
          ) : (
            <Sun className="md:h-5 md:w-5 h-4 w-4 text-orange-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
