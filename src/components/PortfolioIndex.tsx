"use client";
import { useState } from "react";
import Link from "next/link";
import { photoSets } from "@/data/photoSets";
import Photo from "./Photo";
import Arrow from "./Arrow";
const categories = [
  "All work",
  ...new Set(photoSets.map((set) => set.category)),
];
export default function PortfolioIndex() {
  const [active, setActive] = useState("All work");
  const filtered =
    active === "All work"
      ? photoSets
      : photoSets.filter((set) => set.category === active);
  return (
    <>
      <div
        className="portfolio-filters"
        aria-label="Filter photography collections"
      >
        {categories.map((category) => (
          <button
            key={category}
            aria-pressed={active === category}
            onClick={() => setActive(category)}
          >
            {category}
            <sup>
              {category === "All work"
                ? photoSets.length
                : photoSets.filter((set) => set.category === category).length}
            </sup>
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        Showing {filtered.length}{" "}
        {filtered.length === 1 ? "collection" : "collections"}
      </p>
      <div className="collection-grid">
        {filtered.map((set, index) => (
          <Link
            className="collection-card"
            href={`/portfolio/${set.id}`}
            key={set.id}
          >
            <Photo
              src={set.coverPhoto}
              alt={set.title}
              sizes="(max-width: 760px) 94vw, 46vw"
              preload={index < 2}
            />
            <div className="collection-meta">
              <div>
                <span className="eyebrow accent">{set.category}</span>
                <h2>{set.title}</h2>
                <p>{set.description}</p>
              </div>
              <span>
                {String(set.photos.length).padStart(2, "0")} photographs{" "}
                <Arrow diagonal />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
