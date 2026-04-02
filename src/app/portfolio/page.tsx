"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

const portfolioItems = [
  {
    id: 1,
    title: "Elias & Catherine",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    id: 2,
    title: "The Nordic Studio",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
  },
  {
    id: 3,
    title: "A Study of Time",
    category: "Portraits",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  },
  {
    id: 4,
    title: "The Summer Estate",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
  },
  {
    id: 5,
    title: "Solitude in the Shore",
    category: "Portraits",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
  },
  {
    id: 6,
    title: "Ledge House Interiors",
    category: "Events",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    id: 7,
    title: "The Harbor Gala",
    category: "Events",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
  },
  {
    id: 8,
    title: "Winter Solstice Gathering",
    category: "Events",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
  },
];

function AnimatedSection({ children, className = "", delay = "" }: { children: React.ReactNode; className?: string; delay?: string }) {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`fade-up ${isInView ? "animate-in" : ""} ${delay} ${className}`}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<string>("All Works");

  const filteredItems = activeFilter === "All Works"
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeFilter);

  return (
    <div>
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 px-8 max-w-[1440px] mx-auto pt-4">
        <div className="lg:col-span-7">
          <span className="tracking-widest uppercase text-[11px] text-secondary mb-6 block">Halifax Photography Portfolio</span>
          <h1 className="text-5xl md:text-7xl lg:text-display-1 leading-tight mb-8">Capturing the quiet <span className="italic">permanence</span> of light.</h1>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 self-end">
          <p className="text-on-surface-variant leading-relaxed text-lg font-light italic border-l border-outline-variant/30 pl-8">
            Every frame treated as a physical artifact. Inspired by the misty Atlantic coastline.
          </p>
        </div>
      </header>

      <div className="flex flex-wrap gap-8 mb-20 items-baseline overflow-x-auto pb-4 px-8 max-w-[1440px] mx-auto">
        {["All Works", "Weddings", "Commercial", "Portraits", "Events"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`text-xs tracking-[0.3em] uppercase font-semibold whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-secondary hover:text-primary"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8 max-w-[1440px] mx-auto">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer relative overflow-hidden"
          >
            <div className="w-full aspect-[4/5] bg-surface-variant overflow-hidden relative">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-500 flex items-end">
                <div className="p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/80">{item.category}</span>
                  <h3 className="text-xl mt-1 text-white serif">{item.title}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-40 py-32 px-12 text-center">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl mb-8 font-light italic">Let&apos;s curate your story.</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto mb-12 font-light">Available for editorial commissions and select private events throughout the Atlantic provinces and beyond.</p>
          <Link href="/booking" className="inline-flex items-center gap-4 group">
            <span className="tracking-widest uppercase text-[11px] font-bold border-b border-primary pb-1 group-hover:opacity-60 transition-opacity">Start a Conversation</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-2 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
