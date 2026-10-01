const steps = [
  [
    "Prequalify",
    "Find the fit.",
    "The property, the audience, the budget and the deadline. A short conversation to understand what a successful result looks like.",
  ],
  [
    "Presell",
    "Agree on the outcome.",
    "A clear proposal covering the photographs, film, usage, schedule and price. Make the important decisions before production begins.",
  ],
  [
    "Plan",
    "Prepare the space.",
    "A shared shot list, access arrangements and a plan for staging and light. Everyone knows what needs to be ready.",
  ],
  [
    "Present",
    "See the work together.",
    "Review the edit in the context of your listing, website or campaign. Choose the lead images and flag any agreed refinements.",
  ],
  [
    "Pick up",
    "Put it to work.",
    "A digital handoff with clearly named files and usage notes. If prints are part of the project, confirm the finish and delivery details.",
  ],
];
export default function ClientJourney() {
  return (
    <section className="client-journey" aria-labelledby="journey-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow accent">
            From first conversation to final delivery
          </span>
          <h2 id="journey-title">Considered at every step.</h2>
        </div>
      </div>
      <ol>
        {steps.map(([label, title, body], i) => (
          <li key={label}>
            <span className="eyebrow accent">
              0{i + 1} / {label}
            </span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
