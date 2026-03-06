"use client";

import { motion } from "framer-motion";
import { Heart, ArrowUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show scroll button only after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-dark-light py-8 px-4 relative overflow-hidden"
    >
      {/* Decorative background line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pastel-green dark:via-dark-soft to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Copyright dengan animasi */}
          <motion.p
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
            whileHover={{ scale: 1.02 }}
          >
            <span>© {new Date().getFullYear()}</span>

            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block mx-1"
            >
              <Heart
                size={14}
                className="text-pastel-green dark:text-dark-soft fill-pastel-green/30 dark:fill-dark-soft/30 hover:fill-pastel-green dark:hover:fill-dark-soft transition-all"
              />
            </motion.span>

            <span className="dark:text-gray-400">by</span>

            <motion.span
              className="font-medium text-gray-700 dark:text-gray-300"
              whileHover={{ color: "#6da78d" }} // Hanya untuk light mode, dark mode di-handle oleh class
            >
              Irvan Sandy
            </motion.span>

            {/* Sparkles muncul saat hover */}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="inline-block ml-1"
            >
              <Sparkles
                size={12}
                className="text-pastel-green dark:text-dark-soft"
              />
            </motion.span>
          </motion.p>

          {/* Right: Back to top dengan animasi */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={showScroll ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={scrollToTop}
              className="group relative p-3 bg-gradient-to-br from-pastel-green/50 to-pastel-soft/30 dark:from-dark-green/50 dark:to-dark-soft/30 rounded-full text-[#2d4a2d] dark:text-pastel-soft hover:bg-[#2d4a2d] dark:hover:bg-dark-green hover:text-white dark:hover:text-white transition-all shadow-md hover:shadow-lg"
              whileHover={{
                y: -4,
                scale: 1.1,
                transition: { type: "spring", stiffness: 400 },
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Back to top"
            >
              <ArrowUp size={18} />

              {/* Ripple effect */}
              <motion.span
                className="absolute inset-0 rounded-full bg-pastel-green/20 dark:bg-dark-soft/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8 }}
              />

              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 dark:bg-gray-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Back to top
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative dots */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-pastel-green/30 dark:bg-dark-soft/30"
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
