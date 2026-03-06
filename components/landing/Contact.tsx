"use client";

import { motion, useInView } from "framer-motion";
import {
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  Send,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useState, useRef } from "react";

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  photo: string;
}

export default function Contact({ data = [] }: { data: SocialMedia[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 8000);
  };

  // Contact info items
  const contactInfo = [
    {
      icon: <Mail size={20} />,
      label: "Email",
      value: "irvan@example.com",
      link: "mailto:irvan@example.com",
    },
    {
      icon: <Phone size={20} />,
      label: "Phone",
      value: "+62 123 4567 890",
      link: "tel:+621234567890",
    },
    {
      icon: <MapPin size={20} />,
      label: "Location",
      value: "Indonesia",
      link: "#",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-gradient-to-b from-white to-pastel-light dark:from-gray-900 dark:to-dark-light py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-pastel-mint dark:bg-dark-mint/30 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-72 h-72 bg-pastel-soft dark:bg-dark-soft/30 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center p-3 bg-pastel-green dark:bg-dark-soft rounded-full mb-4 relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Mail size={28} className="text-[#2d4a2d] dark:text-white" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-light text-gray-800 dark:text-gray-200 mb-4">
            Get In{" "}
            <span className="text-[#2d4a2d] dark:text-pastel-soft font-medium">
              Touch
            </span>
          </h2>

          <motion.p
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Have a question or want to work together? Feel free to reach out!
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact info cards */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-pastel-green dark:border-dark-soft shadow-lg">
              <h3 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-6">
                Let's
                <span className="text-[#2d4a2d] dark:text-pastel-soft font-medium">
                  {" "}
                  Connect
                </span>
              </h3>

              <div className="space-y-4">
                {contactInfo.map((info, idx) => (
                  <motion.a
                    key={idx}
                    href={info.link}
                    className="flex items-center gap-4 p-4 bg-pastel-green/20 dark:bg-dark-soft/20 rounded-xl hover:bg-pastel-green/40 dark:hover:bg-dark-soft/40 transition-all duration-300 group relative overflow-hidden"
                    whileHover={{ x: 10 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                  >
                    <div className="p-3 bg-pastel-green dark:bg-dark-soft rounded-full text-[#2d4a2d] dark:text-white group-hover:bg-[#2d4a2d] dark:group-hover:bg-dark-green group-hover:text-white transition-colors">
                      {info.icon}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {info.label}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Media */}
              <motion.div
                className="mt-8 pt-6 border-t border-pastel-green dark:border-dark-soft"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                  <Sparkles
                    size={14}
                    className="text-[#6da78d] dark:text-pastel-soft"
                  />
                  Connect with me
                </p>

                <div className="flex gap-4 flex-wrap items-center">
                  {data.length > 0 ? (
                    data.map((social, idx) => (
                      <motion.a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.9 + idx * 0.1 }}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pastel-green/20 dark:border-dark-soft/20 group-hover:border-pastel-green dark:group-hover:border-dark-soft transition-colors">
                          <img
                            src={social.photo}
                            alt={social.platform}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 dark:bg-gray-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {social.platform}
                        </span>
                      </motion.a>
                    ))
                  ) : (
                    <p className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                      No social media yet
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-pastel-green dark:border-dark-soft shadow-xl">
              <h3 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-6">
                Send a{" "}
                <span className="text-[#2d4a2d] dark:text-pastel-soft font-medium">
                  Message
                </span>
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-pastel-green dark:bg-dark-soft rounded-full mb-6">
                    <CheckCircle className="w-10 h-10 text-[#2d4a2d] dark:text-white" />
                  </div>

                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Message Sent! 🎉
                  </h4>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Thank you for reaching out. I'll get back to you soon.
                  </p>

                  <motion.button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-[#2d4a2d] dark:bg-dark-soft text-white rounded-full hover:bg-[#1e331e] dark:hover:bg-dark-green transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-5"
                >
                  {/* Input Nama */}
                  <div className="relative">
                    <User
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                        focusedField === "name"
                          ? "text-[#2d4a2d] dark:text-pastel-soft"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your Name"
                      className="w-full pl-12 pr-4 py-3 bg-pastel-light/50 dark:bg-gray-700/50 border border-pastel-green dark:border-dark-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d4a2d]/30 dark:focus:ring-pastel-soft/30 focus:border-[#2d4a2d] dark:focus:border-pastel-soft transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                      required
                    />
                  </div>

                  {/* Input Email */}
                  <div className="relative">
                    <Mail
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                        focusedField === "email"
                          ? "text-[#2d4a2d] dark:text-pastel-soft"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your Email"
                      className="w-full pl-12 pr-4 py-3 bg-pastel-light/50 dark:bg-gray-700/50 border border-pastel-green dark:border-dark-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d4a2d]/30 dark:focus:ring-pastel-soft/30 focus:border-[#2d4a2d] dark:focus:border-pastel-soft transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                      required
                    />
                  </div>

                  {/* Input Pesan */}
                  <div className="relative">
                    <MessageSquare
                      className={`absolute left-4 top-4 transition-colors ${
                        focusedField === "message"
                          ? "text-[#2d4a2d] dark:text-pastel-soft"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      size={18}
                    />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your Message"
                      rows={5}
                      className="w-full pl-12 pr-4 py-3 bg-pastel-light/50 dark:bg-gray-700/50 border border-pastel-green dark:border-dark-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d4a2d]/30 dark:focus:ring-pastel-soft/30 focus:border-[#2d4a2d] dark:focus:border-pastel-soft transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                      required
                    />
                  </div>

                  {/* Tombol Kirim */}
                  <motion.button
                    type="submit"
                    className="group relative flex items-center justify-center gap-2 bg-[#2d4a2d] dark:bg-dark-soft text-white font-medium px-6 py-3 rounded-xl hover:bg-[#1e331e] dark:hover:bg-dark-green transition-all shadow-lg overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
