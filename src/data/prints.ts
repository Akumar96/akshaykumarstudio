export interface PrintProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  sizes: PrintSize[];
}

export interface PrintSize {
  label: string;
  dimensions: string;
  price: number; // in cents
  stripePriceId: string; // Stripe Price ID — fill after creating in Stripe Dashboard
}

export const prints: PrintProduct[] = [
  {
    id: "coastal-dawn",
    title: "Coastal Dawn",
    description: "First light breaking over the Atlantic off Peggy's Cove. Shot on Portra 400, 35mm.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    category: "Seascape",
    sizes: [
      { label: "Small", dimensions: '8" × 12"', price: 4500, stripePriceId: "price_small_coastal_dawn" },
      { label: "Medium", dimensions: '16" × 24"', price: 8500, stripePriceId: "price_medium_coastal_dawn" },
      { label: "Large", dimensions: '24" × 36"', price: 14000, stripePriceId: "price_large_coastal_dawn" },
    ],
  },
  {
    id: "halifax-harbour",
    title: "Halifax Harbour at Dusk",
    description: "The harbour settling into evening calm. Digital, edited for warmth and depth.",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    category: "Urban Landscape",
    sizes: [
      { label: "Small", dimensions: '8" × 12"', price: 4500, stripePriceId: "price_small_halifax_harbour" },
      { label: "Medium", dimensions: '16" × 24"', price: 8500, stripePriceId: "price_medium_halifax_harbour" },
      { label: "Large", dimensions: '24" × 36"', price: 14000, stripePriceId: "price_large_halifax_harbour" },
    ],
  },
  {
    id: "lighthouse-keeper",
    title: "The Lighthouse Keeper",
    description: "A solitary figure at Sambro Island Light. 35mm film, natural light only.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    category: "Portrait",
    sizes: [
      { label: "Small", dimensions: '8" × 12"', price: 5000, stripePriceId: "price_small_lighthouse_keeper" },
      { label: "Medium", dimensions: '16" × 24"', price: 9500, stripePriceId: "price_medium_lighthouse_keeper" },
      { label: "Large", dimensions: '24" × 36"', price: 15000, stripePriceId: "price_large_lighthouse_keeper" },
    ],
  },
  {
    id: "fog-bank",
    title: "Fog Bank, Bay of Fundy",
    description: "Dense fog rolling across the bay at dawn. Portra 400, pushed one stop.",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    category: "Seascape",
    sizes: [
      { label: "Small", dimensions: '8" × 12"', price: 4500, stripePriceId: "price_small_fog_bank" },
      { label: "Medium", dimensions: '16" × 24"', price: 8500, stripePriceId: "price_medium_fog_bank" },
      { label: "Large", dimensions: '24" × 36"', price: 14000, stripePriceId: "price_large_fog_bank" },
    ],
  },
  {
    id: "weathered-wood",
    title: "Weathered Wood",
    description: "Detail of a fishing boat hull in Lunenburg. Texture study, 35mm.",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    category: "Detail",
    sizes: [
      { label: "Small", dimensions: '8" × 12"', price: 4000, stripePriceId: "price_small_weathered_wood" },
      { label: "Medium", dimensions: '16" × 24"', price: 7500, stripePriceId: "price_medium_weathered_wood" },
      { label: "Large", dimensions: '24" × 36"', price: 12000, stripePriceId: "price_large_weathered_wood" },
    ],
  },
  {
    id: "silver-storm",
    title: "Silver Storm",
    description: "Storm light over the North Atlantic. Black and white, Ilford HP5.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    category: "Seascape",
    sizes: [
      { label: "Small", dimensions: '8" × 12"', price: 5000, stripePriceId: "price_small_silver_storm" },
      { label: "Medium", dimensions: '16" × 24"', price: 9500, stripePriceId: "price_medium_silver_storm" },
      { label: "Large", dimensions: '24" × 36"', price: 15000, stripePriceId: "price_large_silver_storm" },
    ],
  },
];

export function getPrintById(id: string): PrintProduct | undefined {
  return prints.find((p) => p.id === id);
}

export function getAllCategories(): string[] {
  return [...new Set(prints.map((p) => p.category))];
}
