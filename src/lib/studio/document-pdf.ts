import { PDFDocument, StandardFonts, rgb, type PDFPage } from "pdf-lib";
import {
  documentTotals,
  documentIssues,
  type InvoiceDocument,
} from "./documents.ts";
import { money } from "./operations.ts";
export async function documentPdf(
  doc: InvoiceDocument,
  kind: "invoice" | "agreement",
) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica),
    serif = await pdf.embedFont(StandardFonts.TimesRoman),
    bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const width = 612,
    height = 792,
    margin = 52,
    ink = rgb(0.14, 0.14, 0.13),
    muted = rgb(0.4, 0.4, 0.37),
    red = rgb(0.64, 0.2, 0.15);
  let page!: PDFPage;
  let y = 0;
  const clean = (s: string) =>
    s
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, "    ")
      .replace(/[\u202f\u00a0]/g, " ");
  const newPage = () => {
    page = pdf.addPage([width, height]);
    y = height - margin;
    page.drawText("AKSHAY KUMAR STUDIOS / " + kind.toUpperCase(), {
      x: margin,
      y,
      size: 8,
      font: regular,
      color: muted,
    });
    y -= 34;
  };
  const space = (needed: number) => {
    if (y - needed < 65) newPage();
  };
  const paragraph = (value: string, size = 10, font = regular, color = ink) => {
    for (const original of clean(value).split("\n")) {
      const words = original.split(/\s+/);
      let line = "";
      const draw = () => {
        space(size * 1.5);
        page.drawText(line, { x: margin, y, size, font, color });
        y -= size * 1.5;
        line = "";
      };
      for (const word of words) {
        if (font.widthOfTextAtSize(word, size) > width - margin * 2) {
          if (line) draw();
          for (const char of word) {
            if (font.widthOfTextAtSize(line + char, size) > width - margin * 2)
              draw();
            line += char;
          }
        } else if (
          font.widthOfTextAtSize(line + (line ? " " : "") + word, size) >
          width - margin * 2
        ) {
          draw();
          line = word;
        } else line += (line ? " " : "") + word;
      }
      draw();
    }
    y -= 7;
  };
  const section = (label: string, value: string) => {
    space(55);
    paragraph(label.toUpperCase(), 8, bold, muted);
    paragraph(value || "Not provided — complete before sending.");
    y -= 4;
  };
  newPage();
  const f = doc.fields,
    t = documentTotals(doc),
    draft = documentIssues(f).length > 0;
  paragraph(
    kind === "invoice" ? `Invoice ${doc.invoiceNumber}` : "Project agreement",
    27,
    serif,
  );
  if (draft) paragraph("DRAFT — FOR REVIEW", 9, bold, red);
  paragraph(f.title || "Photography project", 13, serif);
  if (kind === "invoice") {
    section(
      "From",
      [
        f.businessName,
        f.businessAddress,
        f.businessEmail,
        f.taxId && `Tax registration: ${f.taxId}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    section(
      "Bill to",
      [f.clientName, f.clientAddress, f.clientEmail].filter(Boolean).join("\n"),
    );
    paragraph(`Invoice date: ${f.issuedDate}    |    Due date: ${doc.dueDate}`);
    section("Services", f.deliverables || f.scope);
    space(110);
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: muted,
    });
    y -= 24;
    paragraph(`Subtotal (CAD): ${money(t.subtotal)}`, 12, bold);
    paragraph(
      f.taxMode === "not-set"
        ? "Tax treatment: not specified"
        : f.taxMode === "rate"
          ? `Tax (${f.taxRate}%): ${money(t.tax)}`
          : "Tax: not charged",
      11,
    );
    paragraph(`Invoice total (CAD): ${money(t.total)}`, 17, serif);
    section("Payment instructions and schedule", f.paymentTerms);
  } else {
    section(
      "Parties",
      [
        `Studio: ${f.businessName}`,
        f.businessAddress,
        `Client: ${f.clientName}`,
        f.clientAddress,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    for (const [label, value] of [
      ["Scope", f.scope],
      ["Deliverables", f.deliverables],
      ["Usage and permitted recipients", f.usage],
      ["Schedule", f.schedule],
      [
        "Fees and payment",
        `Invoice ${doc.invoiceNumber}: ${money(t.subtotal)} before tax; total ${money(t.total)} CAD.\n${f.paymentTerms}`,
      ],
      ["Review and revisions", f.revisions],
      ["Exclusions and optional additions", f.exclusions],
      ["Cancellation and rescheduling", f.cancellation],
      ["Additional terms", f.additionalTerms],
    ]) {
      if (
        value ||
        [
          "Scope",
          "Deliverables",
          "Usage and permitted recipients",
          "Schedule",
          "Cancellation and rescheduling",
        ].includes(label)
      )
        section(label, value);
    }
    space(105);
    paragraph("Signatures", 17, serif);
    paragraph(
      "Client name / signature: ____________________________________\nDate: ____________________\nStudio name / signature: ____________________________________\nDate: ____________________",
    );
  }
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawText(
      `${doc.invoiceNumber} / Revision ${doc.version} / ${i + 1} of ${pages.length}`,
      { x: margin, y: 32, size: 8, font: regular, color: muted },
    );
  });
  pdf.setTitle(
    `${kind === "invoice" ? "Invoice" : "Project agreement"} ${doc.invoiceNumber}`,
  );
  pdf.setAuthor(f.businessName);
  return pdf.save();
}
