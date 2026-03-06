"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";

export default function FloatingToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="bg-white dark:bg-gray-800 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[180px] space-y-2"
          >
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full p-3 flex items-center justify-between text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            >
              <span className="text-sm font-medium">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
              <motion.div
                key={theme}
                initial={{ rotate: -30, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "light" ? (
                  <Moon
                    size={18}
                    className="text-gray-600 dark:text-gray-400"
                  />
                ) : (
                  <Sun size={18} className="text-yellow-500" />
                )}
              </motion.div>
            </button>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Login Button */}
            <Link
              href="/auth/login"
              className="w-full p-3 flex items-center gap-3 text-white bg-[#2d4a2d] dark:bg-emerald-700 rounded-lg hover:bg-[#1e331e] dark:hover:bg-emerald-800 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <LogIn size={18} />
              <span className="text-sm font-medium">Login</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg transition-all ${
          isOpen
            ? "bg-[#2d4a2d] dark:bg-emerald-700 text-white"
            : "bg-pastel-green dark:bg-gray-700 text-[#2d4a2d] dark:text-gray-200 hover:bg-[#2d4a2d] dark:hover:bg-emerald-700 hover:text-white"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.div>
      </motion.button>
    </div>
  );
}
