import type { Metadata } from "next";
import Photo from "@/components/Photo";
import Arrow from "@/components/Arrow";
export const metadata: Metadata = {
  title: "Let’s talk",
  description:
    "Enquire about commercial, real estate and hotel photography or video. Contact Akshay Kumar Studios in Halifax.",
};
const email =
  "mailto:a.kumar.uwo@gmail.com?subject=Property%20photography%20enquiry&body=Hi%20Akshay%2C%0A%0AProject%20type%3A%20%0AProperty%20location%3A%20%0ASize%20or%20number%20of%20rooms%3A%20%0APreferred%20date%3A%20%0APhoto%20or%20video%3A%20%0AIntended%20use%3A%20%0ADeadline%3A%20";
export default function Booking() {
  return (
    <div className="shell">
      <header className="page-intro">
        <span className="eyebrow accent">Let’s make a plan</span>
        <div className="page-intro-row">
          <h1>
            It starts with
            <br />
            <i>a hello.</i>
          </h1>
          <p>
            A property to list, a hotel to introduce, or a space you’ve put a
            lot into. Let’s give it the right photographs.
          </p>
        </div>
      </header>
      <section className="contact-grid">
        <Photo
          src="/photos/city/DSC03293.webp"
          alt="Colourful buildings along a narrow street"
          className="contact-image"
          sizes="(max-width: 760px) 94vw, 46vw"
          preload
          unoptimized
        />
        <div className="contact-options">
          <span className="eyebrow accent">A direct line to Akshay</span>
          <h2>Tell me about your space.</h2>
          <p>
            Start with the property location, size, preferred date and how
            you’ll use the images. Include any listing or launch deadline, and
            whether you need photography, video, or both.
          </p>
          <a className="contact-email" href={email}>
            a.kumar.uwo@gmail.com
          </a>
          <div className="contact-option">
            <h3>Prefer a conversation?</h3>
            <p>
              Choose a time for an introductory call. We’ll talk about your
              plans and see whether we’re a good fit.
            </p>
            <a
              className="button-link"
              href="https://calendly.com/a-kumar-uwo/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find a time to talk <Arrow diagonal />
            </a>
            <p className="contact-prompt">
              Opens the booking calendar in a new tab.
            </p>
          </div>
          <div className="contact-option">
            <span className="eyebrow">Based in Halifax, Nova Scotia</span>
            <p className="contact-prompt">
              Commercial spaces · Real estate · Hotels
              <br />
              Travel enquiries welcome.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
