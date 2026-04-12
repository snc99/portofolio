"use client";

import { motion, useInView } from "framer-motion";
import {
  Briefcase,
  Calendar,
  MapPin,
  Building2,
  ChevronRight,
  ChevronLeft,
  Star,
  Sparkles,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { formatWorkPeriod } from "@/shared/utils/formatPeriod";
import { calculateWorkDuration } from "@/shared/utils/workDuration";
import { useRef, useState, useEffect } from "react";
import { WorkExperienceData } from "@/modules/landing/work-experience/work-experience.type";
import useEmblaCarousel from "embla-carousel-react";

export default function WorkExperience({
  data,
}: {
  data: WorkExperienceData[];
}) {
  const experiences = data || [];
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    watchDrag: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);

    return () => {
      emblaApi.off("select", update);
    };
  }, [emblaApi]);

  const truncateText = (text: string, max = 120) => {
    if (!text) return "No description available";
    if (text.length <= max) return text;
    return text.slice(0, max) + "...";
  };

  return (
    <section
      ref={sectionRef}
      id="work-experience"
      className="relative bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-amber-200/10 to-rose-200/10 dark:from-amber-500/5 dark:to-rose-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Floating Particles */}
        {mounted &&
          [...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(135deg, ${
                  ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"][i % 4]
                }, transparent)`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.sin(i) * 25, 0],
                opacity: [0, 0.5, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center relative mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>

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

        {/* Content Section */}
        {experiences.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            className="text-center py-20"
          >
            <Briefcase
              size={64}
              className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
            />
            <p className="text-gray-400 dark:text-gray-500 text-lg">
              No work experience available yet
            </p>
          </motion.div>
        ) : (
          <div className="relative px-8 md:px-12">
            {/* Navigation Buttons */}
            <div className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20">
              <motion.button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                  canScrollPrev
                    ? "bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white cursor-pointer"
                    : "bg-gray-100/50 dark:bg-gray-800/50 opacity-40 cursor-not-allowed"
                }`}
                whileHover={canScrollPrev ? { scale: 1.1 } : {}}
                whileTap={canScrollPrev ? { scale: 0.95 } : {}}
              >
                <ChevronLeft size={20} />
              </motion.button>
            </div>

            <div className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20">
              <motion.button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                  canScrollNext
                    ? "bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white cursor-pointer"
                    : "bg-gray-100/50 dark:bg-gray-800/50 opacity-40 cursor-not-allowed"
                }`}
                whileHover={canScrollNext ? { scale: 1.1 } : {}}
                whileTap={canScrollNext ? { scale: 0.95 } : {}}
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>

            {/* Carousel Container */}
            <div ref={emblaRef} className="overflow-hidden w-full">
              <div className="flex -mx-2">
                {experiences.map((exp, idx) => {
                  const duration = calculateWorkDuration(
                    exp.startDate,
                    exp.endDate,
                    exp.isPresent,
                  );

                  return (
                    <div
                      key={exp.id}
                      className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-2"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl h-full flex flex-col shadow-sm">
                        {/* HEADER GRADIENT */}
                        <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

                        <div className="p-5 flex flex-col h-full">
                          {/* TITLE */}
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {exp.position}
                              </h3>
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 truncate">
                                {exp.companyName}
                              </p>
                            </div>

                            {exp.isPresent && (
                              <span className="text-[10px] px-2 py-1 bg-emerald-500 text-white rounded-full">
                                Current
                              </span>
                            )}
                          </div>

                          {/* DATE */}
                          <div className="text-xs text-gray-500 mb-2">
                            {formatWorkPeriod(
                              exp.startDate,
                              exp.endDate,
                              exp.isPresent,
                            )}
                          </div>

                          {/* LOCATION */}
                          {exp.location && (
                            <div className="text-xs text-gray-400 mb-3 truncate">
                              {exp.location}
                            </div>
                          )}

                          {/* DESCRIPTION (FIXED HEIGHT) */}
                          <div className="flex-1">
                            <div className="h-[110px] bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-5">
                                {truncateText(exp.description || "", 120)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carousel Indicators */}
            {experiences.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-8">
                {scrollSnaps.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => emblaApi?.scrollTo(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === selectedIndex
                        ? "w-6 bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "w-1.5 bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
