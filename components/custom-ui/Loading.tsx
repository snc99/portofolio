"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [dots, setDots] = useState("");

  // Efek dots berkedip
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
      <div className="relative">
        {/* Garis-garis minimalis */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 relative">
            {/* Horizontal line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-emerald-200 -translate-y-1/2"></div>
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-emerald-200 -translate-x-1/2"></div>
          </div>
        </div>

        {/* Kotak yang bergerak */}
        <div className="relative w-40 h-40">
          {/* Moving box 1 */}
          <div className="absolute top-0 left-0 w-5 h-5 bg-emerald-500/20 rounded-sm animate-move-top-left"></div>
          {/* Moving box 2 */}
          <div className="absolute top-0 right-0 w-5 h-5 bg-emerald-500/40 rounded-sm animate-move-top-right"></div>
          {/* Moving box 3 */}
          <div className="absolute bottom-0 left-0 w-5 h-5 bg-emerald-500/40 rounded-sm animate-move-bottom-left"></div>
          {/* Moving box 4 */}
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500/20 rounded-sm animate-move-bottom-right"></div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Loading text dengan style beda */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-sm font-medium text-emerald-700 tracking-[0.3em]">
            LOADING{dots}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes moveTopLeft {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }
          25% {
            transform: translate(10px, 10px);
            opacity: 1;
          }
          50% {
            transform: translate(20px, 20px);
            opacity: 0.2;
          }
          75% {
            transform: translate(10px, 10px);
            opacity: 1;
          }
        }

        .animate-move-top-left {
          animation: moveTopLeft 3s ease-in-out infinite;
        }

        @keyframes moveTopRight {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }
          25% {
            transform: translate(-10px, 10px);
            opacity: 1;
          }
          50% {
            transform: translate(-20px, 20px);
            opacity: 0.2;
          }
          75% {
            transform: translate(-10px, 10px);
            opacity: 1;
          }
        }

        .animate-move-top-right {
          animation: moveTopRight 3s ease-in-out infinite;
        }

        @keyframes moveBottomLeft {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }
          25% {
            transform: translate(10px, -10px);
            opacity: 1;
          }
          50% {
            transform: translate(20px, -20px);
            opacity: 0.2;
          }
          75% {
            transform: translate(10px, -10px);
            opacity: 1;
          }
        }

        .animate-move-bottom-left {
          animation: moveBottomLeft 3s ease-in-out infinite;
        }

        @keyframes moveBottomRight {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }
          25% {
            transform: translate(-10px, -10px);
            opacity: 1;
          }
          50% {
            transform: translate(-20px, -20px);
            opacity: 0.2;
          }
          75% {
            transform: translate(-10px, -10px);
            opacity: 1;
          }
        }

        .animate-move-bottom-right {
          animation: moveBottomRight 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
