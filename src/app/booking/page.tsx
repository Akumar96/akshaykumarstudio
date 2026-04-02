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

export default function Booking() {
  return (
    <div>
      {/* Hero Section */}
      <section className="px-8 max-w-7xl mx-auto mb-32 grid md:grid-cols-12 gap-8 items-end pt-4">
        <div className="md:col-span-7">
          <span className="tracking-widest uppercase text-[11px] text-secondary block mb-6">Reservation & Inquiries</span>
          <h1 className="text-5xl md:text-7xl leading-[1.1] mb-8">Capturing the <br /><span className="italic">Quiet Moments</span> of Life.</h1>
          <p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
            Every commission is approached as a unique visual monograph. We prioritize authenticity over artifice, and light over trends.
          </p>
        </div>
        <div className="md:col-span-5 hidden md:block">
          <div className="aspect-[4/5] overflow-hidden relative">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
              alt="Coastal cliff"
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
        </div>
      </section>

      {/* Booking and Inquiry Content */}
      <section className="px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Contact Form Side */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl mb-12 font-serif italic border-b border-outline-variant/20 pb-6">Commission a Story</h2>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Full Name</label>
                <input
                  className="bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary py-2 transition-colors placeholder:text-outline-variant/60"
                  placeholder="Elias Thorne"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Email Address</label>
                <input
                  className="bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary py-2 transition-colors placeholder:text-outline-variant/60"
                  placeholder="elias@archive.com"
                  type="email"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Event Type</label>
                <select className="bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary py-2 appearance-none cursor-pointer">
                  <option>Editorial Portrait</option>
                  <option>Coastal Wedding</option>
                  <option>Fine Art Architectural</option>
                  <option>Product Narrative</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Preferred Date</label>
                <input
                  className="bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary py-2 transition-colors"
                  type="date"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Location (Halifax & Surroundings)</label>
              <select className="bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary py-2 appearance-none cursor-pointer">
                <option>Downtown Halifax / Historic District</option>
                <option>Peggy&apos;s Cove / Coastal Routes</option>
                <option>Dartmouth / Lakefronts</option>
                <option>Wolfville / Annapolis Valley</option>
                <option>Other / Destination</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Tell us about your vision</label>
              <textarea
                className="bg-transparent border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary py-2 resize-none transition-colors placeholder:text-outline-variant/60"
                placeholder="Describe the mood, the light, and the legacy you wish to capture..."
                rows={4}
              />
            </div>
            <button
              className="w-full bg-primary text-on-primary py-5 text-[11px] uppercase tracking-[0.3em] font-medium hover:bg-primary-container transition-all flex items-center justify-center gap-3 group rounded-full"
              type="submit"
            >
              Send Inquiry
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
          </form>
        </div>

        {/* Process & Info Side */}
        <div className="space-y-16">
          <div>
            <h2 className="text-3xl mb-8 font-serif">The Archival Process</h2>
            <p className="text-on-surface-variant leading-relaxed mb-12">
              Creating lasting imagery requires a collaborative and intentional approach. We do not simply take photos; we curate memories into a tangible archive.
            </p>
            <div className="space-y-12">
              <ProcessStep number="01" title="The Conversation" description="We begin with a personal consultation to understand your aesthetic preferences, the significance of the event, and the desired emotional resonance of the final images." />
              <ProcessStep number="02" title="The Curation" description="Location scouting and mood boarding. We select the perfect environment in the Halifax area that complements the light and the story we are telling." />
              <ProcessStep number="03" title="The Capture" description="A seamless, non-intrusive session. We utilize both digital and film mediums to achieve the signature depth and grain of &apos;Akshay Kumar Studios.&apos;" />
              <ProcessStep number="04" title="The Archive" description="Delivery of your bespoke gallery and hand-finished prints. A legacy preserved for generations to come." />
            </div>
          </div>
          <div className="bg-surface-container-low p-8 border-l-2 border-secondary">
            <p className="italic text-secondary font-serif mb-4">&quot;A photograph is a secret about a secret. The more it tells you the less you know.&quot;</p>
            <span className="text-[10px] uppercase tracking-widest">— Diane Arbus</span>
          </div>
        </div>
      </section>

      {/* Visual Anchor Section — Full Color, Clean Grid */}
      <section className="mt-32 px-8 max-w-[1920px] mx-auto">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="aspect-[3/4] overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80"
                alt="Vintage camera"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"
                alt="Architecture"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Forest landscape"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Page-Specific Footer for Booking */}
      <footer className="bg-surface-container w-full py-20 px-8 mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-lg tracking-widest uppercase text-primary">Akshay Kumar Studios</h3>
            <p className="text-secondary text-sm leading-relaxed max-w-xs">
              Dedicated to fine art photography and editorial storytelling along the Atlantic coast.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-2">Connect</h4>
            <div className="flex flex-col gap-3">
              <Link href="/booking" className="text-secondary hover:text-primary transition-all text-sm">Contact</Link>
              <a href="#" className="text-secondary hover:text-primary transition-all text-sm">Instagram</a>
              <Link href="/topics" className="text-secondary hover:text-primary transition-all text-sm underline decoration-1 underline-offset-4">Journal</Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-2">Information</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-secondary hover:text-primary transition-all text-sm">Privacy</a>
              <a href="#" className="text-secondary hover:text-primary transition-all text-sm">Halifax Editorial Services</a>
              <span className="text-secondary text-[10px] mt-4 uppercase tracking-widest">© 2024 Akshay Kumar Studios. Halifax Fine Art Photography.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="flex-shrink-0 text-2xl font-serif italic text-secondary">{number}</div>
      <div>
        <h3 className="text-xl mb-2">{title}</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
