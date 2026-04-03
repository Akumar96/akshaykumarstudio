"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { topicArticles, getAllCategories, type TopicArticle } from "@/data/topics";

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

function ArticleCard({ article, index }: { article: TopicArticle; index: number }) {
  const isLarge = index === 0;
  return (
    <AnimatedSection delay={index > 0 ? `stagger-${Math.min(index, 4)}` : ""}>
      <Link href={`/topics/${article.slug}`} className="group block">
        <article className={`relative overflow-hidden cursor-pointer ${isLarge ? "md:col-span-2" : ""}`}>
          <div className={`relative overflow-hidden ${isLarge ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes={isLarge ? "66vw" : "33vw"}
              quality={95}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-transparent to-transparent opacity-60"></div>
          </div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-surface">
            <span className="tracking-widest uppercase text-[10px] font-medium mb-2 block opacity-80">{article.category}</span>
            <h2 className={`mb-3 leading-snug ${isLarge ? "text-2xl md:text-4xl max-w-2xl" : "text-xl md:text-2xl max-w-lg"}`}>{article.title}</h2>
            {isLarge && (
              <p className="text-sm opacity-80 max-w-xl mb-4 hidden md:block">{article.excerpt}</p>
            )}
            <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-xs uppercase tracking-widest font-semibold">Read Article</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </div>
          </div>
        </article>
      </Link>
    </AnimatedSection>
  );
}

function SideArticle({ article }: { article: TopicArticle }) {
  return (
    <AnimatedSection>
      <Link href={`/topics/${article.slug}`} className="group block">
        <article className="cursor-pointer">
          <div className="relative aspect-[4/5] overflow-hidden mb-6">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="50vw"
              quality={95}
            />
          </div>
          <span className="tracking-widest uppercase text-[10px] font-medium text-secondary mb-3 block">{article.category}</span>
          <h2 className="text-2xl mb-3 leading-tight">{article.title}</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{article.excerpt}</p>
          <span className="text-[11px] tracking-[0.2em] uppercase font-bold border-b border-primary pb-1">Read the Article</span>
        </article>
      </Link>
    </AnimatedSection>
  );
}

function SpreadArticle({ article, reverse = false }: { article: TopicArticle; reverse?: boolean }) {
  return (
    <AnimatedSection>
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-12 items-center`}>
        <div className={`md:col-span-7 ${reverse ? "md:col-start-6" : ""}`}>
          <Link href={`/topics/${article.slug}`} className="block group cursor-pointer">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="60vw"
                quality={95}
              />
            </div>
          </Link>
        </div>
        <div className={`md:col-span-5 ${reverse ? "md:col-start-1 md:order-1" : "md:col-start-8 md:order-2"}`}>
          <Link href={`/topics/${article.slug}`} className="block cursor-pointer">
            <span className="tracking-widest uppercase text-[10px] font-semibold text-secondary mb-4 block">{article.category}</span>
            <h3 className="text-3xl mb-4 leading-tight">{article.title}</h3>
            <p className="text-on-surface-variant text-sm leading-loose mb-6">{article.excerpt}</p>
            <span className="text-[11px] tracking-[0.2em] uppercase font-bold border-b border-primary pb-1">Read the Article</span>
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default function Topics() {
  const [activeFilter, setActiveFilter] = useState<string>("All Stories");
  const categories = ["All Stories", ...getAllCategories()];

  const filteredArticles = activeFilter === "All Stories"
    ? topicArticles
    : topicArticles.filter((a) => a.category === activeFilter);

  const featured = filteredArticles[0];
  const sideArticles = filteredArticles.slice(1, 3);
  const spreadArticles = filteredArticles.slice(3);

  return (
    <div>
      {/* Header Section */}
      <header className="px-8 max-w-7xl mx-auto mb-20 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="tracking-widest uppercase text-[11px] font-semibold text-secondary mb-4 block">Education & Insights</span>
            <h1 className="text-5xl md:text-7xl leading-tight mb-8">The stuff we <br /> <span className="italic font-normal">think about</span></h1>
            <p className="text-on-surface-variant max-w-md leading-relaxed text-lg">
              A curated space dedicated to the craft of film photography, the science of light, and the quiet beauty of the Atlantic coast.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col space-y-6">
            <div className="relative group">
              <input
                className="w-full bg-surface-container-low border-none focus:ring-0 px-4 py-4 text-sm font-body outline-none placeholder-on-surface-variant/50"
                placeholder="Search topics..."
                type="text"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filters */}
      <section className="px-8 max-w-7xl mx-auto mb-20 overflow-x-auto">
        <div className="flex space-x-8 border-b border-outline-variant/15 pb-4 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`tracking-widest uppercase text-[11px] whitespace-nowrap pb-4 transition-colors ${
                activeFilter === cat
                  ? "font-bold text-primary border-b-2 border-primary"
                  : "font-medium text-secondary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {featured && (
        <>
          {/* Featured Full-Width Article */}
          <section className="px-8 max-w-7xl mx-auto mb-24">
            <ArticleCard article={featured} index={0} />
          </section>

          {/* Side-by-Side Articles */}
          {sideArticles.length >= 2 && (
            <section className="px-8 max-w-7xl mx-auto mb-40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <SideArticle article={sideArticles[0]} />
                <SideArticle article={sideArticles[1]} />
              </div>
            </section>
          )}

          {/* Spread Articles */}
          {spreadArticles.map((article, i) => (
            <section key={article.slug} className="px-8 max-w-7xl mx-auto mb-40">
              <SpreadArticle article={article} reverse={i % 2 === 1} />
            </section>
          ))}
        </>
      )}

      {/* Newsletter / CTA */}
      <section className="mt-20 px-8 max-w-4xl mx-auto text-center mb-40">
        <AnimatedSection>
          <h2 className="text-4xl mb-6">Join the Private Journal</h2>
          <p className="text-on-surface-variant mb-10 max-w-md mx-auto leading-relaxed">Weekly reflections on light, gear reviews, and exclusive workshop invitations delivered to your inbox.</p>
          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              className="flex-grow bg-surface-container-lowest border-none px-6 py-4 text-sm font-body outline-none focus:ring-1 focus:ring-primary"
              placeholder="Your email address"
              type="email"
            />
            <button className="bg-primary text-on-primary px-10 py-4 text-[11px] tracking-widest uppercase font-bold hover:opacity-80 transition-opacity">Subscribe</button>
          </form>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container w-full py-20 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div>
            <div className="font-serif text-lg tracking-widest uppercase text-primary mb-8">Akshay Kumar Studios</div>
            <p className="font-body text-secondary text-sm leading-loose">
              Dedicated to the preservation of authentic moments through the lens of fine art photography. Based in Halifax, Nova Scotia.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="font-serif text-sm font-bold text-primary mb-2 uppercase tracking-widest">Connect</h4>
            <Link href="/booking" className="text-secondary hover:text-primary transition-all text-sm font-body">Contact</Link>
            <a href="#" className="text-secondary hover:text-primary transition-all text-sm font-body">Instagram</a>
            <Link href="/topics" className="text-secondary hover:text-primary transition-all text-sm font-body underline decoration-1 underline-offset-4">Journal</Link>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="font-serif text-sm font-bold text-primary mb-2 uppercase tracking-widest">Legal</h4>
            <a href="#" className="text-secondary hover:text-primary transition-all text-sm font-body">Privacy</a>
            <a href="#" className="text-secondary hover:text-primary transition-all text-sm font-body">Halifax Editorial Services</a>
            <p className="text-[10px] text-secondary pt-8 font-body">© 2024 Akshay Kumar Studios. Halifax Fine Art Photography.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
