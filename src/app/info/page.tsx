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

const services = [
  {
    title: "Weddings",
    subtitle: "Coastal & Destination",
    description: "Every love story deserves to be told with authenticity and grace. We document your day as it unfolds — unposed, raw, and deeply romantic — against the backdrop of Nova Scotia's wild landscapes or wherever your story takes us.",
    image: "/photos/wedding-1/DSC05582.jpg",
    features: ["Full day coverage (8-12 hours)", "Second photographer included", "Online gallery with 500+ images", "Fine art prints available", "Engagement session included"],
  },
  {
    title: "Portraits",
    subtitle: "Editorial & Fine Art",
    description: "Portraits that capture who you are — not just how you look. Whether it's a personal branding session, family documentation, or an editorial commission, we create images that feel like memories before they're even taken.",
    image: "/photos/nature/DSC03402.jpg",
    features: ["60-90 minute session", "Location scouting included", "30-50 edited images", "Online gallery", "Print release included"],
  },
  {
    title: "Commercial",
    subtitle: "Brand & Product",
    description: "Visual storytelling for brands that value substance over trend. From product photography to brand narratives, we create imagery that resonates with your audience and elevates your identity.",
    image: "/photos/city/DSC02205.jpg",
    features: ["Creative direction", "Product & lifestyle photography", "Social media content packages", "Brand narrative development", "Commercial licensing"],
  },
  {
    title: "Events",
    subtitle: "Corporate & Private",
    description: "From gallery openings to corporate gatherings, we capture the energy and atmosphere of your event with a documentary approach that prioritizes authentic moments over staged formality.",
    image: "/photos/events/DSC02885.JPG",
    features: ["Flexible coverage hours", "Same-day preview images", "Online gallery", "High-resolution delivery", "Rush editing available"],
  },
];

const testimonials = [
  {
    quote: "Akshay didn't just photograph our wedding — he told our story. Every image feels like a memory we're reliving. The way he captured the light on the coast, the quiet moments between us... it's beyond anything we imagined.",
    name: "Sarah & James Mitchell",
    role: "Coastal Wedding, Peggy's Cove",
    image: "/photos/wedding-1/DSC05542.jpg",
  },
  {
    quote: "Working with this studio transformed our brand entirely. The editorial approach to our product line gave us imagery that feels like art — our customers constantly comment on how beautiful our visuals are.",
    name: "Elena Vasquez",
    role: "Creative Director, Salt & Stone Co.",
    image: "/photos/portraits/DSC06687.jpg",
  },
  {
    quote: "The family portraits exceeded every expectation. He made our kids feel completely at ease, and the resulting images are the most natural, beautiful photographs of our family we've ever had. They hang in our living room and we look at them every day.",
    name: "The MacLeod Family",
    role: "Family Portrait Session, Halifax",
    image: "/photos/family/DSC08614.jpg",
  },
  {
    quote: "I've worked with many photographers over the years, but the level of intentionality and craft here is unmatched. Every image is considered, every moment captured with purpose. This is photography as art, not just documentation.",
    name: "David Chen",
    role: "Gallery Owner, Art Gallery of Nova Scotia",
    image: "/photos/portraits/DSC06721.jpg",
  },
  {
    quote: "Our corporate event was captured with such elegance and attention to detail. The same-day preview images were a huge hit on our social media, and the final gallery was delivered faster than promised. Truly professional.",
    name: "Rachel Thornton",
    role: "Marketing Director, Halifax Convention Centre",
    image: "/photos/events/DSC02757.JPG",
  },
  {
    quote: "The engagement session was the most fun we've ever had in front of a camera. Akshay has this incredible ability to make you forget you're being photographed. The results are stunning — we've already booked him for our wedding.",
    name: "Alex & Priya Sharma",
    role: "Engagement Session, South End Halifax",
    image: "/photos/wedding-2/DSC02059.jpg",
  },
];

const faqs = [
  {
    question: "What is your booking process?",
    answer: "After your initial inquiry, we'll schedule a complimentary consultation to discuss your vision, timeline, and any specific requirements. Once we're both confident we're the right fit, a 30% retainer secures your date.",
  },
  {
    question: "How long until we receive our images?",
    answer: "Wedding galleries are delivered within 6-8 weeks. Portrait sessions within 2-3 weeks. Commercial projects vary based on scope but typically 3-4 weeks. Rush editing is available for an additional fee.",
  },
  {
    question: "Do you travel for shoots?",
    answer: "Absolutely. While we're based in Halifax, we regularly travel across the Maritimes and beyond. Travel fees apply for destinations outside of the HRM area.",
  },
  {
    question: "What style of photography do you specialize in?",
    answer: "Fine art editorial with a documentary sensibility. We prioritize natural light, authentic moments, and cinematic composition. Our work is influenced by film photography and the unique quality of Atlantic coastal light.",
  },
  {
    question: "Do you offer prints and albums?",
    answer: "Yes. We offer museum-quality fine art prints on archival paper and handcrafted leather-bound albums. Print pricing is available upon request, and album packages can be added to any session.",
  },
];

