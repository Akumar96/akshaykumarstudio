import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import Arrow from "@/components/Arrow";
export const metadata: Metadata = {
  title: "The studio",
  description:
    "Meet Akshay Kumar, the photographer behind Akshay Kumar Studios in Halifax, Nova Scotia.",
};
export default function About() {
  return (
    <>
      <div className="shell">
        <header className="page-intro">
          <span className="eyebrow accent">
            The person behind the photographs
          </span>
          <h1>
            Hello,
            <br />
            <i>I’m Akshay.</i>
          </h1>
        </header>
        <section className="about-spread">
          <Photo
            src="/photos/me/Pinch_shoot_image2.webp"
            alt="Akshay Kumar in a navy suit, standing beside a stone wall"
            sizes="(max-width: 760px) 94vw, 47vw"
            preload
            position="48% center"
          />
          <div className="about-copy">
            <span className="eyebrow">Photographer. Filmmaker. Observer.</span>
            <h2>
              A space has a character.
              <br />I look for it.
            </h2>
            <p>
              I’m the photographer behind Akshay Kumar Studios, based in
              Halifax, Nova Scotia. My focus is photography and film for
              commercial spaces, real estate and hotels. Travel work is part of
              that interest in how places look and feel.
            </p>
            <p>
              I pay attention to how light moves through a room, how materials
              sit together, and what connects a building to its surroundings.
              Those details help a photograph say something useful about a
              space.
            </p>
            <p>
              Before a shoot, we’ll talk about who the images are for and how
              they’ll be used. That gives us a practical plan for the location,
              the timing and the final edit.
            </p>
            <Link href="/booking" className="text-link">
              Tell me what you have in mind <Arrow diagonal />
            </Link>
          </div>
        </section>
      </div>
      <section className="studio-note">
        <div className="shell">
          <span className="eyebrow accent">The way I work</span>
          <div className="facts-row">
            <div>
              <span className="eyebrow">01 / Before</span>
              <h3>Understand the brief.</h3>
              <p>
                The property, the audience and the intended use. A shared shot
                list gives the shoot a clear purpose.
              </p>
            </div>
            <div>
              <span className="eyebrow">02 / During</span>
              <h3>Pay attention.</h3>
              <p>
                Work with the light, check the frame, and leave time for the
                details that give the space its character.
              </p>
            </div>
            <div>
              <span className="eyebrow">03 / After</span>
              <h3>Make a considered edit.</h3>
              <p>
                Wide views and close details should work together. The edit
                should describe the space clearly across the channels you need.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="shell section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow accent">Beyond the building</span>
            <h2>Still looking, wherever I go.</h2>
          </div>
          <Link href="/portfolio/nature" className="text-link">
            Land & sea <Arrow />
          </Link>
        </div>
        <Photo
          src="/photos/nature/DSC01069.webp"
          alt="A path through green coastal hills with the sea stretching to the horizon"
          className="article-hero"
          sizes="94vw"
        />
      </section>
    </>
  );
}
