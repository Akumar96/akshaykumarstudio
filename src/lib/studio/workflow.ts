export type Field = {
  key: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "date"
    | "number"
    | "checkbox"
    | "select"
    | "url";
  options?: string[];
  hint?: string;
};
export const workflow: {
  id: string;
  label: string;
  heading: string;
  intro: string;
  prompt: string;
  fields: Field[];
}[] = [
  {
    id: "prequalify",
    label: "Prequalify",
    heading: "Understand the project.",
    intro: "Find the fit before sending a booking link.",
    prompt:
      "“What does this space need to communicate, and what would make this project a success for you?”",
    fields: [
      {
        key: "goal",
        label: "Business goal",
        type: "textarea",
        hint: "A listing launch, more direct hotel bookings, a design portfolio, or another clear outcome.",
      },
      {
        key: "property",
        label: "Property location and scope",
        type: "textarea",
      },
      { key: "audience", label: "Audience and intended use", type: "textarea" },
      { key: "decisionMaker", label: "Decision maker and other stakeholders" },
      {
        key: "budget",
        label: "Budget discussed",
        hint: "Record the client’s range; do not assume a price.",
      },
      { key: "deadline", label: "Launch / listing deadline", type: "date" },
      {
        key: "needs",
        label: "Photography, film and print needs",
        type: "textarea",
      },
      {
        key: "fit",
        label: "Fit assessment",
        type: "select",
        options: [
          "Not assessed",
          "Good fit",
          "Needs clarification",
          "Refer elsewhere",
        ],
      },
      { key: "followUp", label: "Next conversation", type: "date" },
      {
        key: "notes",
        label: "Questions and follow-up notes",
        type: "textarea",
      },
      {
        key: "goalConfirmed",
        label: "Outcome and intended use understood",
        type: "checkbox",
      },
      {
        key: "budgetConfirmed",
        label: "Budget and timing discussed",
        type: "checkbox",
      },
    ],
  },
  {
    id: "presell",
    label: "Presell",
    heading: "Make the offer clear.",
    intro: "Present the result, the scope and the investment together.",
    prompt:
      "“Based on your goals, this is the coverage I recommend—and how the photographs will work for your business.”",
    fields: [
      { key: "offer", label: "Offer / proposal title" },
      { key: "recommendation", label: "Recommended outcome", type: "textarea" },
      {
        key: "deliverables",
        label: "Included photographs, film and formats",
        type: "textarea",
      },
      {
        key: "usage",
        label: "Agreed usage and permitted recipients",
        type: "textarea",
      },
      {
        key: "exclusions",
        label: "Exclusions and optional additions",
        type: "textarea",
      },
      { key: "fee", label: "Proposed fee (CAD)", type: "number" },
      { key: "retainer", label: "Retainer (CAD)", type: "number" },
      {
        key: "paymentTerms",
        label: "Taxes and payment schedule",
        type: "textarea",
      },
      { key: "revisions", label: "Review rounds and revision scope" },
      { key: "proposalUrl", label: "Proposal / contract link", type: "url" },
      { key: "validUntil", label: "Offer valid until", type: "date" },
      {
        key: "status",
        label: "Offer status",
        type: "select",
        options: [
          "Draft",
          "Presented",
          "Changes requested",
          "Accepted",
          "Declined",
        ],
      },
      {
        key: "objections",
        label: "Client questions and responses",
        type: "textarea",
      },
      {
        key: "scopeApproved",
        label: "Scope and usage approved",
        type: "checkbox",
      },
      {
        key: "contractSigned",
        label: "Signed agreement received",
        type: "checkbox",
      },
      {
        key: "retainerReceived",
        label: "Retainer received / not required",
        type: "checkbox",
      },
    ],
  },
  {
    id: "plan",
    label: "Plan",
    heading: "Prepare the space.",
    intro: "Turn the agreed brief into a practical production plan.",
    prompt:
      "“Let’s walk through access, staging and the light so there are no surprises on the shoot day.”",
    fields: [
      { key: "shootDate", label: "Shoot date", type: "date" },
      {
        key: "schedule",
        label: "Arrival, coverage and room schedule",
        type: "textarea",
      },
      { key: "contact", label: "On-site contact and phone" },
      {
        key: "access",
        label: "Address, parking, keys and access",
        type: "textarea",
      },
      {
        key: "shotList",
        label: "Shot list",
        type: "textarea",
        hint: "One shot per line: space, purpose, orientation and priority.",
      },
      {
        key: "staging",
        label: "Staging / housekeeping checklist",
        type: "textarea",
      },
      {
        key: "light",
        label: "Light, weather and backup plan",
        type: "textarea",
      },
      {
        key: "platform",
        label: "Listing platform / designer export requirements",
        type: "textarea",
      },
      {
        key: "production",
        label: "Crew, equipment and permissions",
        type: "textarea",
      },
      {
        key: "briefShared",
        label: "Shot list and schedule shared",
        type: "checkbox",
      },
      {
        key: "accessConfirmed",
        label: "Access and permissions confirmed",
        type: "checkbox",
      },
      {
        key: "spaceReady",
        label: "Staging responsibilities agreed",
        type: "checkbox",
      },
    ],
  },
  {
    id: "present",
    label: "Present",
    heading: "Guide the selection.",
    intro: "Review the work against the brief, then record the decisions.",
    prompt:
      "“These are the lead images I recommend for your listing or homepage. Let’s choose what each image needs to do.”",
    fields: [
      { key: "reviewDate", label: "Presentation date", type: "date" },
      { key: "galleryUrl", label: "Private review gallery link", type: "url" },
      {
        key: "leadImages",
        label: "Recommended lead image filenames",
        type: "textarea",
      },
      {
        key: "selections",
        label: "Client selections and intended placement",
        type: "textarea",
      },
      {
        key: "feedback",
        label: "Feedback and agreed refinements",
        type: "textarea",
      },
      {
        key: "printSelection",
        label: "Print selection, size, finish and placement",
        type: "textarea",
      },
      {
        key: "additionalWork",
        label: "Additional work needing a separate quote",
        type: "textarea",
      },
      {
        key: "approval",
        label: "Edit approval",
        type: "select",
        options: ["Awaiting review", "Changes requested", "Approved"],
      },
      {
        key: "reviewComplete",
        label: "Images reviewed with the client",
        type: "checkbox",
      },
      {
        key: "selectionConfirmed",
        label: "Final selections recorded",
        type: "checkbox",
      },
      {
        key: "changesAgreed",
        label: "Revision scope and deadline agreed",
        type: "checkbox",
      },
    ],
  },
  {
    id: "pickup",
    label: "Pick up",
    heading: "Deliver with care.",
    intro:
      "A clear handoff for files, prints and everything the client needs next.",
    prompt:
      "“Here is the set for your listing, the set for your website, and the high-resolution files for your designer.”",
    fields: [
      { key: "deliveryDate", label: "Delivery date", type: "date" },
      {
        key: "deliveryUrl",
        label: "Private delivery homepage",
        type: "url",
        hint: "Keep access codes separate; send them privately to the client.",
      },
      { key: "expires", label: "Download access expires", type: "date" },
      { key: "listingFiles", label: "Listing bundle and export specification" },
      { key: "websiteFiles", label: "Website bundle and export specification" },
      {
        key: "marketingFiles",
        label: "Marketing bundle and export specification",
      },
      { key: "usageNotes", label: "Usage notes to include", type: "textarea" },
      { key: "labReference", label: "Print order / lab reference" },
      { key: "trackingUrl", label: "Shipment tracking link", type: "url" },
      {
        key: "pickupDetails",
        label: "Print pickup or shipping arrangements",
        type: "textarea",
      },
      { key: "followUpDate", label: "Follow-up date", type: "date" },
      { key: "handoff", label: "Delivery message draft", type: "textarea" },
      {
        key: "balanceSettled",
        label: "Balance settled / release approved",
        type: "checkbox",
      },
      {
        key: "filesChecked",
        label: "Every download opened and checked",
        type: "checkbox",
      },
      {
        key: "printsChecked",
        label: "Print quality checked / no prints ordered",
        type: "checkbox",
      },
      {
        key: "deliverySent",
        label: "Delivery instructions sent",
        type: "checkbox",
      },
      {
        key: "receiptConfirmed",
        label: "Client receipt confirmed",
        type: "checkbox",
      },
    ],
  },
];
export const projectTypes = [
  "Commercial space",
  "Real estate",
  "Hotel / hospitality",
  "Other",
];
export type Project = {
  id: string;
  name: string;
  client: string;
  email: string;
  type: string;
  stage: string;
  archived: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  sections: Record<string, Record<string, string | boolean>>;
};
