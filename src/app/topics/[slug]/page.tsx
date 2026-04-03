import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { topicArticles, getTopicBySlug, getRelatedArticles } from "@/data/topics";

export function generateStaticParams() {
  return topicArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getTopicBySlug(slug);
  if (!article) notFound();

  const relatedArticles = getRelatedArticles(article.relatedSlugs);

  // Parse markdown-like content to HTML
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];

    const processInline = (text: string): React.ReactNode => {
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let key = 0;

      while (remaining.length > 0) {
        // Bold
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // Italic
        const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

        let firstMatch: { type: string; index: number; length: number; content: string } | null = null;

        if (boldMatch && boldMatch.index !== undefined) {
          firstMatch = { type: "bold", index: boldMatch.index, length: boldMatch[0].length, content: boldMatch[1] };
        }
        if (italicMatch && italicMatch.index !== undefined) {
          if (!firstMatch || italicMatch.index < firstMatch.index) {
            firstMatch = { type: "italic", index: italicMatch.index, length: italicMatch[0].length, content: italicMatch[1] };
          }
        }

        if (firstMatch) {
          if (firstMatch.index > 0) {
            parts.push(<span key={key++}>{remaining.slice(0, firstMatch.index)}</span>);
          }
          if (firstMatch.type === "bold") {
            parts.push(<strong key={key++}>{firstMatch.content}</strong>);
          } else {
            parts.push(<em key={key++}>{firstMatch.content}</em>);
          }
          remaining = remaining.slice(firstMatch.index + firstMatch.length);
        } else {
          parts.push(<span key={key++}>{remaining}</span>);
          remaining = "";
        }
      }

      return parts.length === 1 ? parts[0] : <>{parts}</>;
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(<ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-2 my-4 text-on-surface-variant leading-relaxed">{listItems}</ul>);
        listItems = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(<h2 key={i} className="text-3xl md:text-4xl font-headline mt-16 mb-6">{processInline(trimmed.slice(3))}</h2>);
      } else if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(<h3 key={i} className="text-2xl md:text-3xl font-headline mt-12 mb-4">{processInline(trimmed.slice(4))}</h3>);
      } else if (trimmed.startsWith("- **")) {
        const match = trimmed.match(/^- \*\*(.+?)\*\*\s*(.*)$/);
        if (match) {
          listItems.push(
            <li key={i} className="leading-relaxed">
              <strong>{match[1]}</strong>
              {match[2] && <span> — {processInline(match[2])}</span>}
            </li>
          );
        }
      } else if (trimmed.startsWith("- ")) {
        listItems.push(<li key={i} className="leading-relaxed">{processInline(trimmed.slice(2))}</li>);
      } else if (trimmed.startsWith("---")) {
        flushList();
        elements.push(<hr key={i} className="border-outline-variant/20 my-12" />);
      } else if (trimmed === "") {
        flushList();
      } else {
        flushList();
        elements.push(<p key={i} className="text-on-surface-variant leading-loose text-lg mb-6">{processInline(trimmed)}</p>);
      }
    });

    flushList();
    return elements;
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover brightness-75"
          sizes="100vw"
          priority
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-16 max-w-4xl mx-auto">
          <span className="tracking-widest uppercase text-[10px] font-bold text-secondary mb-4 block">{article.category}</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline leading-tight text-primary">{article.title}</h1>
        </div>
      </section>

      {/* Article Meta */}
      <section className="px-8 max-w-4xl mx-auto py-12 border-b border-outline-variant/20">
        <div className="flex flex-wrap items-center gap-6 text-sm text-on-surface-variant">
          <div>
            <span className="font-semibold text-primary">{article.author}</span>
            <span className="ml-2 text-secondary">· {article.authorTitle}</span>
          </div>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
        <p className="text-xl md:text-2xl font-light italic text-on-surface-variant mt-8 leading-relaxed">{article.subtitle}</p>
      </section>

      {/* Article Content */}
      <article className="px-8 max-w-4xl mx-auto py-16">
        {renderContent(article.content)}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="px-8 max-w-7xl mx-auto py-20 border-t border-outline-variant/20">
          <h2 className="text-3xl font-headline mb-12">Continue Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((related) => (
              <Link key={related.slug} href={`/topics/${related.slug}`} className="group">
                <div className="aspect-[4/3] overflow-hidden relative mb-4">
                  <Image
                    src={related.image}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="33vw"
                    quality={95}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">{related.category}</span>
                <h3 className="text-lg font-headline mt-2 group-hover:underline">{related.title}</h3>
                <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to Topics */}
      <section className="px-8 max-w-4xl mx-auto py-20 text-center">
        <Link href="/topics" className="inline-flex items-center gap-4 group">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:-translate-x-2 transition-transform"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          <span className="tracking-widest uppercase text-[11px] font-bold border-b border-primary pb-1 group-hover:opacity-60 transition-opacity">Back to Journal</span>
        </Link>
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
