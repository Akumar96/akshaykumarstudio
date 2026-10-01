"use client";

import { useState } from "react";
import Image from "next/image";

export default function FilmPlayer() {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className="film-player">
      {started ? (
        <video
          controls
          autoPlay
          playsInline
          preload="none"
          width={1920}
          height={1080}
          poster="/films/peru-poster.webp"
          aria-label="Peru — a travel film by Akshay Kumar"
          onError={() => setFailed(true)}
        >
          <source src="/films/peru.mp4" type="video/mp4" />
          Your browser does not support this video.{" "}
          <a href="/films/peru.mp4">Open the Peru film.</a>
        </video>
      ) : (
        <button
          className="film-cover"
          onClick={() => setStarted(true)}
          aria-label="Play Peru travel film, 2 minutes 58 seconds"
        >
          <Image
            src="/films/peru-poster.webp"
            alt="The mountain landscape and stone terraces of Machu Picchu, Peru"
            fill
            unoptimized
            loading="eager"
            style={{ objectFit: "cover" }}
          />
          <span className="film-play">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
              <path d="M4 2.5 13 8l-9 5.5z" fill="currentColor" />
            </svg>{" "}
            Play film <span>02:58</span>
          </span>
          <span className="film-title">
            Peru.<span>A travel film by Akshay Kumar</span>
          </span>
        </button>
      )}
      {failed && (
        <p className="film-error" role="alert">
          The video couldn’t load.{" "}
          <a href="/films/peru.mp4">Open the film directly.</a>
        </p>
      )}
    </div>
  );
}
