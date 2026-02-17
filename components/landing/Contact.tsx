"use client";

import { motion } from "framer-motion";
import {
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  Send,
  Phone,
  MapPin,
} from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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
    // Simulasi pengiriman
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
      id="contact"
      className="relative bg-gradient-to-b from-white to-pastel-light py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pastel-mint rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-pastel-soft rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-pastel-green rounded-full mb-4">
            <Mail size={28} className="text-[#2d4a2d]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            Get In <span className="text-[#2d4a2d] font-medium">Touch</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out!
          </p>
          <div className="w-24 h-1 bg-pastel-soft mx-auto rounded-full mt-6"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact info cards */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-pastel-green shadow-lg">
              <h3 className="text-2xl font-light text-gray-800 mb-6">
                Let's{" "}
                <span className="text-[#2d4a2d] font-medium">Connect</span>
              </h3>

              <div className="space-y-4">
                {contactInfo.map((info, idx) => (
                  <motion.a
                    key={idx}
                    href={info.link}
                    className="flex items-center gap-4 p-4 bg-pastel-green/20 rounded-xl hover:bg-pastel-green/40 transition-all duration-300 group"
                    whileHover={{ x: 10 }}
                  >
                    <div className="p-3 bg-pastel-green rounded-full text-[#2d4a2d] group-hover:bg-[#2d4a2d] group-hover:text-white transition-colors">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{info.label}</p>
                      <p className="text-gray-800 font-medium">{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social media quick links */}
              <div className="mt-8 pt-6 border-t border-pastel-green">
                <p className="text-sm text-gray-500 mb-4">Follow me on:</p>
                <div className="flex gap-3">
                  {["Github", "LinkedIn", "Twitter"].map((social, idx) => (
                    <motion.a
                      key={idx}
                      href="#"
                      className="px-4 py-2 bg-pastel-green/20 rounded-lg text-sm text-[#2d4a2d] hover:bg-[#2d4a2d] hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick response note */}
            <div className="bg-[#2d4a2d]/5 rounded-xl p-4 border border-pastel-green">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#2d4a2d]">
                  ⚡ Quick response:
                </span>{" "}
                I typically reply within 24 hours.
              </p>
            </div>
          </motion.div>

          {/* Right column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-pastel-green shadow-xl">
              <h3 className="text-2xl font-light text-gray-800 mb-6">
                Send a{" "}
                <span className="text-[#2d4a2d] font-medium">Message</span>
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-pastel-green rounded-full mb-6">
                    <CheckCircle className="w-10 h-10 text-[#2d4a2d]" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                  <motion.button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-[#2d4a2d] text-white rounded-full hover:bg-[#1e331e] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Input Nama */}
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full pl-12 pr-4 py-3 bg-pastel-light/50 border border-pastel-green rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d4a2d]/30 focus:border-[#2d4a2d] transition-all text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  {/* Input Email */}
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      className="w-full pl-12 pr-4 py-3 bg-pastel-light/50 border border-pastel-green rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d4a2d]/30 focus:border-[#2d4a2d] transition-all text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>

                  {/* Input Pesan */}
                  <div className="relative">
                    <MessageSquare
                      className="absolute left-4 top-4 text-gray-400"
                      size={18}
                    />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      rows={5}
                      className="w-full pl-12 pr-4 py-3 bg-pastel-light/50 border border-pastel-green rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d4a2d]/30 focus:border-[#2d4a2d] transition-all text-gray-800 placeholder-gray-400 resize-none"
                      required
                    ></textarea>
                  </div>

                  {/* Tombol Kirim */}
                  <motion.button
                    type="submit"
                    className="group relative flex items-center justify-center gap-2 bg-[#2d4a2d] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#1e331e] transition-all shadow-lg overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <Send className="w-5 h-5" />
                    Send Message
                  </motion.button>

                  <p className="text-xs text-gray-400 text-center">
                    I'll get back to you within 24 hours
                  </p>
                </motion.form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
