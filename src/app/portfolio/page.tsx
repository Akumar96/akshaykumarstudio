import type { Metadata } from "next";
import Link from "next/link";
import Arrow from "@/components/Arrow";
import PortfolioIndex from "@/components/PortfolioIndex";
export const metadata: Metadata = {
  title: "Selected work",
  description:
    "Travel film, city and landscape photography, and the wider photographic archive of Akshay Kumar.",
};
export default function Portfolio() {
  return (
    <div className="shell">
      <header className="page-intro">
        <span className="eyebrow accent">Photography & film</span>
        <div className="page-intro-row">
          <h1>
            A place,
            <br />
            <i>well seen.</i>
          </h1>
          <p>
            Travel, surroundings and a sense of place.
            <br />
            Selected photography and film, alongside the wider archive.
          </p>
        </div>
      </header>
      <Link href="/films/peru" className="film-portfolio-link">
        <strong>Peru — in motion</strong>
        <span>Travel film · 02:58</span>
        <Arrow diagonal />
      </Link>
      <PortfolioIndex />
    </div>
  );
}
