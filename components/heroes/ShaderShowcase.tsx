"use client";

import { useEffect, useRef, useState } from "react";
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react";
import { motion } from "framer-motion";
import { HEY_TELO_PHONE_NUMBER } from "@/lib/config";
import type { SiteConfig } from "@/lib/types";

export const ShaderShowcase = ({ site }: { site: SiteConfig }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="min-h-[800px] bg-black relative overflow-hidden font-sans">
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02  0 1 0 0 0.02  0 0 1 0 0.05  0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#06b6d4" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#195f92", "#0891b2", "#164e63", "#3b82f6"]}
        speed={0.3}
        backgroundColor="#000000"
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#000000", "#ffffff", "#195f92", "#3b82f6"]}
        speed={0.2}
        wireframe="true"
        backgroundColor="transparent"
      />
      <main className="absolute bottom-16 left-8 md:left-16 z-20 max-w-3xl">
        <div className="text-left">
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-6 relative border border-white/10"
            style={{ filter: "url(#glass-effect)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent rounded-full" />
            <span className="text-white/90 text-sm font-medium relative z-10 tracking-wide">
              {site.profile.trade} · {site.profile.serviceArea}
            </span>
          </motion.div>
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              className="block font-light text-white/90 text-4xl md:text-5xl lg:text-6xl mb-2 tracking-wider"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #195f92 30%, #3b82f6 70%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "url(#text-glow)",
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              Exzellenter
            </motion.span>
            <span className="block font-black text-white drop-shadow-2xl">{site.profile.name}</span>
          </motion.h1>
          <motion.p
            className="text-lg font-light text-white/70 mb-8 leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {site.profile.description}
          </motion.p>
          <motion.div
            className="flex items-center gap-6 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.a
              href={`tel:${HEY_TELO_PHONE_NUMBER}`}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg transition-all duration-300 hover:from-blue-400 hover:to-cyan-400 cursor-pointer shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ☎ {HEY_TELO_PHONE_NUMBER}
            </motion.a>
            <motion.a
              href="#kontakt"
              className="px-10 py-4 rounded-full bg-transparent border-2 border-white/30 text-white font-medium text-lg transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-100 cursor-pointer backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Anfrage senden
            </motion.a>
          </motion.div>
        </div>
      </main>
      <div className="absolute top-16 right-16 z-30 hidden md:block">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <PulsingBorder
            colors={["#195f92", "#0891b2", "#3b82f6", "#ffffff"]}
            colorBack="#00000000"
            speed={1.5}
            roundness={1}
            thickness={0.1}
            softness={0.2}
            intensity={5}
            spotsPerColor={3}
            spotSize={0.1}
            pulse={0.1}
            smoke={0.5}
            smokeSize={4}
            scale={0.65}
            rotation={0}
            frame={9161408}
            style={{ width: "120px", height: "120px", borderRadius: "50%" }}
          />
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ transform: "scale(1.6)" }}
          >
            <defs>
              <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text className="text-sm fill-white/80 font-medium">
              <textPath href="#circle" startOffset="0%">
                Handwerk mit Leidenschaft • Meisterbetrieb • Zuverlässig •
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>
    </div>
  );
};
