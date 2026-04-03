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
    coverPhoto: "/photos/nature/DSC01069.jpg",
    photos: [
      "/photos/nature/DSC01069.jpg",
      "/photos/nature/DSC01165-2.jpg",
      "/photos/nature/DSC01206.JPG",
      "/photos/nature/DSC01375-3.jpg",
      "/photos/nature/DSC01520.jpg",
      "/photos/nature/DSC01535.JPG",
      "/photos/nature/DSC01549.JPG",
      "/photos/nature/DSC01643.JPG",
      "/photos/nature/DSC01668.JPG",
      "/photos/nature/DSC01697.JPG",
      "/photos/nature/DSC01972.JPG",
      "/photos/nature/DSC02053.JPG",
      "/photos/nature/DSC02137-3.jpg",
      "/photos/nature/DSC03402.jpg",
      "/photos/nature/DSC03629-2.jpg",
      "/photos/nature/DSC03629.jpg",
      "/photos/nature/DSC03932.JPG",
      "/photos/nature/DSC04271.JPG",
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
    coverPhoto: "/photos/city/DSC01984.JPG",
    photos: [
      "/photos/city/DSC01984.JPG",
      "/photos/city/DSC01989.JPG",
      "/photos/city/DSC01991.JPG",
      "/photos/city/DSC02005.JPG",
      "/photos/city/DSC02205.jpg",
      "/photos/city/DSC03293.JPG",
    ],
  },
  {
    id: "wedding-1",
    title: "Wedding — Coastal",
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
    title: "Wedding — Garden",
    description: "Golden hour and quiet vows.",
    category: "Weddings",
    coverPhoto: "/photos/wedding-2/DSC02059.jpg",
    photos: [
      "/photos/wedding-2/DSC02051.JPG",
      "/photos/wedding-2/DSC02059.jpg",
      "/photos/wedding-2/DSC02061.jpg",
      "/photos/wedding-2/DSC02070.JPG",
    ],
  },
  {
    id: "wedding-3",
    title: "Wedding — Cinema",
    description: "Film stills from the day.",
    category: "Weddings",
    coverPhoto: "/photos/wedding-3/DSC03342.jpg",
    photos: [
      "/photos/wedding-3/C0526.MP4.02_32_04_22.Still003.jpg",
      "/photos/wedding-3/DSC03342.jpg",
      "/photos/wedding-3/DSC03366.jpg",
      "/photos/wedding-3/DSC04583.jpg",
      "/photos/wedding-3/DSC04906.jpg",
      "/photos/wedding-3/DSC05081.jpg",
      "/photos/wedding-3/Sequence 01.00_01_59_13.Still014.jpg",
      "/photos/wedding-3/Sequence 01.00_03_29_02.Still023.jpg",
      "/photos/wedding-3/Sequence 01.00_03_36_01.Still025.jpg",
      "/photos/wedding-3/Sequence 01.00_25_17_09.Still032.jpg",
      "/photos/wedding-3/Sequence 01.00_35_51_25.Still046.jpg",
      "/photos/wedding-3/Sequence 01.00_51_13_02.Still004.jpg",
    ],
  },
  {
    id: "portraits",
    title: "Portraits",
    description: "A study of presence.",
    category: "Portraits",
    coverPhoto: "/photos/portraits/DSC06687.jpg",
    photos: [
      "/photos/portraits/DSC06687.jpg",
      "/photos/portraits/DSC06721.jpg",
      "/photos/portraits/DSC06779.jpg",
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
