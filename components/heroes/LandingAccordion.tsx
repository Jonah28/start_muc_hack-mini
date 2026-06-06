"use client";

import React, { useState } from 'react';
import { HEY_TELO_PHONE_NUMBER } from "@/lib/config";
import type { SiteConfig } from "@/lib/types";

const AccordionItem = ({ item, isActive, onMouseEnter }: { item: any, isActive: boolean, onMouseEnter: () => void }) => {
  return (
    <div
      className={`relative h-[450px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${isActive ? 'w-[400px]' : 'w-[60px]'}`}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-contain bg-slate-100"
        onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = 'https://placehold.co/400x450/2d3748/ffffff?text=Image+Error'; }}
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <span
        className={`absolute text-white text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out ${
          isActive
            ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0'
            : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90'
        }`}
      >
        {item.title}
      </span>
    </div>
  );
};

export const LandingAccordion = ({ site }: { site: SiteConfig }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const accordionItems = [
    { id: 1, title: site.profile.services[0] || 'Dienstleistung 1', imageUrl: site.profile.imageUrls[0] || '/hack-images/Badsanierung.png' },
    { id: 2, title: site.profile.services[1] || 'Dienstleistung 2', imageUrl: site.profile.imageUrls[1] || '/hack-images/Fliesenbearbeitung.png' },
    { id: 3, title: site.profile.services[2] || 'Dienstleistung 3', imageUrl: site.profile.imageUrls[2] || '/hack-images/Küchenmontage.png' },
    { id: 4, title: site.profile.services[3] || 'Dienstleistung 4', imageUrl: site.profile.imageUrls[3] || '/hack-images/Renovierung.png' },
  ];

  return (
    <div className="bg-[#fdfdfc] font-sans">
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-xl text-blue-600 font-bold tracking-widest mb-4 uppercase">
              {site.profile.trade}
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tighter mb-6" style={{ fontFamily: "var(--site-heading)" }}>
              {site.profile.name}
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-xl mx-auto md:mx-0 leading-relaxed font-light">
              {site.profile.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 items-center justify-center md:justify-start">
              <a href={`tel:${HEY_TELO_PHONE_NUMBER}`} className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300">
                ☎ {HEY_TELO_PHONE_NUMBER}
              </a>
              <a href="#kontakt" className="inline-block bg-white text-slate-800 border-2 border-slate-200 font-bold text-lg px-8 py-4 rounded-lg hover:bg-slate-50 transition-colors duration-300">
                Kontakt
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
