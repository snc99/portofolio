"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Folder, Github, Globe, Code2 } from "lucide-react";
import Image from "next/image";

interface ProjectData {
  id: string;
  title: string;
  description?: string;
  link?: string;
  github?: string; // Optional: link ke GitHub
  projectImage?: string;
  techStack: { skill: { photo: string; name: string } }[];
  category?: string; // Optional: kategori project
}

export default function Project() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Extract unique categories
  const categories = [
    "all",
    ...new Set(projects.map((p) => p.category || "other")),
  ];

  // Filter projects
  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => (p.category || "other") === filter);

  // Animasi variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
      className="relative bg-gradient-to-b from-pastel-light to-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-72 h-72 bg-pastel-mint rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-pastel-soft rounded-full opacity-20 blur-3xl"></div>
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
          <div className="inline-flex items-center justify-center p-3 bg-pastel-green rounded-full mb-4">
            <Code2 size={28} className="text-[#2d4a2d]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            Featured{" "}
            <span className="text-[#2d4a2d] font-medium">Projects</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A collection of projects I've built, each with its own story and
            purpose
          </p>
          <div className="w-24 h-1 bg-pastel-soft mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Category Filter */}
        {!loading && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                  filter === category
                    ? "bg-[#2d4a2d] text-white shadow-md"
                    : "bg-white/80 text-gray-600 hover:bg-pastel-green border border-pastel-soft"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white/60 rounded-2xl border border-pastel-green p-4"
              >
                <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <Folder className="text-red-500 w-10 h-10" />
            </div>
            <p className="text-red-500 text-lg">{error}</p>
          </motion.div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-pastel-green rounded-full mb-6">
              <Folder size={40} className="text-[#2d4a2d]" />
            </div>
            <p className="text-gray-600 text-xl mb-2">No projects found</p>
            <p className="text-gray-400">Check back later for updates</p>
          </motion.div>
        ) : (
          // Projects Grid
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-pastel-green overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Project Image */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={
                      project.projectImage ||
                      "https://placehold.co/600x400/pastel-green/white?text=Project"
                    }
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay with tech stack */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {project.techStack.map((tech, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg"
                          title={tech.skill.name}
                        >
                          <Image
                            src={
                              tech.skill.photo || "https://placehold.co/32x32"
                            }
                            alt={tech.skill.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#2d4a2d] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description || "No description available."}
                  </p>

                  {/* Tech stack badges (mobile) */}
                  <div className="flex flex-wrap gap-2 mb-4 md:hidden">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-pastel-green text-xs text-[#2d4a2d] rounded-full"
                      >
                        {tech.skill.name}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3">
                    {project.link && (
                      <motion.a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-[#2d4a2d] hover:text-[#1e331e] transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Globe size={16} />
                        <span>Live Demo</span>
                      </motion.a>
                    )}

                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#2d4a2d] transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Github size={16} />
                        <span>Code</span>
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Category badge */}
                {project.category && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs text-[#2d4a2d] rounded-full shadow-sm border border-pastel-green">
                    {project.category}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Project stats */}
        {!loading && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-500">
              <span className="text-[#2d4a2d] font-semibold text-lg">
                {projects.length}
              </span>{" "}
              projects and counting
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
