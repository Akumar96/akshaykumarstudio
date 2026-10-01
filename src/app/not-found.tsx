import Link from "next/link";
import Arrow from "@/components/Arrow";
export default function NotFound() {
  return (
    <section className="shell not-found">
      <span className="eyebrow accent">404 / Out of frame</span>
      <h1>
        This page has
        <br />
        <i>wandered off.</i>
      </h1>
      <p>There are still plenty of photographs to look through.</p>
      <Link href="/portfolio" className="text-link">
        Back to the work <Arrow />
      </Link>
    </section>
  );
}
