import type { Metadata } from "next";
import Link from "next/link";
import Arrow from "@/components/Arrow";
export const metadata: Metadata = {
  title: "Our AI",
  description:
    "A private AI built and run by Akshay Kumar Studios on our own hardware in Halifax — and the design AI we built for Jarvis Studio.",
};
export default function AI() {
  return (
    <>
      <div className="shell">
        <header className="page-intro">
          <span className="eyebrow accent">Built in-house · Run at home</span>
          <div className="page-intro-row">
            <h1>
              Our AI,
              <br />
              <i>on our own server.</i>
            </h1>
            <p>
              A private AI that runs on hardware we own, in Halifax.
              <br />
              No third-party assistants. Nothing leaves the building.
            </p>
          </div>
        </header>
        <section className="about-copy section-space">
          <p>
            Alongside the camera, we build software — and we hold it to the
            same standard as a print or a photograph. Our AI runs on our own
            machines: the models answer on a GPU in our studio, the web app
            runs on a board under our desk, and the conversations stay in a
            database we back up ourselves.
          </p>
          <p>
            It reads the documents we attach, files chats under projects with
            standing instructions, searches the web when it needs to, and
            exposes an OpenAI-compatible API so our own tools and scripts can
            use it too. The studio and our families use it every day.
          </p>
          <p>
            This is the engineering side of the studio, made visible. Visitors
            to the portfolio can try it directly — no account needed.
          </p>
          <a
            className="text-link"
            href="https://ai.akshaykumarstudio.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try the studio AI — ai.akshaykumarstudio.com <Arrow diagonal />
          </a>
        </section>
      </div>
      <section className="studio-note">
        <div className="shell">
          <span className="eyebrow accent">What it’s for</span>
          <div className="facts-row">
            <div>
              <span className="eyebrow">01 / Documents</span>
              <h3>Attach anything.</h3>
              <p>
                A PDF, a Word file or a photo. Ask what a contract actually
                commits you to, or get a document summarised with every date
                and amount pulled out.
              </p>
            </div>
            <div>
              <span className="eyebrow">02 / Projects</span>
              <h3>It knows the brief.</h3>
              <p>
                Chats are filed under projects with standing instructions, so
                every conversation starts already knowing the facts, the tone
                and what the work is about.
              </p>
            </div>
            <div>
              <span className="eyebrow">03 / Keys</span>
              <h3>Bring your own tools.</h3>
              <p>
                API keys work with the official SDKs, Codex CLI, aider and
                anything else that takes a base URL and a key.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="shell section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow accent">Client work · Jarvis Studio</span>
            <h2>
              The design AI
              <br />
              <i>we built for Jarvis Studio.</i>
            </h2>
          </div>
          <Link className="text-link" href="/booking">
            Want something like this? <Arrow />
          </Link>
        </div>
        <div className="about-copy">
          <p>
            Jarvis Studio needed their brand work to move at the speed their
            clients now expect. We built them a design AI — an assistant that
            holds their brand rules and produces the visual work around them:
            marketing layouts, creative concepts and campaign variations,
            checked against the studio’s own standards before anything reaches
            a client.
          </p>
          <p>
            The tool keeps the designer in charge. It drafts, varies and
            adapts; the studio decides. What used to start from a blank canvas
            now starts from a set of considered options.
          </p>
        </div>
        <div className="facts-row">
          <div>
            <span className="eyebrow">01 / The brief</span>
            <h3>Brand speed, without drift.</h3>
            <p>
              More concepts per client, without diluting the look and voice
              Jarvis Studio is known for.
            </p>
          </div>
          <div>
            <span className="eyebrow">02 / What we built</span>
            <h3>An assistant with the house style.</h3>
            <p>
              A private AI tool trained on the studio’s brand rules, past work
              and client requirements, wired into their everyday workflow.
            </p>
          </div>
          <div>
            <span className="eyebrow">03 / The result</span>
            <h3>Options before the blank page.</h3>
            <p>
              Designers start from on-brand drafts and spend their attention
              where it counts.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
