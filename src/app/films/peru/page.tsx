import type { Metadata } from "next";
import Link from "next/link";
import FilmPlayer from "@/components/FilmPlayer";
import Arrow from "@/components/Arrow";
export const metadata: Metadata = {
  title: "Peru — Travel film",
  description:
    "A travel film by Akshay Kumar, following the landscapes, journeys and shared experiences of Peru.",
};
export default function PeruFilm() {
  return (
    <div className="shell">
      <header className="page-intro">
        <Link className="eyebrow accent" href="/portfolio">
          ← Selected work / Film
        </Link>
        <div className="page-intro-row">
          <h1>
            Peru.
            <br />
            <i>In motion.</i>
          </h1>
          <p>
            Mountain roads, river journeys and Machu Picchu. A travel film by
            Akshay Kumar.
          </p>
        </div>
      </header>
      <FilmPlayer />
      <div className="image-caption">
        <span>Peru / Travel film</span>
        <span>02:58 · Full HD</span>
      </div>
      <div className="gallery-end">
        <div>
          <span className="eyebrow accent">For your next project</span>
          <h2>A place to bring to life?</h2>
        </div>
        <Link href="/booking" className="text-link">
          Let’s talk <Arrow />
        </Link>
      </div>
    </div>
  );
}
