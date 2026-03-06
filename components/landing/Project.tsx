"use client";

import { motion } from "framer-motion";
import { Folder, Globe, Code2, Github, ExternalLink } from "lucide-react";
import Image from "next/image";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      id="projects"
      className="relative bg-gradient-to-b from-pastel-light to-white dark:from-dark-light dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background decoration untuk dark mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-pastel-green/10 dark:bg-dark-green/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-pastel-soft/10 dark:bg-dark-soft/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center p-3 bg-pastel-green dark:bg-dark-soft rounded-full mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Code2 size={28} className="text-[#2d4a2d] dark:text-white" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-light text-gray-800 dark:text-gray-200 mb-4">
            Featured{" "}
            <span className="text-[#2d4a2d] dark:text-pastel-soft font-medium">
              Projects
            </span>
          </h2>

          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of projects I've built.
          </p>

          <div className="w-24 h-1 bg-pastel-soft dark:bg-dark-soft mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Empty state */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
              <Folder size={40} className="text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No projects available
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Card glow effect untuk dark mode */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pastel-green to-pastel-soft dark:from-dark-green dark:to-dark-soft rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500"></div>

                {/* Main card */}
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-pastel-green dark:border-dark-soft overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={
                        project.projectImage ||
                        "https://placehold.co/600x400?text=Project"
                      }
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay gelap untuk dark mode */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description || "No description available."}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill, i) => (
                        <motion.span
                          key={i}
                          className="px-3 py-1 bg-pastel-green/20 dark:bg-dark-soft/30 text-xs text-[#2d4a2d] dark:text-pastel-soft rounded-full flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4">
                      {project.link && (
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-[#2d4a2d] dark:text-pastel-soft group/link"
                          whileHover={{ x: 5 }}
                        >
                          <Globe size={16} />
                          <span>Live Demo</span>
                          <motion.span
                            className="opacity-0 group-hover/link:opacity-100"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </motion.a>
                      )}
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-[#2d4a2d] dark:hover:text-pastel-soft"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Github size={16} />
                          Code
                        </motion.a>
                      )}
                    </div>

                    {/* Project number indicator */}
                    <div className="absolute top-3 right-3 text-4xl font-bold text-pastel-green/20 dark:text-dark-soft/20 select-none">
                      #{String(projects.indexOf(project) + 1).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
