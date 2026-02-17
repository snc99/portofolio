"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { User, Sparkles, Heart, Target } from "lucide-react";

export default function About() {
  const [aboutContent, setAboutContent] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch("/api/about", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch about data");
        const result = await res.json();
        setAboutContent(
          result.description ||
            "Passionate developer with a love for creating beautiful and functional web applications. I believe in writing clean code and building experiences that make a difference.",
        );
      } catch (error) {
        console.error("Error fetching about data:", error);
        setAboutContent(
          "Passionate developer with a love for creating beautiful and functional web applications. I believe in writing clean code and building experiences that make a difference.",
        );
      }
    };
    fetchAboutData();
  }, []);

  // Efek Typewriter - hanya jalan ketika section in view
  useEffect(() => {
    if (!aboutContent || !isInView || isTypingComplete) return;

    setDisplayedText(""); // Reset text saat mulai
    setIsTypingComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedText(aboutContent.slice(0, index));
      index++;
      if (index > aboutContent.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 30); // Kecepatan ketik sedikit lebih lambat

    return () => clearInterval(interval);
  }, [aboutContent, isInView]);

  // Data statis untuk personal info
  const personalInfo = [
    { label: "Name", value: "Muhamad Irvan Sandy" },
    { label: "Location", value: "Indonesia" },
    { label: "Email", value: "irvan@example.com" },
    { label: "Freelance", value: "Available" },
  ];

  // Interests/Loves
  const loves = [
    { icon: <Heart size={20} />, text: "Coding" },
    { icon: <Sparkles size={20} />, text: "Design" },
    { icon: <Target size={20} />, text: "Problem Solving" },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-gradient-to-b from-white to-pastel-light py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-0 w-64 h-64 bg-pastel-soft rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-pastel-mint rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-pastel-green rounded-full mb-4">
            <User size={24} className="text-[#2d4a2d]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            About <span className="text-[#2d4a2d] font-medium">Me</span>
          </h2>
          <div className="w-24 h-1 bg-pastel-soft mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left column - Personal Info */}
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="space-y-6"
          >
            {/* Personal info cards */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              {personalInfo.map((info, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-pastel-green shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-gray-500 mb-1">{info.label}</p>
                  <p className="text-gray-800 font-medium">{info.value}</p>
                </div>
              ))}
            </motion.div>

            {/* What I love */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-pastel-green"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                What I Love ❤️
              </h3>
              <div className="flex flex-wrap gap-3">
                {loves.map((love, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 bg-pastel-green rounded-full text-[#2d4a2d]"
                  >
                    {love.icon}
                    <span className="text-sm font-medium">{love.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fun fact / Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2d4a2d]">2+</div>
                <div className="text-sm text-gray-500">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2d4a2d]">20+</div>
                <div className="text-sm text-gray-500">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2d4a2d]">10+</div>
                <div className="text-sm text-gray-500">Happy Clients</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Description with typewriter */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-pastel-green shadow-lg"
          >
            <h3 className="text-2xl font-light text-gray-800 mb-4">
              My Story <span className="text-[#2d4a2d]">✨</span>
            </h3>

            <div className="relative">
              <p className="text-gray-600 leading-relaxed text-lg">
                {displayedText || (isInView ? "" : aboutContent?.slice(0, 50))}
                {!isTypingComplete && isInView && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-[2px] h-5 bg-[#2d4a2d] ml-1 align-middle"
                  />
                )}
              </p>
            </div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isTypingComplete ? { opacity: 1 } : {}}
              className="mt-6 p-4 bg-pastel-green/30 rounded-lg border-l-4 border-[#2d4a2d]"
            >
              <p className="text-gray-600 italic">
                "Building digital experiences that matter, one line of code at a
                time."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
