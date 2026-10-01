import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  topicArticles,
  getTopicBySlug,
  getRelatedArticles,
} from "@/data/topics";
import Photo from "@/components/Photo";
import Arrow from "@/components/Arrow";
export function generateStaticParams() {
  return topicArticles.map((article) => ({ slug: article.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = getTopicBySlug((await params).slug);
  return {
    title: article?.title || "Article not found",
    description: article?.excerpt,
  };
}
function Content({ content }: { content: string }) {
  return content
    .trim()
    .split(/\n\s*\n/)
    .map((block, index) => {
      if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
      if (block.startsWith("### "))
        return <h3 key={index}>{block.slice(4)}</h3>;
      if (block.startsWith("- "))
        return (
          <ul key={index}>
            {block.split("\n").map((line, i) => (
              <li key={i}>{line.replace(/^- /, "")}</li>
            ))}
          </ul>
        );
      return <p key={index}>{block}</p>;
    });
}
export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = getTopicBySlug((await params).slug);
  if (!article) notFound();
  const related = getRelatedArticles(article.relatedSlugs).slice(0, 3);
  return (
    <div className="shell">
      <header className="article-header">
        <Link className="eyebrow accent" href="/topics">
          ← The journal / {article.category}
        </Link>
        <h1>{article.title}</h1>
        <p>{article.subtitle}</p>
        <div className="article-meta">
          {article.author} · {article.readTime}
        </div>
      </header>
      <Photo
        src={article.image}
        alt={article.title}
        className="article-hero"
        sizes="94vw"
        preload
      />
      <article className="article-body">
        <Content content={article.content} />
        <Link href="/topics" className="text-link">
          Back to the journal <Arrow />
        </Link>
      </article>
      {related.length > 0 && (
        <section>
          <div className="section-heading">
            <div>
              <span className="eyebrow accent">
                One thought leads to another
              </span>
              <h2>Keep reading.</h2>
            </div>
          </div>
          <div className="journal-grid">
            {related.map((item) => (
              <Link
                className="journal-card"
                href={`/topics/${item.slug}`}
                key={item.slug}
              >
                <Photo
                  src={item.image}
                  alt={item.title}
                  sizes="(max-width: 760px) 46vw, 30vw"
                />
                <span className="eyebrow accent">{item.category}</span>
                <h2>{item.title}</h2>
                <span className="text-link">
                  Read the note <Arrow diagonal />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
