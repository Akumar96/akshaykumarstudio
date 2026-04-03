"use client";

import Link from "next/link";
import Image from "next/image";
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

export default function Home() {
  return (
    <div>
      {/* Hero Section — Full Bleed */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-24">
        <div className="absolute inset-0">
          <Image
            src="/photos/nature/DSC01069.jpg"
            alt="Dramatic coastline landscape"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={95}
          />
          <div className="absolute inset-0 bg-surface/60" />
        </div>
        <div className="relative z-10 container mx-auto px-8 pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-4 text-secondary mb-8">
              <span className="h-[1px] w-12 bg-secondary/30"></span>
              <span className="tracking-widest uppercase text-[11px] font-medium">Fine Art Photography & Film</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-primary">
              Your story <br /> <span className="italic font-normal">deserves</span> to be <br /> told right.
            </h1>
            <p className="text-on-surface-variant max-w-lg text-lg font-light leading-relaxed mt-8 mb-10">
              We don't do posed, stiff, or fake. We show up, blend in, and photograph the moments you'll actually cry looking at — the ones you didn't even know happened.
            </p>
            <Link href="/portfolio" className="inline-flex items-center gap-4 group">
              <span className="tracking-widest uppercase text-[11px] font-semibold border-b border-primary pb-1 group-hover:opacity-60 transition-opacity">See Our Work</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-2 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Story 1 — Full Width */}
      <section className="bg-surface-container-low">
        <AnimatedSection>
          <div className="relative w-full aspect-[21/9] overflow-hidden">
            <Image
              src="/photos/nature/DSC01165-2.jpg"
              alt="Editorial shoot"
              fill
              className="object-cover"
              sizes="100vw"
              quality={95}
            />
          </div>
        </AnimatedSection>
        <div className="container mx-auto px-8 py-20">
          <AnimatedSection delay="stagger-1">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Editorial / 2024</span>
            <h2 className="text-3xl md:text-4xl mt-3 serif">The Minimalist Monologue</h2>
            <p className="text-on-surface-variant font-light mt-4 max-w-xl">The vastest landscapes produce the most intimate images. Here's why the coast and the people on it are inseparable.</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Story 2 — Full Width */}
      <section className="bg-surface">
        <div className="container mx-auto px-8 py-20">
          <AnimatedSection>
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Technical Craft</span>
            <h2 className="text-3xl md:text-4xl mt-3 serif">The Grain of Time</h2>
            <p className="text-on-surface-variant font-light mt-4 max-w-xl">Why we shoot 35mm film for weddings — and what grain, limitation, and physical media bring to your day.</p>
          </AnimatedSection>
        </div>
        <AnimatedSection>
          <div className="relative w-full aspect-[21/9] overflow-hidden">
            <Image
              src="/photos/nature/DSC01520.jpg"
              alt="Film photography"
              fill
              className="object-cover"
              sizes="100vw"
              quality={95}
            />
          </div>
        </AnimatedSection>
      </section>

      {/* Featured Story 3 — Full Width */}
      <section className="bg-surface-container-low">
        <AnimatedSection>
          <div className="relative w-full aspect-[21/9] overflow-hidden">
            <Image
              src="/photos/nature/DSC03629.jpg"
              alt="Halifax landscape"
              fill
              className="object-cover"
              sizes="100vw"
              quality={95}
            />
          </div>
        </AnimatedSection>
      </section>

      {/* Quote Section */}
      <section className="bg-primary-container py-40 px-8">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <span className="tracking-widest uppercase text-[11px] text-surface/60 mb-8 block">Capturing the Soul of the Maritimes</span>
            <h3 className="text-surface text-3xl md:text-5xl serif italic mb-8">&quot;Our goal is to capture beautiful in-between moments — the ones that make your story so special.&quot;</h3>
            <p className="text-secondary-fixed-dim font-light leading-relaxed mb-10 max-w-lg mx-auto">Be your true self. Show your fun, quirky personality. Laugh loudly. Kiss slowly. Hug tightly. We'll handle the rest.</p>
            <Link href="/portfolio" className="text-surface tracking-widest uppercase text-[11px] font-medium border-b border-surface/30 pb-2 hover:border-surface transition-all">See What We Mean</Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Our Services — 3 Column Cards */}
      <section className="bg-surface">
        <div className="container mx-auto px-8 py-40">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl mb-6">What We <span className="italic text-secondary">Do</span></h2>
            <p className="text-on-surface-variant font-light max-w-xl">Real people. Real moments. No posing, no awkwardness — just you, being you.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Service 1 */}
            <AnimatedSection>
              <div className="bg-surface-container-low overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/photos/wedding-1/DSC05542.jpg"
                    alt="Wedding photography"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="33vw"
                    quality={95}
                  />
                </div>
                <div className="p-8">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-3 block">Weddings & Events</span>
                  <h3 className="text-2xl serif mb-4">Your Day, Your Way</h3>
                  <p className="text-on-surface-variant font-light leading-relaxed text-sm">We blend into your celebration like family. No awkward direction, no stiff poses — just the real, unfiltered magic of your day. The stolen glances, the heartfelt embraces, the aunties dancing like nobody's watching.</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Service 2 */}
            <AnimatedSection delay="stagger-1">
              <div className="bg-surface-container-low overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/photos/portraits/DSC06687.jpg"
                    alt="Portrait work"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="33vw"
                    quality={95}
                  />
                </div>
                <div className="p-8">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-3 block">Portraits & Brands</span>
                  <h3 className="text-2xl serif mb-4">Who You Actually Are</h3>
                  <p className="text-on-surface-variant font-light leading-relaxed text-sm">Not the LinkedIn version. The real you — the one your friends know, the one your partner fell for. Personal branding, family portraits, editorial work — images that feel like memories before they're even taken.</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Service 3 */}
            <AnimatedSection delay="stagger-2">
              <div className="bg-surface-container-low overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/photos/events/DSC02885.JPG"
                    alt="Film and video"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="33vw"
                    quality={95}
                  />
                </div>
                <div className="p-8">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-3 block">Film & Video</span>
                  <h3 className="text-2xl serif mb-4">Moving Pictures That Move You</h3>
                  <p className="text-on-surface-variant font-light leading-relaxed text-sm">Hearing your vows again, seeing your mom's reaction in motion, reliving the chaos and joy of your sangeet — that hits different. We shoot cinematic films that make you feel it all over again.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Portfolio Collections */}
      <section className="bg-surface-container-low">
        <div className="container mx-auto px-8 py-40">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl mb-6">Our <span className="italic text-secondary">Work</span></h2>
            <p className="text-on-surface-variant font-light max-w-xl">Click through curated sets from our archive — weddings, families, streets, and everything in between.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              { title: "Nature & Landscape", category: "Nature", cover: "/photos/nature/DSC01206.JPG" },
              { title: "Family", category: "Family", cover: "/photos/family/DSC08614.jpg" },
              { title: "City", category: "City", cover: "/photos/city/DSC03293.JPG" },
              { title: "Weddings", category: "Weddings", cover: "/photos/wedding-1/DSC05542.jpg" },
              { title: "Events", category: "Events", cover: "/photos/events/DSC02757.JPG" },
            ].map((set, i) => (
              <Link key={i} href="/portfolio" className="group cursor-pointer relative block">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-variant">
                  <Image
                    src={set.cover}
                    alt={set.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={95}
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-500 flex items-end">
                    <div className="p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-white/80">{set.category}</span>
                      <h3 className="text-xl mt-1 text-white serif">{set.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-secondary">{set.category}</span>
                  <h3 className="text-xl mt-1 serif">{set.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser — Clean Section */}
      <section className="bg-surface-container">
        <div className="container mx-auto px-8 py-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <AnimatedSection>
                <span className="tracking-widest uppercase text-[11px] font-bold text-secondary mb-8 block">The Person Behind the Lens</span>
                <h2 className="text-4xl md:text-6xl mb-10 leading-tight">I'm not here to <br /> <span className="italic">direct</span> your day.</h2>
                <p className="text-on-surface-variant text-lg font-light leading-relaxed mb-10 max-w-xl">
                  I'm here to witness it. Founded by Akshay Kumar, Akshay Kumar Studios is built on one simple belief: the best photographs are the ones you don't see coming. No posing. No awkward directions. Just real moments, captured by someone who genuinely cares about your story.
                </p>
                <Link href="/about" className="inline-flex items-center gap-4 group">
                  <span className="tracking-widest uppercase text-[11px] font-bold border-b border-primary pb-1">Get to Know Me</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-2 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              </AnimatedSection>
            </div>
            <div className="md:col-span-5">
              <AnimatedSection delay="stagger-2">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <Image
                    src="/photos/me/Pinch_shoot_Headshot.jpeg"
                    alt="Akshay Kumar"
                    fill
                    className="object-cover"
                    sizes="40vw"
                    quality={95}
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-48 bg-surface">
        <div className="container mx-auto px-8 text-center">
          <AnimatedSection>
            <h2 className="text-5xl md:text-7xl lg:text-display-1 serif mb-12 leading-tight">Ready to tell <br /> <span className="italic font-normal">your story?</span></h2>
            <Link href="/booking" className="inline-flex items-center gap-4 group">
              <span className="tracking-widest uppercase text-[11px] font-bold border-b border-primary pb-1 group-hover:opacity-60 transition-opacity">Let's Talk</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-2 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
