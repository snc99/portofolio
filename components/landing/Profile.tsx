"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, ChevronDown } from "lucide-react";
import Image from "next/image";

interface ProfileData {
  motto: string | null;
  cvLink: string | null;
}

export default function Profile({ data }: { data: ProfileData | null }) {
  const fullText = "Muhamad Irvan Sandy";
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 80 : 120;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (index < fullText.length) {
          setIndex((prev) => prev + 1);
        } else {
          setIsDeleting(true);
        }
      } else {
        if (index > 0) {
          setIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting]);

  const displayText = fullText.slice(0, index);

  const fadeInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section
      className="relative min-h-screen bg-gradient-to-br from-pastel-light via-white to-pastel-green dark:from-dark-light dark:via-gray-900 dark:to-dark-green px-4 sm:px-6 flex items-center justify-center overflow-hidden"
      id="home"
    >
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Kiri - Text Content */}
        <motion.div
          className="text-center lg:text-left order-2 lg:order-1"
          initial="initial"
          animate="animate"
        >
          <motion.p
            variants={fadeInLeft}
            className="text-[#6da78d] dark:text-pastel-mint text-sm sm:text-base mb-3 tracking-wide"
          >
            ✦ Welcome to my portfolio ✦
          </motion.p>

          <motion.div variants={fadeInLeft}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 dark:text-gray-200 mb-4 leading-tight">
              <span className="block">Hi, I'm</span>
              <span className="text-[#2d4a2d] dark:text-pastel-soft font-medium break-words inline-block max-w-full">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1 inline-block w-[2px] h-8 bg-[#2d4a2d] dark:bg-pastel-soft align-middle"
                />
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeInLeft}
            className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto lg:mx-0 mb-6"
          >
            {data?.motto ||
              "Passionate developer creating beautiful and functional web experiences"}
          </motion.p>

          <motion.div
            variants={fadeInLeft}
            className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start mb-12"
          >
            {data?.cvLink ? (
              <motion.a
                href={data.cvLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center px-5 py-2.5 bg-[#2d4a2d] dark:bg-dark-soft text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#1e331e] dark:hover:bg-dark-green text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download
                  size={16}
                  className="mr-2 group-hover:animate-bounce"
                />
                Download CV
              </motion.a>
            ) : (
              <button
                disabled
                className="flex items-center px-5 py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full shadow-sm cursor-not-allowed text-sm sm:text-base"
              >
                <Download size={16} className="mr-2" />
                CV Tidak Tersedia
              </button>
            )}

            <motion.a
              href="#contact"
              className="group flex items-center px-5 py-2.5 border-2 border-[#2d4a2d] dark:border-pastel-soft text-[#2d4a2d] dark:text-pastel-soft rounded-full hover:bg-[#2d4a2d] dark:hover:bg-dark-soft hover:text-white dark:hover:text-white transition-all duration-300 text-sm sm:text-base"
            >
              <Mail size={16} className="mr-2" />
              Contact Me
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Kanan - Foto dengan Efek Hidup */}
        <motion.div
          className="relative order-1 lg:order-2 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Lingkaran berputar di luar - warna disesuaikan untuk dark mode */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#2d4a2d]/30 dark:border-pastel-soft/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Lingkaran kedua berputar berlawanan */}
          <motion.div
            className="absolute inset-2 rounded-full border border-[#2d4a2d]/20 dark:border-pastel-soft/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Background blur yang bergerak */}
          <motion.div
            className="absolute inset-0 bg-[#2d4a2d]/10 dark:bg-pastel-soft/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Decorative elements yang bergerak */}
          <motion.div
            className="absolute -top-4 -right-4 w-20 h-20 border-2 border-[#2d4a2d]/20 dark:border-pastel-soft/20 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <motion.div
            className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#2d4a2d]/5 dark:bg-pastel-soft/5 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          {/* Dots pattern yang bergerak */}
          <motion.div
            className="absolute -z-10 top-10 -right-10 grid grid-cols-3 gap-2"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 12, repeat: Infinity }}
          >
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-[#2d4a2d]/20 dark:bg-pastel-soft/20 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>

          {/* Foto dengan floating effect */}
          <motion.div
            className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 relative z-10">
              <Image
                src="/picture1.png"
                alt="Profile"
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Inner glow yang berdenyut - warna disesuaikan */}
            <motion.div
              className="absolute inset-0 rounded-full shadow-inner"
              animate={{
                boxShadow: [
                  "inset 0 0 20px rgba(45, 74, 45, 0.2)",
                  "inset 0 0 40px rgba(45, 74, 45, 0.4)",
                  "inset 0 0 20px rgba(45, 74, 45, 0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown size={24} className="text-gray-400 dark:text-gray-500" />
      </motion.a>
    </section>
  );
}
