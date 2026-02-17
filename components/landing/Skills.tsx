"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Code2, Sparkles, Cpu } from "lucide-react";

interface Skill {
  id: number;
  name: string;
  photo: string;
  category?: string; // Optional: untuk kategorisasi skill
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skill", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch skills data");
        const result = await res.json();
        setSkills(result);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Kategorisasi skill (contoh, bisa disesuaikan dengan data asli)
  const categories = [
    { id: "all", name: "All", icon: <Sparkles size={16} /> },
    { id: "frontend", name: "Frontend", icon: <Code2 size={16} /> },
    { id: "backend", name: "Backend", icon: <Cpu size={16} /> },
  ];

  // Filter skills berdasarkan kategori
  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  // Animasi variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <section
      id="skills"
      className="relative bg-gradient-to-b from-pastel-light to-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-72 h-72 bg-pastel-mint rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-pastel-soft rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-pastel-green rounded-full mb-4">
            <Code2 size={28} className="text-[#2d4a2d]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            Technical <span className="text-[#2d4a2d] font-medium">Skills</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>
          <div className="w-24 h-1 bg-pastel-soft mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Category Filter */}
        {!loading && skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-[#2d4a2d] text-white shadow-md"
                    : "bg-white/80 text-gray-600 hover:bg-pastel-green border border-pastel-soft"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Skills Grid */}
        {loading ? (
          // Skeleton Loader yang lebih menarik
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <motion.div
                key={index}
                className="aspect-square bg-white rounded-xl shadow-sm border border-pastel-green p-3"
                variants={itemVariants}
              >
                <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
              </motion.div>
            ))}
          </motion.div>
        ) : filteredSkills.length > 0 ? (
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.id}
                className="relative group"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <div className="aspect-square bg-white rounded-xl shadow-sm hover:shadow-lg border border-pastel-green p-4 flex flex-col items-center justify-center transition-all duration-300">
                  {/* Icon/Skill Image */}
                  <div className="w-12 h-12 relative mb-2">
                    <Image
                      src={skill.photo}
                      alt={skill.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Skill Name - Always visible */}
                  <p className="text-xs font-medium text-gray-700 text-center line-clamp-1">
                    {skill.name}
                  </p>

                  {/* Hover overlay dengan efek glassmorphism */}
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center border-2 border-pastel-green">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#2d4a2d] mb-1">
                        {skill.name}
                      </p>
                      <div className="w-12 h-1 bg-pastel-soft rounded-full mx-auto"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty state yang lebih menarik
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pastel-green rounded-full mb-4">
              <Code2 size={32} className="text-[#2d4a2d]" />
            </div>
            <p className="text-gray-600 text-lg mb-2">No skills available</p>
            <p className="text-gray-400">Check back later for updates</p>
          </motion.div>
        )}

        {/* Skill Stats */}
        {!loading && skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-500 text-sm">
              <span className="text-[#2d4a2d] font-semibold text-lg">
                {skills.length}
              </span>{" "}
              skills mastered and counting
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
