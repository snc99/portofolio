"use client";

import { formatDateToIndonesia } from "@/lib/formatDate";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Building2 } from "lucide-react";

interface WorkExperienceData {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  description: string;
  location?: string; // Optional: untuk lokasi perusahaan
  companyLogo?: string; // Optional: untuk logo perusahaan
}

export default function WorkExperience() {
  const [experiences, setExperiences] = useState<WorkExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkExperience = async () => {
      try {
        const res = await fetch("/api/work-experience", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch work experience data");
        const result = await res.json();
        setExperiences(result || []);
      } catch (error) {
        console.error("Error fetching work experience data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkExperience();
  }, []);

  // Animasi variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      id="work"
      className="relative bg-gradient-to-b from-white to-pastel-light py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-pastel-mint rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pastel-soft rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-pastel-green rounded-full mb-4">
            <Briefcase size={28} className="text-[#2d4a2d]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            Work <span className="text-[#2d4a2d] font-medium">Experience</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            My professional journey and the places I've contributed my skills
          </p>
          <div className="w-24 h-1 bg-pastel-soft mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-pastel-green via-pastel-soft to-pastel-mint"></div>

          {loading ? (
            // Skeleton loading
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="md:w-1/2 md:text-right">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="md:w-1/2">
                    <div className="bg-white/60 rounded-xl p-6 border border-pastel-green">
                      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : experiences.length === 0 ? (
            // Empty state
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-pastel-green rounded-full mb-6">
                <Briefcase size={40} className="text-[#2d4a2d]" />
              </div>
              <p className="text-gray-600 text-xl mb-2">
                No work experience yet
              </p>
              <p className="text-gray-400">Check back later for updates</p>
            </motion.div>
          ) : (
            experiences.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={exp.id}
                  variants={itemVariants}
                  className={`flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-6 md:gap-8 items-start mb-12 relative`}
                >
                  {/* Date */}
                  <div
                    className={`md:w-1/2 ${isEven ? "md:text-right" : "md:text-left"}`}
                  >
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-pastel-green shadow-sm">
                      <Calendar size={16} className="text-[#2d4a2d]" />
                      <span className="text-sm font-medium text-gray-700">
                        {formatDateToIndonesia(exp.startDate)} -{" "}
                        {exp.isPresent ? (
                          <span className="text-[#2d4a2d] font-semibold">
                            Present
                          </span>
                        ) : (
                          formatDateToIndonesia(exp.endDate || "")
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2d4a2d] rounded-full"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pastel-green rounded-full animate-ping opacity-20"></div>
                  </div>

                  {/* Content card */}
                  <div className="md:w-1/2">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pastel-green shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-[#2d4a2d]">
                            {exp.position}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Building2 size={16} />
                            <span className="text-sm">{exp.companyName}</span>
                          </div>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-1 text-gray-500 text-sm bg-pastel-green/30 px-2 py-1 rounded">
                            <MapPin size={14} />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <p className="text-gray-600 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>

                      {/* Present badge */}
                      {exp.isPresent && (
                        <div className="mt-4 inline-flex items-center gap-1 bg-[#2d4a2d] text-white text-xs px-2 py-1 rounded-full">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          Currently Working
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Experience stats */}
        {!loading && experiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-500">
              <span className="text-[#2d4a2d] font-semibold text-lg">
                {experiences.length}
              </span>{" "}
              years of professional experience
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
