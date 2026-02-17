"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  X,
  LogIn,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function FloatingToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle dark mode with localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Menu items
  const menuItems = [
    { icon: <User size={18} />, label: "Profile", href: "/profile" },
    { icon: <Settings size={18} />, label: "Settings", href: "/settings" },
    { icon: <HelpCircle size={18} />, label: "Help", href: "/help" },
  ];

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-pastel-green dark:border-gray-700 p-2 min-w-[200px] mb-2"
          >
            {/* Dark mode toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="w-full p-3 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-pastel-green/20 dark:hover:bg-gray-700 rounded-xl transition-colors group"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2 bg-pastel-green/30 dark:bg-gray-700 rounded-lg group-hover:bg-pastel-green/50 transition-colors">
                {darkMode ? (
                  <Sun
                    size={18}
                    className="text-[#2d4a2d] dark:text-yellow-400"
                  />
                ) : (
                  <Moon size={18} className="text-[#2d4a2d]" />
                )}
              </div>
              <span className="text-sm font-medium flex-1 text-left">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
              <span className="text-xs text-gray-400">
                {darkMode ? "☀️" : "🌙"}
              </span>
            </motion.button>

            {/* Divider */}
            <div className="my-2 border-t border-pastel-green/30 dark:border-gray-700"></div>

            {/* Menu items */}
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="w-full p-3 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-pastel-green/20 dark:hover:bg-gray-700 rounded-xl transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 bg-pastel-green/30 dark:bg-gray-700 rounded-lg group-hover:bg-pastel-green/50 transition-colors">
                    <span className="text-[#2d4a2d] dark:text-gray-300">
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}

            {/* Divider */}
            <div className="my-2 border-t border-pastel-green/30 dark:border-gray-700"></div>

            {/* Login button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/auth/login"
                className="w-full p-3 flex items-center gap-3 text-white bg-gradient-to-r from-[#2d4a2d] to-[#1e331e] rounded-xl hover:shadow-lg transition-all group"
                onClick={() => setIsOpen(false)}
              >
                <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                  <LogIn size={18} className="text-white" />
                </div>
                <span className="text-sm font-medium flex-1 text-left">
                  Login
                </span>
                <span className="text-xs text-white/70">→</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-[#2d4a2d] text-white rotate-90"
            : "bg-pastel-green text-[#2d4a2d] hover:bg-[#2d4a2d] hover:text-white"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 90 : 0 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}

        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full animate-ping bg-pastel-green/30 opacity-75"></span>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-16 bottom-4 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap"
          >
            Quick Menu
            <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation for attention (only first visit) */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
