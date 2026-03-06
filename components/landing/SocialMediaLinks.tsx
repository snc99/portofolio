"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  photo: string;
}

export default function SocialMediaLinks({ data }: { data: SocialMedia[] }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center">
        Social media tidak tersedia
      </p>
    );
  }

  return (
    <motion.div
      className="flex space-x-4 justify-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      {data.map((social, index) => (
        <motion.a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full overflow-hidden border border-blue-700 shadow-lg hover:scale-110 transition-transform"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Image
            src={social.photo}
            alt={social.platform}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </motion.a>
      ))}
    </motion.div>
  );
}
