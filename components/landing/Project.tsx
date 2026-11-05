
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useInView,
} from "framer-motion";
import {
  Folder,
  Code2,
  Globe,
  Github,
  ExternalLink,
  X,
  ArrowUpRight,
} from "lucide-react";

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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.1,
  });

  const [selectedProject, setSelectedProject] =
    useState<ProjectData | null>(null);

  // Lock background scroll and handle Escape key
  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  // Responsive grid based on project count
  const gridClass =
    projects.length === 1
      ? "grid-cols-1 max-w-2xl"
      : projects.length === 2
        ? "grid-cols-1 sm:grid-cols-2 max-w-5xl"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl";

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative isolate overflow-hidden bg-gradient-to-b from-pastel-light to-white py-20 transition-colors duration-300 dark:from-dark-light dark:to-gray-950"
    >
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-pastel-green/20 blur-3xl dark:bg-pastel-green/5"
          animate={{
            x: [0, 30, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-pastel-soft/20 blur-3xl dark:bg-pastel-soft/5"
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(#64748b12_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-5 inline-flex rounded-2xl border border-pastel-green/30 bg-pastel-green/20 p-4 text-[#2d4a2d] shadow-sm dark:border-pastel-green/10 dark:bg-pastel-green/10 dark:text-pastel-green">
            <Code2 size={30} />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl md:text-5xl dark:text-white">
            Featured{" "}
            <span className="text-[#2d4a2d] dark:text-pastel-green">
              Projects
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 sm:text-base dark:text-gray-400">
            A collection of projects I&apos;ve built and
            explored.
          </p>
        </motion.div>

        {/* EMPTY STATE */}
        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/50 px-6 py-20 text-center dark:border-gray-700 dark:bg-gray-900/30">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
              <Folder size={30} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-700 dark:text-gray-200">
              No Projects Yet
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Projects will appear here soon.
            </p>
          </div>
        ) : (
          /* PROJECT GRID */
          <div
            className={`mx-auto grid w-full ${gridClass} gap-6`}
          >
            {projects.map((project, index) => (
              <motion.button
                key={project.id}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                }}
                whileHover={{ y: -7 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setSelectedProject(project)}
                className="group relative w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white text-left shadow-sm transition-all duration-300 hover:border-pastel-green/60 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pastel-green focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-pastel-green/40 dark:focus-visible:ring-offset-gray-950"
              >
                {/* IMAGE */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {project.projectImage ? (
                    <Image
                      src={project.projectImage}
                      alt={`${project.title} preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
                      <Folder size={48} strokeWidth={1.2} />
                    </div>
                  )}

                  {/* IMAGE OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute bottom-4 right-4 flex translate-y-2 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-gray-800 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-gray-900/95 dark:text-white">
                    View Details
                    <ArrowUpRight size={15} />
                  </div>
                </div>

                {/* CARD CONTENT */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-gray-800 transition-colors group-hover:text-[#2d4a2d] sm:text-xl dark:text-white dark:group-hover:text-pastel-green">
                      {project.title}
                    </h3>

                    <div className="shrink-0 rounded-full bg-pastel-green/20 p-2 text-[#2d4a2d] transition-colors group-hover:bg-pastel-green group-hover:text-gray-900 dark:bg-pastel-green/10 dark:text-pastel-green dark:group-hover:bg-pastel-green dark:group-hover:text-gray-900">
                      <ArrowUpRight size={17} />
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {project.description || "No description available."}
                  </p>

                  {/* TECH STACK */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {project.skills?.map((skill, i) => (
                      <div
                        key={`${skill.name}-${i}`}
                        title={skill.name}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-2 transition-colors group-hover:border-pastel-green/30 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Image
                          src={skill.photo}
                          alt={skill.name}
                          width={22}
                          height={22}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      Project Details
                    </span>

                    <span className="flex items-center gap-1 text-sm font-semibold text-[#2d4a2d] transition-all group-hover:gap-2 dark:text-pastel-green">
                      Explore Project
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* PROJECT DETAIL MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              onClick={(event) => event.stopPropagation()}
              className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:max-h-[85vh] md:grid md:grid-cols-2"
            >
              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-600 shadow-md backdrop-blur transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <X size={20} />
              </button>

              {/* LEFT: PROJECT IMAGE */}
              <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800 sm:min-h-[300px] md:min-h-[480px]">
                {selectedProject.projectImage ? (
                  <Image
                    src={selectedProject.projectImage}
                    alt={`${selectedProject.title} preview`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-5 sm:p-8"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
                    <Folder size={64} strokeWidth={1.2} />
                    <span className="text-sm">
                      No project preview
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 to-transparent p-5 md:hidden">
                  <span className="text-xs font-medium text-white/90">
                    Project Preview
                  </span>
                </div>
              </div>

              {/* RIGHT: PROJECT INFORMATION */}
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 sm:p-8">
                <div className="mb-5">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pastel-green/20 px-3 py-1.5 text-xs font-semibold text-[#2d4a2d] dark:bg-pastel-green/10 dark:text-pastel-green">
                    <Code2 size={14} />
                    Project Details
                  </div>

                  <h3
                    id="project-modal-title"
                    className="pr-8 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl dark:text-white"
                  >
                    {selectedProject.title}
                  </h3>
                </div>

                {/* DESCRIPTION */}
                <div className="mb-7">
                  <h4 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    About This Project
                  </h4>

                  <p className="whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-400">
                    {selectedProject.description ||
                      "No description available."}
                  </p>
                </div>

                {/* TECH STACK */}
                <div className="mb-8">
                  <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Technologies Used
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skills?.map((skill, i) => (
                      <div
                        key={`${skill.name}-${i}`}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Image
                          src={skill.photo}
                          alt={skill.name}
                          width={18}
                          height={18}
                          className="object-contain"
                        />

                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PROJECT LINKS */}
                <div className="mt-auto border-t border-gray-200 pt-5 dark:border-gray-700">
                  <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Explore Project
                  </h4>

                  <div className="flex flex-wrap gap-3">
                    {selectedProject.link && (
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#2d4a2d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d613d] dark:bg-pastel-green dark:text-gray-900 dark:hover:bg-pastel-green/80"
                      >
                        <Globe size={17} />
                        Live Demo
                        <ExternalLink size={14} />
                      </a>
                    )}

                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <Github size={17} />
                        Source Code
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
