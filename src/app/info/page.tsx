import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import Arrow from "@/components/Arrow";
import ClientJourney from "@/components/ClientJourney";
export const metadata: Metadata = {
  title: "Commercial, real estate & hotel photography",
  description:
    "Photography and film for commercial interiors, real estate and hotels. Plan your project with Akshay Kumar Studios in Halifax.",
};
const services = [
  {
    id: "01",
    name: "Commercial spaces",
    description:
      "For designers, businesses and the spaces they create. A clear view of the whole, with attention to the materials and details.",
    items: [
      "Offices, retail & workspaces",
      "Interior design & architectural details",
      "Images for websites, portfolios & campaigns",
    ],
  },
  {
    id: "02",
    name: "Real estate",
    description:
      "Help a prospective buyer understand the property: the layout, the natural light and how the rooms connect.",
    items: [
      "Residential & commercial properties",
      "Interiors, exteriors & surrounding context",
      "Listing photography & property films",
    ],
  },
  {
    id: "03",
    name: "Hotels & stays",
    description:
      "Show what it feels like to arrive, settle in and spend time there. From the room itself to the spaces guests share.",
    items: [
      "Guest rooms, suites & common areas",
      "Dining, amenities & design details",
      "Photography & film for hospitality websites",
    ],
  },
];
const faqs = [
  [
    "What do you need for a quote?",
    "The property location, approximate size or number of rooms, your preferred date and where the images will be used. A floor plan or a few reference photos are helpful if you have them.",
  ],
  [
    "How should we prepare the space?",
    "We’ll agree on a shot list beforehand. Plan to clean and stage the areas being photographed, remove temporary signs and clutter, and arrange access to each room. For hotels, we can discuss a schedule around guests and housekeeping.",
  ],
  [
    "Can we combine photography and video?",
    "Yes. Tell me which photographs and film formats you need. We’ll plan the coverage together, including any vertical or horizontal versions for different channels.",
  ],
  [
    "What about delivery and usage?",
    "Your quote will set out the number and format of deliverables, the delivery date and the agreed usage. Let me know about listing deadlines, launch dates, advertising or third-party use at the start.",
  ],
  [
    "Do you work outside Halifax?",
    "Yes, travel enquiries are welcome. Include the location and schedule so travel can be factored into the proposal.",
  ],
];
export default function Info() {
  return (
    <>
      <div className="shell">
        <header className="page-intro">
          <span className="eyebrow accent">Working together</span>
          <div className="page-intro-row">
            <h1>
              Your space.
              <br />
              <i>Seen properly.</i>
            </h1>
            <p>
              Photography and film for commercial spaces, real estate and
              hospitality. Planned around the property and what you need to
              show.
            </p>
          </div>
        </header>
        <section className="service-feature">
          <Photo
            src="/photos/nature/DSC03629.webp"
            alt="Architecture and rooftops viewed through an arch"
            sizes="(max-width: 760px) 94vw, 46vw"
            preload
            unoptimized
          />
          <div>
            <span className="eyebrow accent">
              A clear brief. A considered approach.
            </span>
            <h2>
              Start with the space.
              <br />
              Then find its story.
            </h2>
            <p>
              The best starting point is a conversation about the property, the
              audience and where the images will appear. From there, we’ll agree
              on the shot list, schedule and deliverables.
            </p>
            <Link className="text-link" href="/booking">
              Discuss your project <Arrow diagonal />
            </Link>
          </div>
        </section>
        <section className="pricing">
          <div className="section-heading">
            <div>
              <span className="eyebrow accent">Areas of focus</span>
              <h2>Three ways to work together.</h2>
            </div>
            <span className="eyebrow">Quoted to your brief</span>
          </div>
          {services.map((service) => (
            <div
              className="commercial-service"
              id={service.id}
              key={service.id}
            >
              <span className="eyebrow accent">{service.id}</span>
              <div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                href="/booking"
                aria-label={`Enquire about ${service.name}`}
              >
                <Arrow diagonal />
              </Link>
            </div>
          ))}
          <p className="contact-prompt">
            Every property is different. Pricing follows the size of the space,
            production needs, deliverables and usage.{" "}
            <Link className="underline underline-offset-4" href="/booking">
              Request a project quote.
            </Link>
          </p>
        </section>
        <ClientJourney />
      </div>
      <section className="faq-section">
        <div className="shell faq-layout">
          <div>
            <span className="eyebrow accent">Before the shoot</span>
            <h2>
              A few practical
              <br />
              <i>questions.</i>
            </h2>
          </div>
          <div>
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
