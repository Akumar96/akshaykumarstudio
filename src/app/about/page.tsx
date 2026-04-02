"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

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

export default function About() {
  return (
    <div>
      {/* Hero Spread Section — Full Bleed */}
      <section className="px-8 max-w-[1920px] mx-auto mb-32 pt-4">
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-0 items-end">
          <div className="md:col-span-8 overflow-hidden aspect-[16/9] relative">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
              alt="Nova Scotia coastline"
              fill
              className="object-cover brightness-90 transition-transform duration-1000 hover:scale-105"
              sizes="66vw"
            />
          </div>
          <div className="md:col-span-4 bg-surface-container-lowest p-12 md:-ml-24 relative z-10">
            <span className="font-label tracking-[0.2em] uppercase text-[10px] text-secondary mb-4 block">Established 2014</span>
            <h1 className="font-headline text-5xl md:text-7xl leading-[1.1] mb-6">Preserving the <span className="italic">Atmosphere</span> of the Atlantic.</h1>
            <p className="font-body text-on-surface-variant leading-relaxed mb-8">A multi-disciplinary film and photography studio dedicated to capturing the raw, enduring spirit of Halifax and the maritime coast.</p>
          </div>
        </div>
      </section>

      {/* The Story (Asymmetric Layout) */}
      <section className="px-8 max-w-7xl mx-auto mb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          <AnimatedSection>
            <h2 className="font-headline text-4xl mb-8">Our Story</h2>
            <div className="space-y-6 text-on-surface-variant leading-loose font-body text-lg">
              <p>Akshay Kumar Studios began as a personal journal of the changing tides in Halifax Harbor. What started with a single Leica and a roll of Tri-X film has evolved into a premier studio known for its architectural precision and emotional depth.</p>
              <p>We don&apos;t just document events; we archive legacies. Our work is deeply rooted in the local community, from the industrial docks to the quiet Victorian streets of the South End. We believe that professional excellence is found in the intersection of technical mastery and genuine human connection.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay="stagger-1">
            <div className="relative pt-20">
              <div className="aspect-[4/5] overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80"
                  alt="Studio interior"
                  fill
                  className="object-cover"
                  sizes="40vw"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-primary-container text-surface p-8 max-w-xs">
                <p className="font-headline italic text-xl">&quot;To see the coast is to understand the soul of this place.&quot;</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Vision Statement (Full Width Tonal Shift) */}
      <section className="bg-surface-container-low py-40 mb-40 px-8">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-secondary mx-auto mb-6"><path d="M12 3l1.5 4.5h4.5l-3.5 3 1.5 4.5-4-3-4 3 1.5-4.5-3.5-3h4.5z" /></svg>
            <h2 className="font-headline text-4xl md:text-5xl mb-10 leading-tight">We strive to create images that feel like <span className="italic underline decoration-outline-variant underline-offset-8">memories</span> before they are even developed.</h2>
            <div className="h-px w-24 bg-outline-variant mx-auto mb-10"></div>
            <p className="font-body text-xl text-on-secondary-container max-w-2xl mx-auto leading-relaxed">Our vision is a timeless archive of the Maritimes—a visual heritage that prioritizes substance over trend, and silence over noise.</p>
          </div>
        </AnimatedSection>
      </section>

      {/* Team Section — Full Color, Clean Grid */}
      <section className="px-8 max-w-7xl mx-auto mb-40">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <AnimatedSection>
            <span className="font-label tracking-[0.2em] uppercase text-[10px] text-secondary mb-4 block">The Hands Behind the Lens</span>
            <h2 className="font-headline text-4xl">The Collective</h2>
          </AnimatedSection>
          <AnimatedSection delay="stagger-1">
            <p className="font-body text-on-surface-variant max-w-xs text-sm leading-relaxed">A specialized team of photographers, cinematographers, and editors bound by a shared aesthetic language.</p>
          </AnimatedSection>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <AnimatedSection>
            <div className="group">
              <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                  alt="Julian Thorne"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="33vw"
                />
              </div>
              <h3 className="font-headline text-2xl mb-1">Julian Thorne</h3>
              <p className="font-label tracking-widest uppercase text-[10px] text-secondary">Creative Director & Lead Film</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay="stagger-1">
            <div className="group md:mt-12">
              <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80"
                  alt="Elena Vance"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="33vw"
                />
              </div>
              <h3 className="font-headline text-2xl mb-1">Elena Vance</h3>
              <p className="font-label tracking-widest uppercase text-[10px] text-secondary">Cinematography Specialist</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay="stagger-2">
            <div className="group">
              <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"
                  alt="Marcus Reed"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="33vw"
                />
              </div>
              <h3 className="font-headline text-2xl mb-1">Marcus Reed</h3>
              <p className="font-label tracking-widest uppercase text-[10px] text-secondary">Master Editor & Colorist</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values / Community Connection */}
      <section className="px-8 max-w-7xl mx-auto mb-40">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-20">
            <div className="md:col-span-4">
              <h2 className="font-headline text-3xl">Community & Excellence</h2>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="font-bold text-[11px] tracking-widest uppercase mb-4">Halifax Editorial Services</h4>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed">We provide subsidized archival services for local heritage sites and non-profits, ensuring the visual history of Halifax remains accessible to all.</p>
              </div>
              <div>
                <h4 className="font-bold text-[11px] tracking-widest uppercase mb-4">Technical Purity</h4>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed">Our laboratory processes film in-house using traditional methods paired with state-of-the-art digital scanning for the highest fidelity.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Page-Specific Footer for About */}
      <footer className="bg-surface-container w-full py-20 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div>
            <div className="font-serif text-lg tracking-widest uppercase text-primary mb-6">
              Akshay Kumar Studios
            </div>
            <p className="font-body text-[13px] text-secondary max-w-xs leading-relaxed">
              Halifax Fine Art Photography. <br />
              Preserving moments through the lens of timelessness.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-label tracking-widest uppercase text-[10px] font-bold text-primary mb-2">Explore</span>
              <Link href="/topics" className="text-[13px] text-secondary hover:text-primary transition-all">Journal</Link>
              <Link href="/portfolio" className="text-[13px] text-secondary hover:text-primary transition-all">Portfolio</Link>
              <Link href="/booking" className="text-[13px] text-secondary hover:text-primary transition-all">Booking</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-label tracking-widest uppercase text-[10px] font-bold text-primary mb-2">Connect</span>
              <a href="#" className="text-[13px] text-secondary hover:text-primary transition-all">Instagram</a>
              <Link href="/booking" className="text-[13px] text-secondary hover:text-primary transition-all">Contact</Link>
              <a href="#" className="text-[13px] text-secondary hover:text-primary transition-all">Halifax Editorial</a>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start md:items-end h-full">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Link href="/booking" className="font-label tracking-widest uppercase text-[11px] text-primary">Inquire</Link>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-sm transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </div>
            <div className="mt-12 md:mt-0 font-body text-[11px] text-secondary md:text-right">
              © 2024 Akshay Kumar Studios. <br />
              Halifax Fine Art Photography. <br />
              <a href="#" className="hover:text-primary transition-colors underline decoration-1 underline-offset-4">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
