
"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Plus,
  Minus,
  Award,
  Calendar,
} from "lucide-react";
import { formatWorkPeriod } from "@/shared/utils/formatPeriod";
import { calculateWorkDuration } from "@/shared/utils/workDuration";
import { useEffect, useRef, useState } from "react";
import { WorkExperienceData } from "@/modules/landing/work-experience/work-experience.type";

export default function WorkExperience({
  data,
}: {
  data: WorkExperienceData[];
}) {
  const experiences = data || [];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.1,
  });

  // Pengalaman terbaru otomatis terbuka
  const [openId, setOpenId] = useState<string | null>(
    experiences[0]?.id ?? null,
  );

  // Sinkronisasi jika data berubah
  useEffect(() => {
    setOpenId(experiences[0]?.id ?? null);
  }, [data]);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      id="work-experience"
      className="relative bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-30" />

            <div className="relative p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
              <Briefcase size={28} className="text-white" />
            </div>

            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-emerald-400/50"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
            />
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Work{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>

          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            My professional journey and impactful contributions
          </p>
        </motion.div>

        {/* Experience Section */}
        {experiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="text-center py-20"
          >
            <Briefcase
              size={56}
              className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
            />

            <p className="text-gray-400 dark:text-gray-500 text-lg">
              No work experience available yet
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            {experiences.map((exp, index) => {
              const isOpen = openId === exp.id;

              const startDate = new Date(exp.startDate).toISOString();
              const endDate = exp.endDate
                ? new Date(exp.endDate).toISOString()
                : null;

              const period = formatWorkPeriod(
                startDate,
                endDate,
                exp.isPresent,
              );

              const duration = calculateWorkDuration(
                startDate,
                endDate,
                exp.isPresent,
              );

              return (
                <motion.div
                  key={exp.id}
                  layout
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  {/* Accordion Header */}
                  <div className="grid grid-cols-1 md:grid-cols-[190px_minmax(0,1fr)] gap-3 md:gap-8 py-7 md:py-9">

                    {/* Date - Desktop & Mobile */}
                    <div className="flex flex-wrap items-center gap-2 md:block">
                      <div
                        className={`text-sm font-medium transition-colors duration-300 ${
                          isOpen
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {period}
                      </div>

                      {duration && (
                        <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                          {duration}
                        </span>
                      )}
                    </div>

                    {/* Position & Company */}
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggle(exp.id)}
                        aria-expanded={isOpen}
                        aria-controls={`experience-${exp.id}`}
                        className="w-full flex items-start justify-between gap-4 text-left group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3
                              className={`text-xl md:text-2xl font-medium tracking-tight transition-colors duration-300 ${
                                isOpen
                                  ? "text-emerald-700 dark:text-emerald-400"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {exp.position}
                            </h3>

                            {exp.isPresent && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-medium whitespace-nowrap">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                Current
                              </span>
                            )}
                          </div>

                          <p className="text-sm md:text-base text-emerald-600 dark:text-emerald-400 font-medium">
                            {exp.companyName}
                          </p>
                        </div>

                        {/* Plus / Minus */}
                        <span
                          className={`flex-shrink-0 mt-1 p-2 rounded-full transition-colors duration-300 ${
                            isOpen
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {isOpen ? (
                            <Minus size={22} strokeWidth={1.7} />
                          ) : (
                            <Plus size={22} strokeWidth={1.7} />
                          )}
                        </span>
                      </button>

                      {/* Expanded Content */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`experience-${exp.id}`}
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            transition={{
                              height: {
                                duration: 0.35,
                                ease: "easeInOut",
                              },
                              opacity: {
                                duration: 0.25,
                              },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 pr-2">
                              {/* Location */}
                              {exp.location && (
                                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                                  <MapPin
                                    size={15}
                                    className="text-emerald-500 flex-shrink-0"
                                  />
                                  <span>{exp.location}</span>
                                </div>
                              )}

                              {/* Description */}
                              {exp.description && (
                                <p className="max-w-3xl text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line break-words">
                                  {exp.description}
                                </p>
                              )}

                              {!exp.description && (
                                <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                                  No description available
                                </p>
                              )}

                              {/* Current Position Footer */}
                              {exp.isPresent && (
                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                                    <Award size={14} />
                                    <span>Active Contributor</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
