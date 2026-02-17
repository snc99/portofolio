"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, ChevronDown } from "lucide-react";
import SocialMediaLinks from "./SocialMediaLinks";

const Hero = () => {
  const [data, setData] = useState<{
    motto: string | null;
    cvLink: string | null;
  }>({
    motto: null,
    cvLink: null,
  });

  const [loading, setLoading] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Muhamad Irvan Sandy";
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/home", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch home data");
        const result = await res.json();
        setData({ motto: result.motto, cvLink: result.cvLink });
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const typingSpeed = isDeleting ? 100 : 150;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (index < fullText.length) {
          setDisplayText((prev) => prev + fullText[index]);
          setIndex(index + 1);
        } else {
          // Jeda sebelum mulai menghapus
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (index > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
          setIndex(index - 1);
        } else {
          setIsDeleting(false);
          // Mulai mengetik ulang
          setTimeout(() => setIndex(0), 500);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting]);

  // Animasi variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section
      className="relative min-h-screen bg-gradient-to-br from-pastel-light via-white to-pastel-green px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden"
      id="home"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pastel-soft rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pastel-mint rounded-full opacity-20 blur-3xl"></div>
      </div>

      <motion.div
        className="max-w-4xl w-full mx-auto text-center relative z-10"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        {/* Greeting */}
        <motion.p
          variants={fadeInUp}
          className="text-pastel-soft text-lg mb-4 tracking-wide"
        >
          ✦ Welcome to my portfolio ✦
        </motion.p>

        {/* Name with typing effect */}
        <motion.div variants={fadeInUp}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-800 mb-6 leading-tight">
            <span className="block sm:inline">Hi, I'm </span>
            <span className="block sm:inline text-[#2d4a2d] font-medium">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="ml-1 inline-block w-[3px] h-12 bg-[#2d4a2d] align-middle"
              />
            </span>
          </h1>
        </motion.div>

        {/* Motto */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          {loading ? (
            <span className="inline-flex items-center">
              <span className="w-2 h-2 bg-pastel-green rounded-full animate-pulse mr-1"></span>
              <span className="w-2 h-2 bg-pastel-green rounded-full animate-pulse delay-150 mr-1"></span>
              <span className="w-2 h-2 bg-pastel-green rounded-full animate-pulse delay-300"></span>
            </span>
          ) : (
            data.motto ||
            "Passionate developer creating beautiful and functional web experiences"
          )}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12"
        >
          {loading ? (
            <>
              <button
                disabled
                className="flex items-center px-6 py-3 bg-gray-300 text-gray-500 rounded-full shadow-sm cursor-not-allowed"
              >
                <Download size={18} className="mr-2" />
                Loading...
              </button>
              <button
                disabled
                className="flex items-center px-6 py-3 bg-gray-100 text-gray-400 rounded-full cursor-not-allowed"
              >
                <Mail size={18} className="mr-2" />
                Contact Me
              </button>
            </>
          ) : (
            <>
              {data.cvLink ? (
                <motion.a
                  href={data.cvLink}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center px-6 py-3 bg-[#2d4a2d] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#1e331e]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download
                    size={18}
                    className="mr-2 group-hover:animate-bounce"
                  />
                  Download CV
                </motion.a>
              ) : (
                <button
                  disabled
                  className="flex items-center px-6 py-3 bg-gray-300 text-gray-500 rounded-full shadow-sm cursor-not-allowed"
                >
                  <Download size={18} className="mr-2" />
                  CV Tidak Tersedia
                </button>
              )}

              <motion.a
                href="#contact"
                className="group flex items-center px-6 py-3 border-2 border-[#2d4a2d] text-[#2d4a2d] rounded-full hover:bg-[#2d4a2d] hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail
                  size={18}
                  className="mr-2 group-hover:rotate-12 transition-transform"
                />
                Contact Me
              </motion.a>
            </>
          )}
        </motion.div>

        {/* Social Media Links */}
        <motion.div variants={fadeInUp}>
          {loading ? (
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <SocialMediaLinks />
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#about"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={24} className="text-gray-400" />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;
