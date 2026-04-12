"use client";

import { motion, useInView } from "framer-motion";
import {
  Folder,
  Globe,
  Code2,
  Github,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ProjectData {
  id: string;
  title: string;
  description?: string | null;
  link?: string | null;
  github?: string | null;
  projectImage?: string | null;
  skills: {
    name: string;
    photo: string;
  }[];
}

export default function Project({ data }: { data: ProjectData[] }) {
  const projects = data || [];
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    watchDrag: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);

    return () => {
      emblaApi.off("select", update);
    };
  }, [emblaApi]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-gradient-to-b from-pastel-light to-white dark:from-dark-light dark:to-gray-900 py-20 overflow-hidden"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-pastel-green/10 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-pastel-soft/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex p-3 bg-pastel-green rounded-full mb-4">
            <Code2 size={28} />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold">
            Featured <span className="text-[#2d4a2d]">Projects</span>
          </h2>

          <p className="text-gray-500 mt-2">
            A collection of projects I've built.
          </p>
        </motion.div>

        {/* EMPTY */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <Folder size={40} className="mx-auto text-gray-400" />
            <p className="text-gray-500 mt-3">No projects available</p>
          </div>
        ) : (
          <div className="relative">
            {/* 🔥 LEFT BUTTON */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={`absolute -left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full ${
                canScrollPrev
                  ? "bg-white shadow hover:bg-pastel-green"
                  : "opacity-30 cursor-not-allowed bg-gray-100"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* 🔥 RIGHT BUTTON */}
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full ${
                canScrollNext
                  ? "bg-white shadow hover:bg-pastel-green"
                  : "opacity-30 cursor-not-allowed bg-gray-100"
              }`}
            >
              <ChevronRight size={20} />
            </button>

            {/* 🔥 CAROUSEL */}
            <div ref={emblaRef} className="overflow-hidden select-none">
              <div className="flex">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="
                      flex-[0_0_100%]
                      sm:flex-[0_0_50%]
                      lg:flex-[0_0_33.333%]
                      p-3
                      min-w-0
                    "
                  >
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-pastel-green to-pastel-soft opacity-0 group-hover:opacity-30 blur rounded-2xl"></div>

                      <div className="relative bg-white/80 backdrop-blur rounded-2xl border overflow-hidden shadow-lg hover:shadow-xl transition">
                        {/* IMAGE */}
                        <div className="relative h-40">
                          <Image
                            src={
                              project.projectImage ||
                              "https://placehold.co/600x400"
                            }
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition"
                          />
                        </div>

                        {/* CONTENT */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold">
                            {project.title}
                          </h3>

                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {project.description}
                          </p>

                          <div className="flex gap-2 mt-3 flex-wrap">
                            {project.skills.map((skill, i) => (
                              <div key={i} className="w-5 h-5 relative">
                                <Image
                                  src={skill.photo}
                                  alt={skill.name}
                                  fill
                                />
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-3 mt-4 text-sm">
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                className="flex items-center gap-1"
                              >
                                <Globe size={16} /> Demo
                              </a>
                            )}
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                className="flex items-center gap-1"
                              >
                                <Github size={16} /> Code
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
