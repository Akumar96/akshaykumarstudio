import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { photoSets, getPhotoSet } from "@/data/photoSets";
import CollectionGallery from "@/components/CollectionGallery";
import Arrow from "@/components/Arrow";
export function generateStaticParams() {
  return photoSets.map((set) => ({ slug: set.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const set = getPhotoSet((await params).slug);
  return {
    title: set?.title || "Collection not found",
    description: set?.description,
  };
}
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const set = getPhotoSet((await params).slug);
  if (!set) notFound();
  const next = photoSets[(photoSets.indexOf(set) + 1) % photoSets.length];
  return (
    <div className="shell">
      <header className="page-intro collection-title">
        <Link href="/portfolio" className="eyebrow accent">
          ← All work / {set.category}
        </Link>
        <h1>{set.title}</h1>
        <p className="collection-description">{set.description}</p>
      </header>
      <div className="collection-toolbar">
        <span>{String(set.photos.length).padStart(2, "0")} photographs</span>
        <span>Select a photograph to take a closer look ↗</span>
      </div>
      <CollectionGallery photos={set.photos} title={set.title} />
      <div className="gallery-end">
        <div>
          <span className="eyebrow accent">Next collection</span>
          <h2>{next.title}</h2>
        </div>
        <Link className="text-link" href={`/portfolio/${next.id}`}>
          Keep looking <Arrow />
        </Link>
      </div>
    </div>
  );
}
