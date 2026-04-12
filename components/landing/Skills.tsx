"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { Code2, Sparkles } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  photo: string;
  level: "JUNIOR" | "INTERMEDIATE" | "SENIOR" | "EXPERT";
}

export default function Skills({ data }: { data: Skill[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔥 Autoplay
  const autoplay = (slider: any) => {
    let timeout: any;
    let mouseOver = false;

    const clear = () => clearTimeout(timeout);

    const next = () => {
      clear();
      if (mouseOver) return;
      timeout = setTimeout(() => slider.next(), 2500);
    };

    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clear();
      });

      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        next();
      });

      next();
    });

    slider.on("dragStarted", clear);
    slider.on("animationEnded", next);
    slider.on("updated", next);
  };

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "free-snap",
      slides: {
        perView: 4,
        spacing: 20,
        origin: "center",
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 8, spacing: 15, origin: "center" },
        },
        "(min-width: 1024px)": {
          slides: { perView: 10, spacing: 18, origin: "center" },
        },
      },
      slideChanged(slider) {
        const center = Math.round(slider.track.details.rel);
        setCurrentSlide(center);
      },
    },
    [autoplay],
  );

  const levelLabel: Record<string, string> = {
    JUNIOR: "Junior",
    INTERMEDIATE: "Intermediate",
    SENIOR: "Senior",
    EXPERT: "Expert",
  };

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Code2 className="mx-auto mb-2" size={20} />

          <h2 className="text-2xl font-semibold">Skills</h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
            A collection of technologies I enjoy working with to build impactful
            digital experiences.
          </p>
        </div>

        {/* Slider */}
        <div ref={sliderRef} className="keen-slider">
          {data.map((skill, idx) => {
            const isActive = currentSlide === idx;

            return (
              <div key={skill.id} className="keen-slider__slide">
                <div
                  className={`transition-all duration-300 ease-out ${
                    isActive ? "scale-110 opacity-100" : "scale-90 opacity-50"
                  }`}
                >
                  <div
                    className="relative h-[100px] sm:h-[110px] md:h-[120px] cursor-pointer"
                    style={{ perspective: "1000px" }}
                  >
                    {/* FRONT */}
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 relative mb-2 transition-transform duration-300 hover:scale-110">
                        <Image
                          src={skill.photo}
                          alt={skill.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <p className="text-[11px] sm:text-xs font-medium text-center">
                        {skill.name}
                      </p>

                      <p className="text-[10px] text-gray-400">
                        {levelLabel[skill.level]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
