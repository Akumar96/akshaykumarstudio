import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import Arrow from "@/components/Arrow";
import { commerceConfig } from "@/lib/print-commerce";
import { clientServices } from "@/lib/client-services";
export const metadata: Metadata = {
  title: "Photographic prints",
  description:
    "Land, sea and quiet places. Explore photographs for your walls by Akshay Kumar Studios.",
};
const works = [
  {
    name: "Evening on the coast",
    src: "/photos/nature/DSC01520.webp",
    note: "Land & sea / 01",
  },
  {
    name: "Through the arch",
    src: "/photos/nature/DSC03629.webp",
    note: "Farther afield / 02",
  },
  {
    name: "The water, after dark",
    src: "/photos/nature/DSC01549.webp",
    note: "Reflections / 03",
  },
];
export default function Prints() {
  const store = clientServices.store;
  const commerce = commerceConfig();
  return (
    <div className="shell">
      <header className="page-intro">
        <span className="eyebrow accent">Photographs to live with</span>
        <div className="page-intro-row">
          <h1>
            A place
            <br />
            <i>on your wall.</i>
          </h1>
          <p>
            A quiet coast. A view through an arch. Photographs from the archive,
            considered beyond the screen.
          </p>
        </div>
      </header>
      <section className="print-selection" aria-label="Selected photographs">
        {works.map((work, i) => (
          <figure className="print-study" key={work.src}>
            <div className="print-mat">
              <Photo
                src={work.src}
                alt={work.name}
                sizes="(max-width: 760px) 82vw, 40vw"
                preload={i === 0}
                unoptimized
              />
            </div>
            <figcaption>
              <span className="eyebrow">{work.note}</span>
              <h2>{work.name}</h2>
            </figcaption>
          </figure>
        ))}
        <div className="print-shop-note">
          <span className="eyebrow accent">The print collection</span>
          <h2>
            Choose something
            <br />
            <i>you’ll keep.</i>
          </h2>
          {commerce.ready ? (
            <>
              <p>
                Choose your photograph and print size below. Shipping within
                Canada; your final total, including applicable tax, is shown at
                checkout.
              </p>
              <a className="button-link" href="#order">
                Choose a print <Arrow />
              </a>
            </>
          ) : store ? (
            <>
              <p>
                Explore available photographs, sizes and finishes in the print
                store. Review your crop, shipping and total before paying
                online.
              </p>
              <a className="button-link" href={store}>
                Visit the print store <Arrow diagonal />
              </a>
              <p className="contact-prompt">
                Continues to our hosted store for checkout.
              </p>
            </>
          ) : (
            <>
              <p>
                The online print collection is being prepared. Sizes, finishes
                and prices will be published when ordering opens.
              </p>
              <a
                className="text-link"
                href="mailto:a.kumar.uwo@gmail.com?subject=Print%20collection%20enquiry"
              >
                Ask about a photograph <Arrow diagonal />
              </a>
            </>
          )}
        </div>
      </section>
      {commerce.ready && (
        <section id="order" className="print-order">
          <span className="eyebrow accent">Order a print / CAD</span>
          <h2>Find your photograph.</h2>
          {!commerce.live && (
            <p role="status">
              Test checkout — no real payment or print order will be made.
            </p>
          )}
          <div className="delivery-columns">
            {commerce.products.map((product) => (
              <form
                action="/api/prints/checkout"
                method="post"
                key={product.id}
              >
                <input type="hidden" name="product" value={product.id} />
                <h3>{product.name}</h3>
                <p>{product.size}</p>
                <p>{product.description}</p>
                <p>
                  {new Intl.NumberFormat("en-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(product.unitAmount / 100)}{" "}
                  +{" "}
                  {new Intl.NumberFormat("en-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(product.shippingAmount / 100)}{" "}
                  shipping. Tax at checkout.
                </p>
                <label className="order-consent">
                  <input
                    type="checkbox"
                    name="terms"
                    value="accepted"
                    required
                  />{" "}
                  <span>
                    I agree to the{" "}
                    <a
                      href={commerce.terms}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      order terms and returns policy
                    </a>
                    .
                  </span>
                </label>
                <button className="button-link" type="submit">
                  Continue to secure payment <Arrow />
                </button>
                <p className="contact-prompt">
                  One print per order. Image fitted without cropping; borders
                  may appear.
                </p>
              </form>
            ))}
          </div>
        </section>
      )}
      <section className="handoff-band">
        <div>
          <span className="eyebrow accent">For your space</span>
          <h2>
            A single photograph.
            <br />
            <i>Or a collection that belongs together.</i>
          </h2>
        </div>
        <div>
          <p>
            Choosing work for an office, guest room or shared space? Send a
            photograph of the wall and its measurements. We can discuss a
            selection, scale and placement before you decide.
          </p>
          <Link className="text-link" href="/booking">
            Talk through your space <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section className="service-faq">
        <h2>Before you choose.</h2>
        <div>
          <details>
            <summary>Can I buy a file to print myself?</summary>
            <p>
              Digital files and physical prints are separate products. Any
              downloadable product will state its permitted use in the store.
              For a specific print size or commercial use, contact the studio
              before purchasing.
            </p>
          </details>
          <details>
            <summary>Can I order photographs from my own shoot?</summary>
            <p>
              Contact the studio with your project name and the photograph
              filenames. We’ll confirm which print sizes and finishes suit the
              original files.
            </p>
            <Link className="text-link" href="/clients">
              Client delivery <Arrow />
            </Link>
          </details>
          <details>
            <summary>What if I need an image for a business?</summary>
            <p>
              Tell me where it will appear, the audience and whether it will be
              used in advertising. We’ll confirm the appropriate files and usage
              in your project proposal.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
