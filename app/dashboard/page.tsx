"use client";

import { useEffect, useRef } from "react";

export default function DashboardHome() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Efek gradient yang bergerak
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    let time = 0;
    let animationFrame: number;

    function animate() {
      // Pastikan ctx dan canvas masih ada
      if (!ctx || !canvas) return;

      time += 0.002;

      // Create gradient that moves
      const gradient = ctx.createLinearGradient(
        Math.sin(time) * 100 + canvas.width / 2,
        Math.cos(time) * 100 + canvas.height / 2,
        Math.sin(time + 2) * 100 + canvas.width / 2,
        Math.cos(time + 2) * 100 + canvas.height / 2,
      );

      gradient.addColorStop(0, "#ecfdf5"); // emerald-50
      gradient.addColorStop(0.5, "#d1fae5"); // emerald-100
      gradient.addColorStop(1, "#a7f3d0"); // emerald-200

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some noise/particles
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.sin(time + i) * 50 + canvas.width * (i / 20),
          Math.cos(time + i) * 50 + canvas.height * (0.3 + i / 40),
          2,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#10b981";
        ctx.globalAlpha = 0.1;
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-emerald-50">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Decorative Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-2xl">
          {/* Profile Section */}
          <div className="relative group">
            {/* Animated rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-2 border-emerald-200 animate-ping opacity-20"></div>
              <div className="absolute w-56 h-56 rounded-full border-2 border-emerald-300 animate-pulse opacity-30"></div>
              <div className="absolute w-64 h-64 rounded-full border border-emerald-400/20 animate-spin-slow"></div>
            </div>

            {/* Profile Image */}
            <div className="relative w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                {/* Ganti dengan foto lo nanti */}
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <span className="text-5xl text-white font-light">I</span>
                </div>
              </div>
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-2">
            <p className="text-xl text-emerald-600 font-light tracking-wide">
              Portfolio
            </p>
            <h1 className="text-5xl font-bold text-gray-800">
              Muhamad Irvan Sandy
            </h1>
          </div>

          {/* Animated Divider */}
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="w-12 h-px bg-emerald-200"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="w-12 h-px bg-emerald-200"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
