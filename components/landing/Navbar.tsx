
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  UserRound,
  Code2,
  BriefcaseBusiness,
  FolderKanban,
  Mail,
} from "lucide-react";

const menuItems = [
  { name: "Home", mobileLabel: "Home", id: "home", icon: Home },
  { name: "About", mobileLabel: "About", id: "about", icon: UserRound },
  { name: "Skills", mobileLabel: "Skills", id: "skills", icon: Code2 },
  {
    name: "Work Experience",
    mobileLabel: "Work",
    id: "work-experience",
    icon: BriefcaseBusiness,
  },
  {
    name: "Projects",
    mobileLabel: "Projects",
    id: "projects",
    icon: FolderKanban,
  },
  {
    name: "Contact",
    mobileLabel: "Contact",
    id: "contact",
    icon: Mail,
  },
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle scroll and active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      let currentSection = "home";

      menuItems.forEach((item) => {
        const element = document.getElementById(item.id);

        if (element) {
          const rect = element.getBoundingClientRect();

          if (rect.top <= 160) {
            currentSection = item.id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Smooth navigation
  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setActiveSection(id);
    }
  };

  const isExpanded = !isScrolled || isHovered;

  return (
    <>
      {/* ================= DESKTOP FLOATING PILL ================= */}
<motion.nav
  initial={{ opacity: 0, y: -25, x: "-50%" }}
  animate={{ opacity: 1, y: 0, x: "-50%" }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  onFocusCapture={() => setIsHovered(true)}
  onBlurCapture={(event) => {
    if (
      !event.currentTarget.contains(
        event.relatedTarget as Node | null
      )
    ) {
      setIsHovered(false);
    }
  }}
  aria-label="Main navigation"
  style={{
    width: "min(700px, calc(100vw - 32px))",
  }}
  className="
    hidden md:flex fixed top-5 left-1/2
    z-[100] justify-center
  "
>

        <motion.div
          animate={{
  width: isExpanded ? "100%" : 64,
}}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 28,
          }}
          style={{
            maxWidth: "calc(100vw - 32px)",
          }}
          className="
            flex h-14 items-center overflow-hidden
            rounded-full
            border border-[#e6f3e6]
            dark:border-dark-soft/20
            bg-white/85 dark:bg-gray-900/85
            backdrop-blur-xl
            shadow-[0_8px_30px_rgba(45,74,45,0.10)]
            dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]
          "
        >
          {/* Logo */}
          <motion.button
            onClick={() => handleNavigate("home")}
            animate={{
              width: isExpanded ? 140 : 64,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
            }}
            aria-label="Go to home"
            className="
              h-full shrink-0 flex items-center justify-center
              gap-2
              text-[#2d4a2d] dark:text-pastel-soft
              font-medium tracking-wide
            "
          >
            <span className="text-xl">✦</span>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-base overflow-hidden whitespace-nowrap"
                >
                  portfolio
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Desktop Menu */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-1 items-center justify-center gap-1 pr-3"
              >
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    whileTap={{ scale: 0.94 }}
                    aria-current={
                      activeSection === item.id ? "location" : undefined
                    }
                    className={`
                      relative isolate whitespace-nowrap
                      rounded-full px-3 py-2
                      text-xs lg:text-sm font-medium
                      transition-colors duration-200
                      ${
                        activeSection === item.id
                          ? "text-[#2d4a2d] dark:text-pastel-soft"
                          : "text-[#4a6b4a] dark:text-gray-400 hover:text-[#2d4a2d] dark:hover:text-pastel-soft"
                      }
                    `}
                  >
                    {activeSection === item.id && (
                      <motion.span
                        layoutId="desktop-active"
                        className="
                          absolute inset-0 z-0 rounded-full
                          bg-[#e6f3e6] dark:bg-dark-soft/30
                        "
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}

                    <span className="relative z-10">
                      {item.name}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.nav>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
<motion.nav
  initial={{ opacity: 0, y: 60, x: "-50%" }}
  animate={{ opacity: 1, y: 0, x: "-50%" }}
  transition={{ duration: 0.5, delay: 0.2 }}
  aria-label="Mobile navigation"
  className="
    md:hidden fixed
    bottom-[max(1rem,env(safe-area-inset-bottom))]
    left-1/2
    z-[100]
    w-[calc(100%-24px)]
    max-w-md
  "
>
        <div
          className="
            flex items-center gap-1
            rounded-full p-1.5
            border border-[#e6f3e6]
            dark:border-dark-soft/20
            bg-white/90 dark:bg-gray-900/90
            backdrop-blur-xl
            shadow-[0_8px_30px_rgba(45,74,45,0.12)]
            dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
          "
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              
<motion.button
  key={item.id}
  layout
  onClick={() => handleNavigate(item.id)}
  whileTap={{ scale: 0.9 }}
  aria-label={item.name}
  aria-current={isActive ? "location" : undefined}
  title={item.name}
  transition={{
    type: "spring",
    stiffness: 350,
    damping: 28,
  }}
  className={`
    relative isolate min-w-0
    flex items-center justify-center
    gap-1.5 overflow-hidden
    rounded-full py-3 px-1
    ${
      isActive
        ? "flex-[1.8] text-[#2d4a2d] dark:text-pastel-soft"
        : "flex-1 text-[#789078] dark:text-gray-400"
    }
  `}
>
  {isActive && (
    <motion.span
      layoutId="mobile-active"
      className="
        absolute inset-0 z-0 rounded-full
        bg-[#e6f3e6] dark:bg-dark-soft/30
      "
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 28,
      }}
    />
  )}

  <Icon
    size={19}
    strokeWidth={isActive ? 2.2 : 1.8}
    className="relative z-10 shrink-0"
  />

  <AnimatePresence initial={false}>
    {isActive && (
      <motion.span
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        exit={{ opacity: 0, width: 0 }}
        transition={{ duration: 0.2 }}
        className="
          relative z-10
          overflow-hidden whitespace-nowrap
          text-[10px] font-semibold
        "
      >
        {item.mobileLabel}
      </motion.span>
    )}
  </AnimatePresence>
</motion.button>

            );
          })}
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;