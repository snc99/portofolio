"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle active section based on scroll position
  useEffect(() => {
    const sections = [
      "home",
      "about",
      "skills",
      "work-experience",
      "projects",
      "contact",
    ];

    const handleScroll = () => {
      // Handle navbar background
      setIsScrolled(window.scrollY > 20);

      // Handle active section
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll smoothly when clicking on a section link
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  const menuItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Work Experience", id: "work-experience" },
    { name: "Projects", id: "projects" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-[#e6f3e6] dark:border-dark-soft/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl font-light text-[#2d4a2d] dark:text-pastel-soft tracking-wide">
              ✦ portfolio
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  activeSection === item.id
                    ? "text-[#2d4a2d] dark:text-pastel-soft"
                    : "text-[#4a6b4a] dark:text-gray-400 hover:text-[#2d4a2d] dark:hover:text-pastel-soft"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 bg-[#e6f3e6] dark:bg-dark-soft/20 rounded-full -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Hamburger menu for mobile view */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#4a6b4a] dark:text-gray-400 hover:text-[#2d4a2d] dark:hover:text-pastel-soft focus:outline-none p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-pastel-green/20 dark:bg-gray-800/90 backdrop-blur-md border-t border-[#e6f3e6] dark:border-dark-soft/20"
        >
          <div className="px-4 py-2 space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-[#e6f3e6] dark:bg-dark-soft/20 text-[#2d4a2d] dark:text-pastel-soft"
                    : "text-[#4a6b4a] dark:text-gray-400 hover:bg-[#e6f3e6] dark:hover:bg-dark-soft/20 hover:text-[#2d4a2d] dark:hover:text-pastel-soft"
                }`}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
