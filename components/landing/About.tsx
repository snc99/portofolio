
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { User, BriefcaseBusiness, ShieldCheck, Code2 } from "lucide-react";
import Image from "next/image";

interface AboutData {
  photo: string | null;
  description: string | null;
}

const highlights = [
  {
    icon: BriefcaseBusiness,
    title: "Professional Role",
    value: "Quality Assurance",
  },
  {
    icon: ShieldCheck,
    title: "Testing Focus",
    value: "Manual & API Testing",
  },
  {
    icon: Code2,
    title: "Currently Learning",
    value: "Playwright Automation",
  },
];

export default function About({ data }: { data: AboutData | null }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  });

  const description =
    data?.description || "Passionate quality assurance engineer.";

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-white to-pastel-light py-20 px-4 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-dark-light"
    >
      {/* Background Decoration */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-pastel-green/20 blur-3xl pointer-events-none dark:bg-dark-green/20" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-pastel-soft/20 blur-3xl pointer-events-none dark:bg-dark-soft/20" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-pastel-green p-3 dark:bg-dark-soft">
            <User
              size={23}
              className="text-[#2d4a2d] dark:text-pastel-soft"
            />
          </div>

          <h2 className="mb-4 text-4xl font-light text-gray-800 md:text-5xl dark:text-gray-200">
            About{" "}
            <span className="font-semibold text-[#2d4a2d] dark:text-pastel-soft">
              Me
            </span>
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Get to know more about my professional journey and passion.
          </p>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-pastel-soft dark:bg-dark-soft" />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Profile Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-3xl border-l-4 border-t-4 border-[#2d4a2d]/30 dark:border-pastel-soft/30" />

              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-br-3xl border-b-4 border-r-4 border-[#2d4a2d]/30 dark:border-pastel-soft/30" />

              <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-pastel-green/30 p-3 shadow-xl dark:border-gray-700 dark:bg-dark-soft/30">
                <div className="relative aspect-[4/4.5] overflow-hidden rounded-2xl">
                  <Image
                    src={data?.photo || "/picture2.png"}
                    alt="About Me"
                    fill
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              <div className="absolute -bottom-7 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl border border-pastel-green bg-white/95 p-4 text-center shadow-lg backdrop-blur-md dark:border-dark-soft dark:bg-gray-800/95">
                <p className="text-sm font-semibold text-[#2d4a2d] dark:text-pastel-soft">
                  Quality Assurance Engineer
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Passionate about software quality
                </p>
              </div>
            </div>
          </motion.div>

          {/* About Description */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-8 lg:pt-0"
          >
            <div className="rounded-3xl border border-pastel-green bg-white/80 p-7 shadow-lg backdrop-blur-sm sm:p-9 dark:border-dark-soft dark:bg-gray-800/80">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-[#2d4a2d] dark:bg-pastel-soft" />
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  My Story
                </h3>
              </div>

              <p className="whitespace-pre-line text-base leading-8 text-gray-600 dark:text-gray-400">
                {description}
              </p>

              <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#2d4a2d]/20 to-transparent dark:via-pastel-soft/20" />

              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#2d4a2d] dark:text-pastel-soft">
                What Defines My Work
              </p>

              <div className="grid gap-3">
                {highlights.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      variants={fadeUp}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      transition={{
                        duration: 0.5,
                        delay: 0.45 + index * 0.12,
                      }}
                      className="flex items-center gap-4 rounded-xl bg-pastel-green/30 p-3 transition-colors hover:bg-pastel-green/60 dark:bg-dark-soft/30 dark:hover:bg-dark-soft/60"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-700">
                        <Icon
                          size={20}
                          className="text-[#2d4a2d] dark:text-pastel-soft"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.title}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {item.value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
