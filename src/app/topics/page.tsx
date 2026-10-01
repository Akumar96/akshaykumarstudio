import type { Metadata } from "next";
import Link from "next/link";
import { topicArticles } from "@/data/topics";
import Photo from "@/components/Photo";
import Arrow from "@/components/Arrow";
export const metadata: Metadata = {
  title: "Studio journal",
  description:
    "Notes on photographs, the places behind them, and preparing for a session. From Akshay Kumar Studios.",
};
export default function Journal() {
  return (
    <div className="shell">
      <header className="page-intro">
        <span className="eyebrow accent">Notes from the studio</span>
        <div className="page-intro-row">
          <h1>
            A closer
            <br />
            <i>look.</i>
          </h1>
          <p>
            A few thoughts on making photographs, spending time outside, and
            keeping the pictures that matter.
          </p>
        </div>
      </header>
      <div className="journal-grid">
        {topicArticles.map((article, index) => (
          <Link
            href={`/topics/${article.slug}`}
            key={article.slug}
            className="journal-card"
          >
            <Photo
              src={article.image}
              alt={article.title}
              sizes="(max-width: 390px) 94vw, (max-width: 1050px) 46vw, 30vw"
              preload={index < 2}
            />
            <span className="eyebrow accent">
              {article.category} · {article.readTime}
            </span>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            <span className="text-link">
              Read the note <Arrow diagonal />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
