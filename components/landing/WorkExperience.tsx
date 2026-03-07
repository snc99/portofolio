"use client";

import { motion, Variants, useInView } from "framer-motion";
import {
  Briefcase,
  Calendar,
  MapPin,
  Building2,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";
import { formatWorkPeriod } from "@/shared/utils/formatPeriod";
import { calculateWorkDuration } from "@/shared/utils/workDuration";
import { useRef, useState, useEffect } from "react";
import { WorkExperienceData } from "@/modules/landing/landing.types";

export default function WorkExperience({
  data,
}: {
  data: WorkExperienceData[];
}) {
  const experiences = data || [];
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate total experience
  const totalYears = experiences.reduce((acc, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.isPresent ? new Date() : new Date(exp.endDate!);
    const years =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return acc + years;
  }, 0);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-gradient-to-b from-white to-pastel-light dark:from-gray-900 dark:to-dark-light py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-pastel-green/10 dark:bg-dark-green/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-pastel-soft/10 dark:bg-dark-soft/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Floating particles */}
        {mounted &&
          [...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-pastel-green/30 dark:bg-dark-green/30 rounded-full"
              style={{
                left: `${(i * 20) % 100}%`,
                top: `${(i * 15) % 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center p-3 bg-pastel-green dark:bg-dark-soft rounded-full mb-4 relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Briefcase size={28} className="text-[#2d4a2d] dark:text-white" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-pastel-green dark:border-dark-soft"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-light text-gray-800 dark:text-gray-200 mb-4">
            Work{" "}
            <span className="text-[#2d4a2d] dark:text-pastel-soft font-medium">
              Experience
            </span>
          </h2>

          <motion.p
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            My professional journey and the places I've contributed my skills
          </motion.p>

          {/* Stats badge */}
          {experiences.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.4, type: "spring" }}
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-pastel-green dark:border-dark-soft"
            >
              <Clock
                size={16}
                className="text-[#2d4a2d] dark:text-pastel-soft"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Experience:{" "}
                <span className="font-semibold text-[#2d4a2d] dark:text-pastel-soft">
                  {Math.round(totalYears * 10) / 10} years
                </span>
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Timeline */}
        {experiences.length > 0 && (
          <motion.div className="relative">
            {/* Animated timeline line */}
            <motion.div
              className="absolute left-5 md:left-1/2 md:-translate-x-1/2 w-0.5 h-full"
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : {}}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <div className="w-full h-full bg-gradient-to-b from-pastel-green via-pastel-soft to-pastel-mint dark:from-dark-green dark:via-dark-soft dark:to-dark-mint"></div>
            </motion.div>

            {experiences.map((exp, index) => {
              console.log("LOCATION DEBUG:", exp.companyName, exp.location);
              const isEven = index % 2 === 0;
              const duration = calculateWorkDuration(
                exp.startDate,
                exp.endDate,
                exp.isPresent,
              );

              return (
                <motion.div
                  key={exp.id}
                  className="relative flex md:items-center mb-12 last:mb-0"
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + index * 0.15,
                    type: "spring",
                  }}
                  onHoverStart={() => setHoveredId(exp.id)}
                  onHoverEnd={() => setHoveredId(null)}
                >
                  {/* Animated timeline dot */}
                  <motion.div
                    className="absolute left-5 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.8 + index * 0.15, type: "spring" }}
                  >
                    <motion.div
                      className="w-4 h-4 bg-[#2d4a2d] dark:bg-pastel-soft rounded-full z-10"
                      animate={
                        hoveredId === exp.id
                          ? {
                              scale: [1, 1.5, 1],
                              boxShadow: [
                                "0 0 0 0px rgba(45,74,45,0.5)",
                                "0 0 0 10px rgba(45,74,45,0)",
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    />
                    <motion.div
                      className="absolute w-8 h-8 bg-pastel-green dark:bg-dark-green rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                  </motion.div>

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      isEven ? "md:pr-10 md:text-right" : "md:ml-auto md:pl-10"
                    }`}
                  >
                    <motion.div
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-pastel-green dark:border-dark-soft shadow-lg hover:shadow-2xl transition-all"
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        boxShadow: "0 20px 40px -10px rgba(45,74,45,0.3)",
                      }}
                    >
                      {/* Header with company and date */}
                      <div
                        className={`flex items-center gap-2 mb-3 ${isEven ? "md:flex-row-reverse" : ""}`}
                      >
                        {/* Company icon with animation */}
                        <motion.div
                          className="p-2 bg-pastel-green/20 dark:bg-dark-soft/20 rounded-lg"
                          animate={
                            hoveredId === exp.id
                              ? { rotate: [0, 10, -10, 0] }
                              : {}
                          }
                          transition={{ duration: 0.3 }}
                        >
                          <Building2
                            size={18}
                            className="text-[#2d4a2d] dark:text-pastel-soft"
                          />
                        </motion.div>

                        <div
                          className={`flex-1 ${isEven ? "md:text-right" : ""}`}
                        >
                          <h3 className="text-lg font-semibold text-[#2d4a2d] dark:text-pastel-soft">
                            {exp.position}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {exp.companyName}
                          </p>
                        </div>
                      </div>

                      {/* Date and duration */}
                      <div
                        className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3 ${isEven ? "md:justify-end" : ""}`}
                      >
                        <Calendar
                          size={14}
                          className="text-gray-400 dark:text-gray-500"
                        />
                        <span>
                          {formatWorkPeriod(
                            exp.startDate,
                            exp.endDate,
                            exp.isPresent,
                          )}
                        </span>

                        {/* Duration badge */}
                        {duration && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 1.2 + index * 0.15 }}
                            className="text-xs bg-pastel-green/20 dark:bg-dark-soft/20 text-[#2d4a2d] dark:text-pastel-soft px-2 py-0.5 rounded-full"
                          >
                            {duration}
                          </motion.span>
                        )}
                      </div>

                      {/* Location */}
                      {exp.location && (
                        <motion.div
                          className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-3 ${
                            isEven ? "md:justify-end" : ""
                          }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 1 + index * 0.15 }}
                        >
                          <MapPin size={14} />
                          <span>{exp.location}</span>
                        </motion.div>
                      )}

                      {/* Description - FIXED: PISAHKAN whileHover UNTUK LIGHT DAN DARK MODE */}
                      {exp.description && (
                        <motion.div
                          className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors duration-300 hover:bg-[#f0fdf4] dark:hover:bg-dark-green/50"
                          whileHover={{ scale: 1.01 }}
                        >
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        </motion.div>
                      )}

                      {/* Current work badge with animation */}
                      {exp.isPresent && (
                        <motion.div
                          className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#2d4a2d] to-pastel-green dark:from-dark-green dark:to-dark-soft text-white text-xs px-3 py-1.5 rounded-full"
                          initial={{ opacity: 0, y: 10 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 1.4 + index * 0.15 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Award size={14} />
                          <span>Currently Working</span>
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
        {/* Footer with total count */}
        {experiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-16 text-center"
          >
            <motion.div
              className="inline-flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles
                size={20}
                className="text-pastel-green dark:text-dark-green"
              />
              <p className="text-gray-500 dark:text-gray-400">
                <span className="text-[#2d4a2d] dark:text-pastel-soft font-semibold text-lg">
                  {experiences.length}
                </span>{" "}
                professional experiences
              </p>
              <Sparkles
                size={20}
                className="text-pastel-soft dark:text-dark-soft"
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 dark:text-gray-500 text-lg">
            Work experience data is not available yet.
          </p>
        </div>
      )}
    </section>
  );
}
