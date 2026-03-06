"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Code2, Sparkles } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  photo: string;
}

export default function Skills({ data }: { data: Skill[] }) {
  const skills = data || [];

  return (
    <section
      id="skills"
      className="relative bg-gradient-to-br from-pastel-light via-white to-pastel-green/20 dark:from-dark-light dark:to-dark-light dark:via-gray-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Decorative background elements untuk dark mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pastel-green/10 dark:bg-dark-green/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pastel-soft/20 dark:bg-dark-soft/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pastel-green/5 to-pastel-soft/5 dark:from-dark-green/5 dark:to-dark-soft/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-pastel-green to-pastel-soft dark:from-dark-green dark:to-dark-soft rounded-2xl mb-6 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Code2 size={32} className="text-[#2d4a2d] dark:text-pastel-soft" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-light text-gray-800 dark:text-gray-200 mb-4">
            Technical{" "}
            <span className="text-[#2d4a2d] dark:text-pastel-soft font-semibold">
              Skills
            </span>
          </h2>
        </motion.div>

        {/* Skills Grid - 3D Cards */}
        {skills.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                className="relative group perspective"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="relative preserve-3d cursor-pointer w-full h-full"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Front of card */}
                  <div className="backface-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center min-h-[200px]">
                    <div className="w-20 h-20 relative mb-4">
                      <Image
                        src={skill.photo}
                        alt={skill.name}
                        fill
                        className="object-contain dark:brightness-90 dark:invert-0"
                      />
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {skill.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Click to flip
                    </p>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute inset-0 backface-hidden bg-gradient-to-br from-pastel-green to-pastel-soft dark:from-dark-green dark:to-dark-soft rounded-2xl p-6 flex flex-col items-center justify-center text-white dark:text-gray-100 min-h-[200px]"
                    style={{
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <Sparkles size={32} className="mb-3" />
                    <p className="text-sm text-center">
                      {index % 2 === 0 ? "Expert" : "Advanced"}
                    </p>
                    <div className="flex gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < (index % 5) + 3
                              ? "bg-white dark:bg-white"
                              : "bg-white/30 dark:bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
              <Code2 size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No skills available
            </p>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
}
