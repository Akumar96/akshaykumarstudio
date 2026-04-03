"use client";

import { useState } from "react";
import Image from "next/image";
import { prints, type PrintProduct, type PrintSize } from "@/data/prints";

export default function ShopPage() {
  const [selectedPrint, setSelectedPrint] = useState<PrintProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<PrintSize | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (!selectedPrint || !selectedSize) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          printId: selectedPrint.id,
          priceId: selectedSize.stripePriceId,
          size: selectedSize.label,
          dimensions: selectedSize.dimensions,
          price: selectedSize.price,
        }),
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      // Fallback: open Stripe Payment Link directly
      // Replace with your actual Stripe Payment Link URL
      window.open(`https://buy.stripe.com/YOUR_LINK`, "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="tracking-widest uppercase text-[11px] font-bold text-secondary mb-6">
            Fine Art Prints
          </p>
          <h1 className="text-5xl md:text-7xl serif leading-tight mb-6">
            Museum-Quality <span className="italic text-secondary">Prints</span>
          </h1>
          <p className="text-on-surface-variant font-light text-lg max-w-xl mx-auto leading-relaxed">
            Archival pigment prints on Hahnemühle paper. Each print is signed,
            numbered, and shipped worldwide in protective packaging.
          </p>
        </div>
      </section>

      {/* Print Grid */}
      <section className="px-8 pb-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {prints.map((print) => (
              <PrintCard
                key={print.id}
                print={print}
                onSelect={(p) => {
                  setSelectedPrint(p);
                  setSelectedSize(p.sizes[1]); // default to medium
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Size / Purchase Modal */}
      {selectedPrint && selectedSize && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => {
            setSelectedPrint(null);
            setSelectedSize(null);
          }}
        >
          <div
            className="bg-surface max-w-lg w-full rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={selectedPrint.image}
                alt={selectedPrint.title}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>

            <div className="p-8">
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">
                {selectedPrint.category}
              </p>
              <h3 className="text-2xl serif mb-2">{selectedPrint.title}</h3>
              <p className="text-on-surface-variant font-light text-sm mb-6">
                {selectedPrint.description}
              </p>

              {/* Size Selector */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-3">
                  Size
                </p>
                <div className="flex gap-3">
                  {selectedPrint.sizes.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-3 text-center text-[11px] tracking-widest uppercase border transition-colors ${
                        selectedSize.label === size.label
                          ? "border-primary bg-primary text-on-primary"
                          : "border-outline-variant hover:border-primary"
                      }`}
                    >
                      {size.label}
                      <span className="block text-[9px] tracking-normal normal-case mt-0.5 opacity-60">
                        {size.dimensions}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price + Buy */}
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                <div>
                  <p className="text-2xl serif">
                    ${(selectedSize.price / 100).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-secondary tracking-wide">
                    Free worldwide shipping
                  </p>
                </div>
                <button
                  onClick={handleBuy}
                  disabled={loading}
                  className="bg-primary text-on-primary px-10 py-3 tracking-widest uppercase text-[11px] font-medium hover:opacity-70 transition-opacity disabled:opacity-40 active:scale-[0.98]"
                >
                  {loading ? "Loading..." : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Details */}
      <section className="bg-surface-container-low py-24 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl serif mb-8">Print Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">
                Paper
              </p>
              <p className="text-on-surface-variant font-light text-sm leading-relaxed">
                Hahnemühle Photo Rag 308gsm — 100% cotton, acid-free, archival
                quality rated for 100+ years.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">
                Ink
              </p>
              <p className="text-on-surface-variant font-light text-sm leading-relaxed">
                12-colour pigment ink (Epson UltraChrome) for museum-grade
                colour accuracy and fade resistance.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">
                Shipping
              </p>
              <p className="text-on-surface-variant font-light text-sm leading-relaxed">
                Rolled in archival tubes for large prints, flat-packed for
                smaller sizes. Free worldwide delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PrintCard({
  print,
  onSelect,
}: {
  print: PrintProduct;
  onSelect: (print: PrintProduct) => void;
}) {
  return (
    <div className="group cursor-pointer" onClick={() => onSelect(print)}>
      <div className="relative aspect-[4/5] overflow-hidden mb-5">
        <Image
          src={print.image}
          alt={print.title}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1.5">
        {print.category}
      </p>
      <h3 className="text-xl serif mb-1.5 group-hover:opacity-70 transition-opacity">
        {print.title}
      </h3>
      <p className="text-on-surface-variant font-light text-sm line-clamp-2 mb-3">
        {print.description}
      </p>
      <p className="text-[11px] tracking-widest uppercase border-b border-primary pb-1 inline-block group-hover:opacity-60 transition-opacity">
        From ${(print.sizes[0].price / 100).toFixed(2)}
      </p>
    </div>
  );
}
