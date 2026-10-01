import type { Metadata } from "next";
import Link from "next/link";
import Arrow from "@/components/Arrow";
import { clientServices } from "@/lib/client-services";
export const metadata: Metadata = {
  title: "Client delivery",
  description:
    "Find your private gallery and choose the right photographs for your listing, website and marketing.",
};
const formats = [
  [
    "01",
    "Listings",
    "For the property’s next chapter.",
    "Tell us which listing platform you use. We’ll agree on its dimensions, file limits and any branding restrictions before export.",
  ],
  [
    "02",
    "Websites",
    "A clear view. A quicker page.",
    "Smaller files for screens, with the detail your space deserves. Tell us if your designer needs a particular crop or a wider banner.",
  ],
  [
    "03",
    "Marketing",
    "Room to make an impression.",
    "High-resolution files for your designer, with campaign crops agreed in the brief. Keep these as your source files for future layouts.",
  ],
];
export default function Clients() {
  const galleries = clientServices.galleries;
  return (
    <div className="shell">
      <header className="page-intro">
        <span className="eyebrow accent">For studio clients</span>
        <div className="page-intro-row">
          <h1>
            Made for you.
            <br />
            <i>Ready to use.</i>
          </h1>
          <p>
            Your photographs should be easy to put to work. We’ll agree on the
            formats you need for your listing, website and marketing before the
            shoot.
          </p>
        </div>
      </header>
      <section className="client-entry">
        <div>
          <span className="eyebrow">Your private delivery</span>
          <h2>
            Start with your
            <br />
            <i>delivery email.</i>
          </h2>
        </div>
        <div>
          <p>
            Your personal delivery link and access instructions belong in your
            delivery email. Keep them handy when downloading your photographs.
          </p>
          {galleries && (
            <a className="button-link" href={galleries}>
              Open my delivery <Arrow diagonal />
            </a>
          )}
          <a
            className="text-link"
            href="mailto:a.kumar.uwo@gmail.com?subject=Please%20resend%20my%20delivery%20link&body=Hi%20Akshay%2C%0A%0APlease%20resend%20the%20delivery%20link%20for%3A%0AProject%20or%20property%3A%20%0AShoot%20date%3A%20%0A"
          >
            Request my delivery link <Arrow />
          </a>
          <p className="contact-prompt">
            Include your project name and shoot date. Access is confirmed with
            the person who booked the project.
          </p>
        </div>
      </section>
      <section className="delivery-formats">
        <div className="section-heading">
          <div>
            <span className="eyebrow accent">A handoff with a purpose</span>
            <h2>The right file for the job.</h2>
          </div>
          <span className="eyebrow">Formats agreed in your proposal</span>
        </div>
        <div className="delivery-columns">
          {formats.map(([n, title, sub, body]) => (
            <article key={n}>
              <span className="eyebrow accent">{n}</span>
              <h3>{title}</h3>
              <p className="delivery-subtitle">{sub}</p>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="service-faq">
        <h2>
          A little help
          <br />
          <i>at handoff.</i>
        </h2>
        <div>
          <details>
            <summary>Which version should I download?</summary>
            <p>
              Use the set named for your intended use. Web files suit screens;
              high-resolution files give your designer more room to work. Check
              your listing platform’s requirements before uploading. Avoid
              screenshots or saving gallery previews.
            </p>
          </details>
          <details>
            <summary>How do I download everything?</summary>
            <p>
              Open the delivery link in your email and enter your access code.
              Choose the available file set, then download its ZIP. On a
              computer, extract the ZIP before uploading individual photographs.
            </p>
          </details>
          <details>
            <summary>Can my designer or marketing team use the files?</summary>
            <p>
              Refer to the usage agreed in your proposal. If another business,
              publication or supplier wants to use an image, contact the studio
              so we can confirm the appropriate permission.
            </p>
          </details>
          <details>
            <summary>Need a different crop or a missing file?</summary>
            <p>
              Email the project name, photograph filename, required dimensions
              and deadline. Keep an untouched copy of the delivered files when
              creating your own versions.
            </p>
            <a
              className="text-link"
              href="mailto:a.kumar.uwo@gmail.com?subject=Help%20with%20my%20delivery"
            >
              Get delivery help <Arrow />
            </a>
          </details>
        </div>
      </section>
      <section className="handoff-band">
        <div>
          <span className="eyebrow accent">From image to object</span>
          <h2>
            Some photographs
            <br />
            <i>belong on a wall.</i>
          </h2>
        </div>
        <div>
          <p>
            For photographs from your own shoot, ask about the print options in
            your private gallery. For places from the studio archive, explore
            the print collection.
          </p>
          <Link className="text-link" href="/prints">
            Explore prints <Arrow diagonal />
          </Link>
        </div>
      </section>
    </div>
  );
}
