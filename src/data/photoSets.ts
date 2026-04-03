export interface PhotoSet {
  id: string;
  title: string;
  description: string;
  category: string;
  coverPhoto: string;
  photos: string[];
}

export const photoSets: PhotoSet[] = [
  {
    id: "nature",
    title: "Nature & Landscape",
    description: "The quiet permanence of Atlantic light.",
    category: "Nature",
    coverPhoto: "/photos/nature/DSC01206.JPG",
    photos: [
      "/photos/nature/DSC01165-2.jpg",
      "/photos/nature/DSC01206.JPG",
      "/photos/nature/DSC01375-3.jpg",
      "/photos/nature/DSC01520.jpg",
      "/photos/nature/DSC01535.JPG",
      "/photos/nature/DSC01643.JPG",
      "/photos/nature/DSC01668.JPG",
      "/photos/nature/DSC01697.JPG",
      "/photos/nature/DSC02053.JPG",
      "/photos/nature/DSC02137-3.jpg",
      "/photos/nature/DSC03402.jpg",
      "/photos/nature/DSC03629.jpg",
    ],
  },
  {
    id: "family",
    title: "Family",
    description: "Intimate moments, preserved.",
    category: "Family",
    coverPhoto: "/photos/family/DSC08614.jpg",
    photos: [
      "/photos/family/DSC08614.jpg",
      "/photos/family/DSC08969.jpg",
      "/photos/family/DSC09877.jpg",
      "/photos/family/DSC09884.jpg",
    ],
  },
  {
    id: "city",
    title: "City",
    description: "Urban geometry and atmosphere.",
    category: "City",
    coverPhoto: "https://i.ibb.co/pjw5X7Kz/DSC03293.jpg",
    photos: [
      "https://i.ibb.co/YF5MBFjS/DSC01991.jpg",
      "https://i.ibb.co/rGRjNRF0/DSC02005.jpg",
      "https://i.ibb.co/pjw5X7Kz/DSC03293.jpg",
    ],
  },
  {
    id: "wedding-1",
    title: "Wedding — Desi",
    description: "Love against the wild coastline.",
    category: "Weddings",
    coverPhoto: "/photos/wedding-1/DSC05542.jpg",
    photos: [
      "/photos/wedding-1/DSC05542.jpg",
      "/photos/wedding-1/DSC05582.jpg",
      "/photos/wedding-1/DSC05602.jpg",
      "/photos/wedding-1/DSC05790.jpg",
      "/photos/wedding-1/DSC05913.JPG",
      "/photos/wedding-1/DSC05940.JPG",
    ],
  },
  {
    id: "wedding-2",
    title: "Wedding — Coastal",
    description: "Golden hour and quiet vows.",
    category: "Weddings",
    coverPhoto: "/photos/wedding-2/DSC02059.jpg",
    photos: [
      "/photos/wedding-2/DSC02051.JPG",
      "/photos/wedding-2/DSC02070.JPG",
    ],
  },
  {
    id: "events",
    title: "Events",
    description: "Documenting the gathering.",
    category: "Events",
    coverPhoto: "/photos/events/DSC02757.JPG",
    photos: [
      "/photos/events/DSC02757.JPG",
      "/photos/events/DSC02885.JPG",
    ],
  },
];
