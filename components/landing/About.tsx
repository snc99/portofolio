"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { User } from "lucide-react";
import Image from "next/image";

interface AboutData {
  photo: string | null;
  description: string | null;
}

export default function About({ data }: { data: AboutData | null }) {
  const aboutContent =
    data?.description || "Passionate quality assurance engineer.";

  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Typewriter effect
  useEffect(() => {
    if (!aboutContent || !isInView || isTypingComplete) return;

    setDisplayedText("");
    setIsTypingComplete(false);

    let index = 0;

    const interval = setInterval(() => {
      setDisplayedText(aboutContent.slice(0, index));
      index++;

      if (index > aboutContent.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [aboutContent, isInView]);

  const fadeInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-gradient-to-b from-white to-pastel-light dark:from-gray-900 dark:to-dark-light py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-pastel-green dark:bg-dark-soft rounded-full mb-4">
            <User size={24} className="text-[#2d4a2d] dark:text-pastel-soft" />
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-gray-800 dark:text-gray-200 mb-4">
            About{" "}
            <span className="text-[#2d4a2d] dark:text-pastel-soft font-medium">
              Me
            </span>
          </h2>

          <div className="w-24 h-1 bg-pastel-soft dark:bg-dark-soft mx-auto rounded-full"></div>
        </motion.div>

        {/* Content dengan Foto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Kiri - Foto dengan Efek */}
          <motion.div
            className="relative order-2 lg:order-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Lingkaran berputar */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#2d4a2d]/30 dark:border-pastel-soft/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            {/* Lingkaran kedua */}
            <motion.div
              className="absolute inset-2 rounded-full border border-[#2d4a2d]/20 dark:border-pastel-soft/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Background blur */}
            <motion.div
              className="absolute inset-0 bg-[#2d4a2d]/10 dark:bg-pastel-soft/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Elemen dekoratif */}
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

            {/* Dots pattern */}
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
                  src={data?.photo || "/picture2.png"}
                  alt="About Me"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Inner glow */}
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

          {/* Kanan - Text Content */}
          <motion.div
            variants={fadeInRight}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="order-1 lg:order-2"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-pastel-green dark:border-dark-soft shadow-lg">
              <h3 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <span>My Story</span>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  ✨
                </motion.span>
              </h3>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {displayedText || (isInView ? "" : aboutContent.slice(0, 50))}

                {!isTypingComplete && isInView && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-[2px] h-5 bg-[#2d4a2d] dark:bg-pastel-soft ml-1 align-middle"
                  />
                )}
              </p>

              {/* Decorative line after text */}
              {isTypingComplete && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8 }}
                  className="h-px bg-gradient-to-r from-transparent via-[#2d4a2d]/30 dark:via-pastel-soft/30 to-transparent mt-6"
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pastel-green/20 dark:bg-dark-green/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-pastel-soft/20 dark:bg-dark-soft/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
