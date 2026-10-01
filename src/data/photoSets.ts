export interface PhotoSet {
  id: string;
  title: string;
  description: string;
  category: string;
  coverPhoto: string;
  photos: string[];
}

const archiveSets: PhotoSet[] = [
  {
    id: "wedding-1",
    title: "A celebration, in full colour",
    description:
      "Golden light, a full dance floor, and everyone you came to celebrate with.",
    category: "Weddings",
    coverPhoto: "/photos/wedding-1/DSC05790.webp",
    photos: [
      "/photos/wedding-1/DSC05790.webp",
      "/photos/wedding-1/DSC05542.webp",
      "/photos/wedding-1/DSC05582.webp",
      "/photos/wedding-1/DSC05602.webp",
      "/photos/wedding-1/DSC05913.webp",
      "/photos/wedding-1/DSC05940.webp",
    ],
  },
  {
    id: "wedding-3",
    title: "In good company",
    description: "A wedding day told through the people who made it theirs.",
    category: "Weddings",
    coverPhoto: "/photos/wedding-3/Sequence 01.00_03_36_01.Still025.webp",
    photos: [
      "/photos/wedding-3/Sequence 01.00_03_36_01.Still025.webp",
      "/photos/wedding-3/C0526.MP4.02_32_04_22.Still003.webp",
      "/photos/wedding-3/DSC03342.webp",
      "/photos/wedding-3/DSC03366.webp",
      "/photos/wedding-3/DSC04583.webp",
      "/photos/wedding-3/DSC04906.webp",
      "/photos/wedding-3/DSC05081.webp",
      "/photos/wedding-3/Sequence 01.00_01_59_13.Still014.webp",
      "/photos/wedding-3/Sequence 01.00_03_29_02.Still023.webp",
      "/photos/wedding-3/Sequence 01.00_25_17_09.Still032.webp",
      "/photos/wedding-3/Sequence 01.00_35_51_25.Still046.webp",
      "/photos/wedding-3/Sequence 01.00_51_13_02.Still004.webp",
    ],
  },
  {
    id: "wedding-2",
    title: "Away together",
    description:
      "An afternoon by the sea. A little sun, a little salt, and time for two.",
    category: "Couples",
    coverPhoto: "/photos/wedding-2/DSC02061.webp",
    photos: [
      "/photos/wedding-2/DSC02061.webp",
      "/photos/wedding-2/DSC02051.webp",
      "/photos/wedding-2/DSC02059.webp",
      "/photos/wedding-2/DSC02070.webp",
    ],
  },
  {
    id: "family",
    title: "Our people",
    description:
      "The whole family, the small gestures, and the things that connect us.",
    category: "Family",
    coverPhoto: "/photos/family/DSC08614.webp",
    photos: [
      "/photos/family/DSC08614.webp",
      "/photos/family/DSC08969.webp",
      "/photos/family/DSC09877.webp",
      "/photos/family/DSC09884.webp",
    ],
  },
  {
    id: "nature",
    title: "The long way home",
    description: "Coastlines, quiet roads, and a reason to stop along the way.",
    category: "Land & sea",
    coverPhoto: "/photos/nature/DSC01520.webp",
    photos: [
      "/photos/nature/DSC01520.webp",
      "/photos/nature/DSC01069.webp",
      "/photos/nature/DSC01165-2.webp",
      "/photos/nature/DSC01206.webp",
      "/photos/nature/DSC01375-3.webp",
      "/photos/nature/DSC01535.webp",
      "/photos/nature/DSC01549.webp",
      "/photos/nature/DSC01643.webp",
      "/photos/nature/DSC01668.webp",
      "/photos/nature/DSC01697.webp",
      "/photos/nature/DSC01972.webp",
      "/photos/nature/DSC02053.webp",
      "/photos/nature/DSC02137-3.webp",
      "/photos/nature/DSC03402.webp",
      "/photos/nature/DSC03629-2.webp",
      "/photos/nature/DSC03629.webp",
      "/photos/nature/DSC03932.webp",
      "/photos/nature/DSC04271.webp",
    ],
  },
  {
    id: "portraits",
    title: "A moment to yourself",
    description:
      "People, as they are. Portraits made in the light of an ordinary day.",
    category: "Portraits",
    coverPhoto: "/photos/portraits/DSC06687.webp",
    photos: [
      "/photos/portraits/DSC06687.webp",
      "/photos/portraits/DSC06721.webp",
      "/photos/portraits/DSC06779.webp",
    ],
  },
  {
    id: "city",
    title: "On the street",
    description: "Colour, corners, and the rhythm of a city on foot.",
    category: "City",
    coverPhoto: "/photos/city/DSC03293.webp",
    photos: [
      "/photos/city/DSC03293.webp",
      "/photos/city/DSC01984.webp",
      "/photos/city/DSC01989.webp",
      "/photos/city/DSC01991.webp",
      "/photos/city/DSC02005.webp",
      "/photos/city/DSC02205.webp",
    ],
  },
  {
    id: "events",
    title: "After the lights go down",
    description: "The stage, the crowd, and the energy between them.",
    category: "Events",
    coverPhoto: "/photos/events/DSC02757.webp",
    photos: ["/photos/events/DSC02757.webp", "/photos/events/DSC02885.webp"],
  },
];

const collectionOrder = [
  "city",
  "nature",
  "wedding-1",
  "wedding-3",
  "wedding-2",
  "family",
  "portraits",
  "events",
];
export const photoSets = collectionOrder.map(
  (id) => archiveSets.find((set) => set.id === id)!,
);

export function getPhotoSet(id: string) {
  return photoSets.find((set) => set.id === id);
}
