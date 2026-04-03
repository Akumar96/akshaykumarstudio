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
              src="/photos/me/Pinch_shoot_image2.jpeg"
              alt="Akshay Kumar"
              fill
              className="object-cover brightness-90 transition-transform duration-1000 hover:scale-105"
              sizes="66vw"
              priority
              quality={95}
            />
          </div>
          <div className="md:col-span-4 bg-surface-container-lowest p-12 md:-ml-24 relative z-10">
            <span className="font-label tracking-[0.2em] uppercase text-[10px] text-secondary mb-4 block">Founder & Lead Photographer</span>
            <h1 className="font-headline text-5xl md:text-7xl leading-[1.1] mb-6">Akshay <span className="italic">Kumar</span></h1>
            <p className="font-body text-on-surface-variant leading-relaxed mb-8">I'm the guy behind the camera at every wedding, every shoot, every late-night edit session. And I wouldn't have it any other way.</p>
          </div>
        </div>
      </section>

      {/* Our Manifesto */}
      <section className="bg-surface-container-low py-40 px-8">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-label tracking-[0.3em] uppercase text-[10px] text-secondary mb-8 block">Our Manifesto</span>
            <h2 className="font-headline text-4xl md:text-5xl mb-10 leading-tight">We strive to capture <span className="italic">organic moments</span> and the raw genuine emotions of a wedding day.</h2>
            <div className="h-px w-24 bg-outline-variant mx-auto mb-10"></div>
            <p className="font-body text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              We love stories and real moments of laughter, spontaneity, tears of joy and love — while appreciating all the in-between moments.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* The Story (Asymmetric Layout) */}
      <section className="px-8 max-w-7xl mx-auto mb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          <AnimatedSection>
            <h2 className="font-headline text-4xl mb-8">Why I Do This</h2>
            <div className="space-y-6 text-on-surface-variant leading-loose font-body text-lg">
              <p>I didn't start this studio because I wanted to be a business owner. I started it because I couldn't stop photographing people — their real selves, not the versions they perform for the camera.</p>
              <p>Every wedding I shoot, every family session, every portrait — I approach it the same way: <strong>what would make someone cry looking at this in twenty years?</strong> That's the standard. Not awards, not Instagram likes, not magazine features. The moment your kid looks at their parents' wedding photos and actually feels something.</p>
              <p>That's what I'm here for. That's what Akshay Kumar Studios is built on.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay="stagger-1">
            <div className="relative pt-20">
              <div className="aspect-[4/5] overflow-hidden relative">
                <Image
                  src="/photos/nature/DSC01535.JPG"
                  alt="Behind the lens"
                  fill
                  className="object-cover"
                  sizes="40vw"
                  quality={95}
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-primary-container text-surface p-8 max-w-xs">
                <p className="font-headline italic text-xl">&quot;The best moments are the ones you never plan.&quot;</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Meet Everyone — The Collective */}
      <section className="px-8 max-w-7xl mx-auto mb-40">
        <div className="text-center mb-16">
          <AnimatedSection>
            <span className="font-label tracking-[0.2em] uppercase text-[10px] text-secondary mb-4 block">The Person Behind the Lens</span>
            <h2 className="font-headline text-4xl">Meet Akshay</h2>
            <p className="font-body text-on-surface-variant max-w-sm mx-auto text-sm leading-relaxed mt-4">One guy, one camera, one obsession with real moments.</p>
          </AnimatedSection>
        </div>
        <div className="max-w-md mx-auto text-center">
          {/* Akshay Kumar */}
          <AnimatedSection>
            <div className="group">
              <div className="aspect-[3/4] overflow-hidden mb-6 relative max-w-sm mx-auto">
                <Image
                  src="/photos/me/Pinch_shoot_Headshot.jpeg"
                  alt="Akshay Kumar"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="50vw"
                  priority
                  quality={95}
                />
              </div>
              <h3 className="font-headline text-2xl mb-1">Akshay Kumar</h3>
              <p className="font-label tracking-widest uppercase text-[10px] text-secondary mb-4">Photography / Videography / Production — Founder & Sole Owner</p>
              <p className="font-body text-on-surface-variant text-sm leading-relaxed max-w-md mx-auto">A visionary storyteller who sees every wedding like a movie — every glance, every laugh, every tear tells a story. Akshay is the guy who'll make sure your love story looks straight out of a fairytale. When he's not behind the camera, you'll find him binge-watching classic films or hunting for the best pizza in town. Your best friend by the end of wedding week.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values / Community Connection */}
      <section className="px-8 max-w-7xl mx-auto mb-40">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-20">
            <div className="md:col-span-4">
              <h2 className="font-headline text-3xl">What Drives Us</h2>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="font-bold text-[11px] tracking-widest uppercase mb-4">Real Moments, Real Emotions</h4>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed">We don't stage or force anything. Our approach is rooted in being present, reading the room, and capturing what's actually happening — the laughter, the tears, the quiet glances that tell the real story.</p>
              </div>
              <div>
                <h4 className="font-bold text-[11px] tracking-widest uppercase mb-4">The In-Between Moments</h4>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed">Some of the best images come from the moments nobody planned — a shared smile during vows, a quiet breath before the first dance, the way light falls on a detail nobody else noticed.</p>
              </div>
              <div>
                <h4 className="font-bold text-[11px] tracking-widest uppercase mb-4">Full-Service Production</h4>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed">From photography to videography to post-production, we handle every aspect of your visual story. One team, one vision, one seamless experience from start to finish.</p>
              </div>
              <div>
                <h4 className="font-bold text-[11px] tracking-widest uppercase mb-4">Your Best Friend by Wedding Week</h4>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed">We don't just show up and shoot. We get to know you, your story, and what matters most. By the time your wedding day arrives, we feel like part of the family.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Equipment / Gear */}
      <section className="bg-surface-container-low py-40 px-8">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-label tracking-[0.3em] uppercase text-[10px] text-secondary mb-8 block">The Gear</span>
            <h2 className="font-headline text-4xl md:text-5xl mb-10 leading-tight">Professional-grade tools for <span className="italic">professional-grade</span> results.</h2>
            <div className="h-px w-24 bg-outline-variant mx-auto mb-10"></div>
            <p className="font-body text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-16">
              The right equipment matters. Here's what I bring to every shoot.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center p-8">
              <div className="text-4xl mb-4">📷</div>
              <h4 className="font-bold text-[11px] tracking-widest uppercase mb-3">Sony Alpha 1</h4>
              <p className="font-body text-on-surface-variant text-sm leading-relaxed">50.1MP full-frame sensor, 30fps burst, 8K video. The camera that captures every detail — from the widest ceremony shot to the most intimate glance.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay="stagger-1">
            <div className="text-center p-8">
              <div className="text-4xl mb-4">🎙️</div>
              <h4 className="font-bold text-[11px] tracking-widest uppercase mb-3">DJI Mic 3</h4>
              <p className="font-body text-on-surface-variant text-sm leading-relaxed">Crystal-clear audio capture for vows, speeches, and every word in between. Because your story isn't just visual — it's heard too.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay="stagger-2">
            <div className="text-center p-8">
              <div className="text-4xl mb-4">🚁</div>
              <h4 className="font-bold text-[11px] tracking-widest uppercase mb-3">DJI Mavic 3 Pro</h4>
              <p className="font-body text-on-surface-variant text-sm leading-relaxed">Aerial photography and videography that gives your day a perspective no ground camera can match. Sweeping, cinematic, unforgettable.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay="stagger-3">
            <div className="text-center p-8">
              <div className="text-4xl mb-4">🔭</div>
              <h4 className="font-bold text-[11px] tracking-widest uppercase mb-3">Professional Lenses</h4>
              <p className="font-body text-on-surface-variant text-sm leading-relaxed">A curated selection of prime and zoom lenses — from ultra-wide to telephoto — chosen for sharpness, bokeh, and the ability to shoot in any light.</p>
            </div>
          </AnimatedSection>
        </div>
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
