"use client";

import { motion } from "framer-motion";
import { Heart, ArrowUp, Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      icon: <Github size={18} />,
      href: "https://github.com/",
      label: "GitHub",
    },
    {
      icon: <Linkedin size={18} />,
      href: "https://linkedin.com/",
      label: "LinkedIn",
    },
    {
      icon: <Twitter size={18} />,
      href: "https://twitter.com/",
      label: "Twitter",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-white to-pastel-light border-t border-pastel-green pt-12 pb-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-pastel-mint rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-pastel-soft rounded-full opacity-20 blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand section */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-light text-gray-800 mb-2">
              <span className="text-[#2d4a2d] font-medium">Irvan</span> Sandy
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto md:mx-0">
              Building digital experiences with passion and purpose.
            </p>
          </div>

          {/* Quick links */}
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["About", "Skills", "Projects", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm text-gray-500 hover:text-[#2d4a2d] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div className="text-center md:text-right">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Connect With Me
            </h4>
            <div className="flex justify-center md:justify-end space-x-3">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-pastel-green/50 rounded-lg text-[#2d4a2d] hover:bg-[#2d4a2d] hover:text-white transition-all duration-300"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-pastel-green to-transparent my-6"></div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            © {new Date().getFullYear()} Made with
            <Heart
              size={14}
              className="text-pink-400 fill-pink-400 animate-pulse"
            />
            by Irvan Sandy
          </p>

          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-400">v1.0.0</p>

            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              className="p-2 bg-pastel-green/50 rounded-full text-[#2d4a2d] hover:bg-[#2d4a2d] hover:text-white transition-all duration-300 group"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Back to top"
            >
              <ArrowUp size={16} className="group-hover:animate-bounce" />
            </motion.button>
          </div>
        </div>

        {/* Additional note */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Designed and built with 🍃 for a clean, modern look
        </p>
      </div>
    </footer>
  );
}
