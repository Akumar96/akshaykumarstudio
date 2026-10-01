import Image from "next/image";
import manifest from "@/data/photo-manifest.json";

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
  position?: string;
  unoptimized?: boolean;
};
export default function Photo({
  src,
  alt,
  className = "",
  sizes = "(max-width: 700px) 100vw, 50vw",
  preload = false,
  position,
  unoptimized = false,
}: PhotoProps) {
  const data = (
    manifest as Record<string, { blurDataURL: string; alt?: string }>
  )[src];
  return (
    <div className={`photo ${className}`}>
      <Image
        src={src}
        alt={data?.alt || alt}
        fill
        sizes={sizes}
        loading={preload ? "eager" : "lazy"}
        fetchPriority={preload ? "high" : undefined}
        quality={80}
        unoptimized={unoptimized}
        placeholder={data && !unoptimized ? "blur" : "empty"}
        blurDataURL={data?.blurDataURL}
        style={{ objectFit: "cover", objectPosition: position }}
      />
    </div>
  );
}
