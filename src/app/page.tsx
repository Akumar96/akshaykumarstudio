import Link from "next/link";
import Photo from "@/components/Photo";
import Arrow from "@/components/Arrow";
import FilmPlayer from "@/components/FilmPlayer";

export default function Home() {
  return (
    <>
      <section className="home-intro shell">
        <div className="intro-meta eyebrow">
          <span>Commercial spaces · Real estate · Hotels</span>
          <span>Halifax, NS · Available for travel</span>
        </div>
        <div className="home-heading">
          <h1>
            A sense
            <br />
            <i>of place.</i>
          </h1>
          <div className="home-intro-note">
            <span className="red-tick" aria-hidden="true" />
            <p>
              Photography and film for places worth stepping into. From the
              shape of a room to the atmosphere of a whole destination.
            </p>
            <Link className="text-link" href="/booking">
              Tell me about your space <Arrow diagonal />
            </Link>
          </div>
        </div>
        <FilmPlayer />
        <div className="image-caption">
          <span>Featured film / Peru</span>
          <span>Travel, landscape & the experience of a place</span>
        </div>
      </section>
      <section className="shell services-preview section-space">
        <span className="eyebrow accent">Photography for your space</span>
        <div className="service-links">
          {[
            {
              title: "Commercial spaces",
              text: "Interiors, workspaces, retail and design.",
              number: "01",
            },
            {
              title: "Real estate",
              text: "Homes, architecture and property listings.",
              number: "02",
            },
            {
              title: "Hotels & stays",
              text: "Rooms, shared spaces and the guest experience.",
              number: "03",
            },
          ].map((item) => (
            <Link href={`/info#${item.number}`} key={item.number}>
              <span className="eyebrow">{item.number}</span>
              <h3>{item.title}</h3>
              <span className="service-description">{item.text}</span>
              <Arrow diagonal />
            </Link>
          ))}
        </div>
      </section>
      <section className="studio-note">
        <div className="shell studio-note-inner">
          <span className="eyebrow">A considered view</span>
          <div>
            <h2>
              The light. The materials.
              <br />
              The way a space opens up.
              <br />
              <i>The reason to be there.</i>
            </h2>
            <div className="studio-note-copy">
              <p>
                I’m Akshay, a photographer and filmmaker based in Halifax. My
                focus is commercial spaces, real estate and hotels: photographs
                that help someone understand a place before they arrive.
              </p>
              <p>
                We’ll plan around your space, its light, and where the images
                need to work—from a property listing to a hotel website or a
                design portfolio.
              </p>
              <Link className="text-link" href="/info">
                How we can work together <Arrow diagonal />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="selected-work shell section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow accent">
              From the photographic archive
            </span>
            <h2>Places that hold your attention.</h2>
          </div>
          <Link className="text-link" href="/portfolio">
            Explore the archive <Arrow />
          </Link>
        </div>
        <div className="editorial-grid">
          <Link href="/portfolio/city" className="editorial-card">
            <Photo
              src="/photos/city/DSC03293.webp"
              alt="A colourful street framed by buildings"
              className="landscape"
              sizes="(max-width: 760px) 94vw, 58vw"
              unoptimized
            />
            <div className="work-caption">
              <h3>On the street</h3>
              <span>
                City & surroundings <Arrow diagonal />
              </span>
            </div>
          </Link>
          <Link
            href="/portfolio/nature"
            className="editorial-card editorial-card-offset"
          >
            <Photo
              src="/photos/nature/DSC03629.webp"
              alt="Rooftops framed by an arch at sunset"
              className="portrait"
              sizes="(max-width: 760px) 46vw, 34vw"
              unoptimized
            />
            <div className="work-caption">
              <h3>A different perspective</h3>
              <span>
                Travel & landscape <Arrow diagonal />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
