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
              Capturing the <br /> <span className="italic font-normal">Soul</span> of the <br /> Maritimes.
            </h1>
            <p className="text-on-surface-variant max-w-lg text-lg font-light leading-relaxed mt-8 mb-10">
              An archive of light, shadow, and salt air. Based in Halifax, capturing timeless editorial stories through a cinematic lens.
            </p>
            <Link href="/portfolio" className="inline-flex items-center gap-4 group">
              <span className="tracking-widest uppercase text-[11px] font-semibold border-b border-primary pb-1 group-hover:opacity-60 transition-opacity">View Portfolio</span>
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
            />
          </div>
        </AnimatedSection>
        <div className="container mx-auto px-8 py-20">
          <AnimatedSection delay="stagger-1">
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Editorial / 2024</span>
            <h2 className="text-3xl md:text-4xl mt-3 serif">The Minimalist Monologue</h2>
            <p className="text-on-surface-variant font-light mt-4 max-w-xl">Documenting the intimate moments and grand landscapes that define life on the coast.</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Story 2 — Full Width */}
      <section className="bg-surface">
        <div className="container mx-auto px-8 py-20">
          <AnimatedSection>
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Technical Craft</span>
            <h2 className="text-3xl md:text-4xl mt-3 serif">The Grain of Time</h2>
            <p className="text-on-surface-variant font-light mt-4 max-w-xl">Why we choose 35mm film for maritime wedding documentation.</p>
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
            />
          </div>
        </AnimatedSection>
      </section>

      {/* Quote Section */}
      <section className="bg-primary-container py-40 px-8">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-surface text-3xl md:text-5xl serif italic mb-8">&quot;Light is the only language we need to speak.&quot;</h3>
            <p className="text-secondary-fixed-dim font-light leading-relaxed mb-10 max-w-lg mx-auto">Discover our award-winning cinematography services for high-end brands and intimate events.</p>
            <Link href="/portfolio" className="text-surface tracking-widest uppercase text-[11px] font-medium border-b border-surface/30 pb-2 hover:border-surface transition-all">Explore Film Works</Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Our Services — Alternating Sections */}
      <section className="bg-surface">
        <div className="container mx-auto px-8 py-40">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl mb-6">Our <span className="italic text-secondary">Expertise</span></h2>
            <p className="text-on-surface-variant font-light max-w-xl">Tailored visual experiences for those who value the intersection of art and documentation.</p>
          </AnimatedSection>
        </div>

        {/* Service 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <AnimatedSection>
            <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[600px] overflow-hidden">
              <Image
                src="/photos/wedding-1/DSC05542.jpg"
                alt="Coastal weddings"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </AnimatedSection>
          <div className="bg-surface-container-low flex items-center p-12 md:p-20">
            <AnimatedSection delay="stagger-1">
              <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-4 block">Fine Art Portraits</span>
              <h3 className="text-3xl md:text-display-3 serif mb-6">Coastal Weddings</h3>
              <p className="text-on-surface-variant font-light leading-relaxed max-w-md">Documenting love against the backdrop of Nova Scotia&apos;s wild landscapes. Unposed, raw, and deeply romantic.</p>
            </AnimatedSection>
          </div>
        </div>

        {/* Service 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-surface-container-low flex items-center p-12 md:p-20 order-2 md:order-1">
            <AnimatedSection>
              <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-4 block">Editorial Branding</span>
              <h3 className="text-3xl md:text-display-3 serif mb-6">Brand Narratives</h3>
              <p className="text-on-surface-variant font-light leading-relaxed max-w-md">Crafting visual identities that resonate. We tell the stories of brands through an editorial lens.</p>
            </AnimatedSection>
          </div>
          <AnimatedSection delay="stagger-1">
            <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[600px] overflow-hidden order-1 md:order-2">
              <Image
                src="/photos/wedding-2/DSC02061.jpg"
                alt="Brand work"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Service 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <AnimatedSection>
            <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[600px] overflow-hidden">
              <Image
                src="/photos/city/DSC01984.JPG"
                alt="Artist archives"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </AnimatedSection>
          <div className="bg-surface-container-low flex items-center p-12 md:p-20">
            <AnimatedSection delay="stagger-1">
              <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-4 block">Cinematic Film</span>
              <h3 className="text-3xl md:text-display-3 serif mb-6">Artist Archives</h3>
              <p className="text-on-surface-variant font-light leading-relaxed max-w-md">Showcasing the process behind the craft. We tell the stories of Halifax&apos;s most creative minds.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Portfolio Collections */}
      <section className="bg-surface-container-low">
        <div className="container mx-auto px-8 py-40">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl mb-6">Portfolio <span className="italic text-secondary">Collections</span></h2>
            <p className="text-on-surface-variant font-light max-w-xl">Click through curated sets from our archive.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              { title: "Nature & Landscape", category: "Nature", cover: "/photos/nature/DSC01069.jpg" },
              { title: "Family", category: "Family", cover: "/photos/family/DSC08614.jpg" },
              { title: "City", category: "City", cover: "/photos/city/DSC01984.JPG" },
              { title: "Weddings", category: "Weddings", cover: "/photos/wedding-1/DSC05542.jpg" },
              { title: "Portraits", category: "Portraits", cover: "/photos/portraits/DSC06687.jpg" },
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
                <span className="tracking-widest uppercase text-[11px] font-bold text-secondary mb-8 block">The Visionary</span>
                <h2 className="text-4xl md:text-6xl mb-10 leading-tight">Authenticity is the <br /> <span className="italic">only medium</span> that matters.</h2>
                <p className="text-on-surface-variant text-lg font-light leading-relaxed mb-10 max-w-xl">
                  Founded by Akshay Kumar, Akshay Kumar Studios is a studio dedicated to the preservation of atmosphere. We don&apos;t just take pictures; we capture the feeling of the Atlantic—the quiet before the storm, the warmth of a hearth, the salt on the skin.
                </p>
                <Link href="/about" className="inline-flex items-center gap-4 group">
                  <span className="tracking-widest uppercase text-[11px] font-bold border-b border-primary pb-1">Our Philosophy</span>
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
            <h2 className="text-5xl md:text-7xl lg:text-display-1 serif mb-12 leading-tight">Ready to document <br /> <span className="italic font-normal">your history?</span></h2>
            <Link href="/booking" className="inline-flex items-center gap-4 group">
              <span className="tracking-widest uppercase text-[11px] font-bold border-b border-primary pb-1 group-hover:opacity-60 transition-opacity">Start a Project</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-2 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
