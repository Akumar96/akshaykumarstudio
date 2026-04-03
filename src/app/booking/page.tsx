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
          <h1 className="text-5xl md:text-7xl leading-[1.1] mb-8">Let's make <br /><span className="italic">something real</span> together.</h1>
          <p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
            Your wedding is all about you, your family, and the people who matter most. Be your true self. Show your fun, quirky personality. We'll handle the rest.
          </p>
        </div>
        <div className="md:col-span-5 hidden md:block">
          <div className="aspect-[4/5] overflow-hidden relative">
            <Image
              src="/photos/nature/DSC01643.JPG"
              alt="Coastal landscape"
              fill
              className="object-cover"
              sizes="40vw"
              quality={95}
            />
          </div>
        </div>
      </section>

      {/* Contact / Email Section */}
      <section className="px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Email Side */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl mb-12 font-serif italic border-b border-outline-variant/20 pb-6">Get in Touch</h2>
          <p className="text-on-surface-variant leading-relaxed text-lg mb-8">
            The best way to start is with an email. Tell us about your day, your vision, and what matters most to you. We'll get back to you within 24 hours.
          </p>
          <a
            href="mailto:a.kumar.uwo@gmail.com"
            className="inline-block text-xl serif text-primary hover:opacity-70 transition-opacity mb-4"
          >
            a.kumar.uwo@gmail.com
          </a>
          <p className="text-on-surface-variant text-sm font-light italic mt-6">
            Or just book a free diagnostic call below — not a sales call, just a conversation about what you need.
          </p>
        </div>

        {/* Process & Info Side */}
        <div className="space-y-16">
          <div>
            <h2 className="text-3xl mb-8 font-serif">How It Works</h2>
            <p className="text-on-surface-variant leading-relaxed mb-12">
              We keep it simple. No confusing packages, no hidden fees, no pressure. Just a conversation about what matters to you and how we can help.
            </p>
            <div className="space-y-12">
              <ProcessStep number="01" title="Reach Out" description="Send us an email or book a call below. Tell us your date, your venue (or idea of one), and what you're hoping for. We'll get back to you within 24 hours." />
              <ProcessStep number="02" title="Let's Talk" description="We'll set up a call or meet for coffee — whatever feels right. This isn't a sales pitch. It's a diagnostic conversation. We want to know your story, your family, what makes you laugh, and what moments matter most to you." />
              <ProcessStep number="03" title="We Plan Together" description="Once we're both confident we're the right fit, we'll map out your day together. Timeline, key moments, family dynamics, cultural traditions — we learn it all so we don't miss a thing." />
              <ProcessStep number="04" title="You Live It, We Capture It" description="On the day, you do you. Laugh loudly. Kiss slowly. Hug tightly. We blend in, stay out of the way, and capture everything — the big moments and the tiny ones you didn't even notice." />
            </div>
          </div>
          <div className="bg-surface-container-low p-8 border-l-2 border-secondary">
            <p className="italic text-secondary font-serif mb-4">&quot;A photograph is a secret about a secret. The more it tells you the less you know.&quot;</p>
            <span className="text-[10px] uppercase tracking-widest">— Diane Arbus</span>
          </div>
        </div>
      </section>

      {/* Calendly Booking Section */}
      <section className="px-8 max-w-5xl mx-auto py-32">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="tracking-widest uppercase text-[11px] font-bold text-secondary mb-6">Book a Session</p>
            <h2 className="text-4xl md:text-5xl serif leading-tight">Book a free <span className="italic">diagnostic call</span></h2>
            <p className="text-on-surface-variant font-light mt-4 max-w-md mx-auto">Not a sales call — just a conversation about what you need, what matters to you, and whether we're the right fit for each other.</p>
          </div>
        </AnimatedSection>
        <div className="min-h-[700px]">
          <iframe
            src="https://calendly.com/a-kumar-uwo/new-meeting"
            width="100%"
            height="700"
            frameBorder="0"
            title="Book a session"
          />
        </div>
      </section>

      {/* Visual Anchor Section — Full Color, Clean Grid */}
      <section className="mt-0 px-8 max-w-[1920px] mx-auto">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="aspect-[3/4] overflow-hidden relative">
              <Image
                src="/photos/wedding-1/DSC05542.jpg"
                alt="Wedding"
                fill
                className="object-cover"
                sizes="33vw"
                quality={95}
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden relative">
              <Image
                src="/photos/portraits/DSC06687.jpg"
                alt="Portrait"
                fill
                className="object-cover"
                sizes="33vw"
                quality={95}
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden relative">
              <Image
                src="/photos/wedding-3/DSC03342.jpg"
                alt="Wedding"
                fill
                className="object-cover"
                sizes="33vw"
                quality={95}
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
