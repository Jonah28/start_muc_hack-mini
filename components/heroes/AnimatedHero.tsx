"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { HEY_TELO_PHONE_NUMBER } from "@/lib/config";
import type { SiteConfig } from "@/lib/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const AnimatedHero = ({ site }: { site: SiteConfig }) => {
  const image = site.profile.imageUrls[0] || "/hack-images/craftsman_greeting_smiling.png";
  const glassButtonClassName =
    "px-6 py-3 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors cursor-pointer";

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black font-sans">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-start justify-center text-left px-6 md:px-12 max-w-4xl w-full text-white"
      >
        <motion.p variants={itemVariants} className="text-xl text-cyan-400 font-bold tracking-widest mb-4 uppercase">
          {site.profile.trade} · {site.profile.serviceArea}
        </motion.p>
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {site.profile.name}
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-2xl text-lg leading-8 text-white/80"
        >
          {site.profile.description}
        </motion.p>
        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center gap-4">
          <a href={`tel:${HEY_TELO_PHONE_NUMBER}`} className={glassButtonClassName} style={{ background: "var(--site-accent)", borderColor: "var(--site-accent)" }}>
            ☎ {HEY_TELO_PHONE_NUMBER}
          </a>
          <a href="#kontakt" className={glassButtonClassName}>
            Anfrage senden
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};
