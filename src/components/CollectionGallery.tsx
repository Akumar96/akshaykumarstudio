"use client";
import { useState } from "react";
import Photo from "./Photo";
import GalleryLightbox from "./GalleryLightbox";
import manifest from "@/data/photo-manifest.json";
export default function CollectionGallery({
  photos,
  title,
}: {
  photos: string[];
  title: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <>
      <div className="photo-grid">
        {photos.map((src, index) => {
          const dimensions = (
            manifest as Record<string, { width: number; height: number }>
          )[src];
          return (
            <button
              className="gallery-photo"
              key={src}
              onClick={() => setActive(index)}
              aria-label={`Open ${title}, photograph ${index + 1}`}
            >
              <div
                style={{
                  aspectRatio: `${dimensions.width} / ${dimensions.height}`,
                }}
              >
                <Photo
                  src={src}
                  alt={`${title}, photograph ${index + 1}`}
                  className="h-full"
                  sizes="(max-width: 760px) 46vw, 47vw"
                  preload={index === 0}
                />
              </div>
            </button>
          );
        })}
      </div>
      {active !== null && (
        <GalleryLightbox
          title={title}
          photos={photos}
          initialIndex={active}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
