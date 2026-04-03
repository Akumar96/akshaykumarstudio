"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

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
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % photos.length) + photos.length) % photos.length);
    },
    [photos.length]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 z-10">
        <span className="text-white/60 text-xs tracking-widest uppercase font-medium">
          {title} — {currentIndex + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-2"
          aria-label="Close gallery"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Main image */}
      <div
        className="flex-1 relative flex items-center justify-center px-4 md:px-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center">
          <Image
            src={photos[currentIndex]}
            alt={`${title} photo ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="90vw"
            quality={100}
            priority
          />
        </div>

        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm"
              aria-label="Previous photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm"
              aria-label="Next photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div
          className="flex gap-2 px-6 py-4 overflow-x-auto justify-center z-10 scrollbar-thin"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 overflow-hidden transition-all ${
                idx === currentIndex
                  ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-105"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              <Image
                src={photo}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                quality={95}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
