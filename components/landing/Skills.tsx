
"use client";

import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import {
  Code2,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  photo: string;
  level: "JUNIOR" | "INTERMEDIATE" | "SENIOR" | "EXPERT";
}

export default function Skills({ data }: { data: Skill[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: data.length > 1,
    mode: "free-snap",
    slides: {
      perView: 4,
      spacing: 20,
      origin: "center",
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 6,
          spacing: 20,
          origin: "center",
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 8,
          spacing: 24,
          origin: "center",
        },
      },
    },
  });

  // Autoplay
  useEffect(() => {
    if (
      !isPlaying ||
      isHovered ||
      isExpanded ||
      data.length < 2
    ) {
      return;
    }

    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 2500);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, isExpanded, instanceRef, data.length]);

  // Update slider when returning to rail mode
  useEffect(() => {
    if (!isExpanded) {
      const frame = requestAnimationFrame(() => {
        instanceRef.current?.update();
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [isExpanded, instanceRef]);

  const levelLabel: Record<Skill["level"], string> = {
    JUNIOR: "Junior",
    INTERMEDIATE: "Intermediate",
    SENIOR: "Senior",
    EXPERT: "Expert",
  };

  if (!data.length) {
    return (
      <section className="py-16 px-4 text-center">
        <Code2 className="mx-auto mb-3" size={28} />
        <p className="text-gray-500 dark:text-gray-400">
          No skills available
        </p>
      </section>
    );
  }

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <Code2
            className="mx-auto mb-3 text-[#2d4a2d] dark:text-pastel-soft"
            size={24}
          />

          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200">
            Technical Skills
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto">
            Technologies and tools I use to build, test,
            and deliver reliable digital experiences.
          </p>
        </div>

        {/* Toolbar */}
<div className="flex items-center justify-end mb-6 sm:mb-8">
  <div className="flex items-center gap-2 sm:gap-5">

    {/* Expand / Collapse */}
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="flex items-center gap-1.5 text-xs sm:text-sm font-medium
        text-gray-700 dark:text-gray-300
        hover:text-emerald-600 dark:hover:text-emerald-400
        transition-colors"
      aria-expanded={isExpanded}
    >
      {isExpanded
        ? "SHOW RAIL"
        : `VIEW ALL (${data.length})`}

      {isExpanded ? (
        <Minus size={16} />
      ) : (
        <Plus size={16} />
      )}
    </button>

    {/* Rail Controls */}
    {!isExpanded && (
      <div className="flex items-center gap-1 sm:gap-3">

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full
            text-gray-500 dark:text-gray-400
            hover:bg-pastel-green/40 dark:hover:bg-gray-700
            hover:text-emerald-600 dark:hover:text-emerald-400
            transition-colors"
          aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
        >
          {isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} />
          )}
        </button>

        <button
          onClick={() => instanceRef.current?.prev()}
          className="p-2 rounded-full
            text-gray-500 dark:text-gray-400
            hover:bg-pastel-green/40 dark:hover:bg-gray-700
            hover:text-emerald-600 dark:hover:text-emerald-400
            transition-colors"
          aria-label="Previous skills"
        >
          <ChevronLeft size={19} />
        </button>

        <button
          onClick={() => instanceRef.current?.next()}
          className="p-2 rounded-full
            text-gray-500 dark:text-gray-400
            hover:bg-pastel-green/40 dark:hover:bg-gray-700
            hover:text-emerald-600 dark:hover:text-emerald-400
            transition-colors"
          aria-label="Next skills"
        >
          <ChevronRight size={19} />
        </button>

      </div>
    )}
  </div>
</div>

        {/* Rail Mode */}
        <div
          className={isExpanded ? "hidden" : "block"}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={sliderRef}
            className="keen-slider py-8"
          >
            {data.map((skill) => (
              <div
                key={skill.id}
                className="keen-slider__slide"
              >
                <SkillItem
                  skill={skill}
                  levelLabel={levelLabel[skill.level]}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Expanded Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10 py-6 ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          {data.map((skill) => (
            <div key={skill.id}>
              <SkillItem
                skill={skill}
                levelLabel={levelLabel[skill.level]}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// Reusable Skill Item
function SkillItem({
  skill,
  levelLabel,
}: {
  skill: Skill;
  levelLabel: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-3 group">

      <div className="relative w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110">
        <Image
          src={skill.photo}
          alt={skill.name}
          fill
          sizes="56px"
          className="object-contain"
        />
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
          {skill.name}
        </p>

        <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
          {levelLabel}
        </p>
      </div>

    </div>
  );
}