export default function Info() {
  return (
    <div>
      {/* Hero */}
      <section className="px-8 max-w-7xl mx-auto mb-32 pt-4">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="tracking-widest uppercase text-[11px] text-secondary block mb-6">Services & Experience</span>
            <h1 className="text-5xl md:text-7xl leading-[1.1] mb-8">
              Crafting <span className="italic">Timeless</span> <br />Visual Stories.
            </h1>
            <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
              Every commission is approached as a unique visual monograph — from the initial conversation to the final print.
            </p>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="aspect-[4/5] overflow-hidden relative">
              <Image
                  src="/photos/nature/DSC03629-2.jpg"
                  alt="Photography equipment"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mb-40">
        {services.map((service, i) => (
          <div key={service.title} className={i % 2 === 0 ? "" : ""}>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${i % 2 === 1 ? "" : ""}`}>
              <AnimatedSection>
                <div className={`relative aspect-[4/5] md:aspect-auto md:min-h-[500px] overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              </AnimatedSection>
              <div className="bg-surface-container-low flex items-center p-12 md:p-20">
                <AnimatedSection delay="stagger-1">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2 block">{service.subtitle}</span>
                  <h2 className="text-3xl md:text-4xl serif mb-6">{service.title}</h2>
                  <p className="text-on-surface-variant font-light leading-relaxed max-w-md mb-8">{service.description}</p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-on-surface-variant">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-secondary flex-shrink-0"><path d="M20 6 9 17l-5-5" /></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/booking" className="inline-flex items-center gap-3 group">
                    <span className="tracking-widest uppercase text-[11px] font-bold border-b border-primary pb-1 group-hover:opacity-60 transition-opacity">Book This Service</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-x-2 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </Link>
                </AnimatedSection>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="px-8 max-w-4xl mx-auto mb-40">
        <AnimatedSection>
          <div className="text-center mb-20">
            <span className="tracking-widest uppercase text-[11px] text-secondary block mb-6">Common Questions</span>
            <h2 className="text-4xl md:text-5xl serif mb-6">Frequently <span className="italic">Asked</span></h2>
          </div>
        </AnimatedSection>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <AnimatedSection key={faq.question} delay={`stagger-${Math.min(i % 4 + 1, 4)}`}>
              <details className="group border-b border-outline-variant/20 py-8 cursor-pointer">
                <summary className="flex justify-between items-center list-none text-lg font-serif pr-8">
                  <span>{faq.question}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-secondary group-open:rotate-45 transition-transform duration-300"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                </summary>
                <p className="text-on-surface-variant text-sm leading-relaxed mt-4 max-w-2xl">{faq.answer}</p>
              </details>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-container py-40 px-8 text-center mb-40">
        <AnimatedSection>
          <h2 className="text-surface text-4xl md:text-6xl serif italic mb-8 max-w-3xl mx-auto leading-tight">Ready to create something timeless?</h2>
          <p className="text-secondary-fixed-dim font-light leading-relaxed mb-10 max-w-lg mx-auto">Every great image begins with a conversation. Let's discuss your vision.</p>
          <Link href="/booking" className="inline-flex items-center gap-4 group">
            <span className="text-surface tracking-widest uppercase text-[11px] font-bold border-b border-surface/40 pb-1 group-hover:border-surface transition-colors">Start a Conversation</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-surface group-hover:translate-x-2 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container w-full py-20 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div>
            <div className="font-serif text-lg tracking-widest uppercase text-primary mb-6">Akshay Kumar Studios</div>
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
            </div>
          </div>
          <div className="flex flex-col justify-between items-start md:items-end h-full">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Link href="/booking" className="font-label tracking-widest uppercase text-[11px] text-primary">Inquire</Link>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </div>
            <div className="mt-12 md:mt-0 font-body text-[11px] text-secondary md:text-right">
              © 2024 Akshay Kumar Studios. <br />
              Halifax Fine Art Photography.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
