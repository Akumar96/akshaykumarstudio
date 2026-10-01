"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import manifest from "@/data/photo-manifest.json";
interface GalleryLightboxProps {
  photos: string[];
  title: string;
  initialIndex?: number;
  onClose: () => void;
}
export default function GalleryLightbox({
  photos,
  title,
  initialIndex = 0,
  onClose,
}: GalleryLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const dialog = useRef<HTMLDialogElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const step = (amount: number) =>
    setIndex((current) => (current + amount + photos.length) % photos.length);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  useEffect(() => {
    thumbs.current
      ?.querySelector('[aria-current="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [index]);
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label={`${title} photo viewer`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      <div className="lightbox-inner">
        <div className="lightbox-top">
          <p>
            {title}{" "}
            <span aria-live="polite">
              — {index + 1} / {photos.length}
            </span>
          </p>
          <button
            autoFocus
            className="lightbox-close"
            onClick={onClose}
            aria-label="Close gallery"
          >
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div
          className="lightbox-stage"
          onTouchStart={(event) => {
            touchStart.current = event.changedTouches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current !== null) {
              const delta =
                touchStart.current - event.changedTouches[0].clientX;
              if (Math.abs(delta) > 50) step(delta > 0 ? 1 : -1);
            }
            touchStart.current = null;
          }}
        >
          <button onClick={() => step(-1)} aria-label="Previous photo">
            ‹
          </button>
          <div className="lightbox-image">
            <Image
              key={photos[index]}
              src={photos[index]}
              alt={
                (manifest as Record<string, { alt: string }>)[photos[index]]
                  ?.alt ||
                `${title}, photograph ${index + 1} of ${photos.length}`
              }
              fill
              sizes="(max-width: 760px) 85vw, 90vw"
              quality={85}
              loading="eager"
            />
          </div>
          <button onClick={() => step(1)} aria-label="Next photo">
            ›
          </button>
        </div>
        <div className="lightbox-bottom">
          <div className="lightbox-thumbs" ref={thumbs}>
            {photos.map((photo, i) => (
              <button
                key={photo}
                onClick={() => setIndex(i)}
                aria-label={`View photograph ${i + 1}`}
                aria-current={index === i ? "true" : undefined}
              >
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="64px"
                  quality={75}
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
          <p>Use the arrow keys or swipe to explore. Escape to close.</p>
        </div>
      </div>
    </dialog>
  );
}
