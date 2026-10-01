import Link from "next/link";
export const metadata = {
  title: "Print order",
  robots: { index: false, follow: false },
};
export default function Order() {
  return (
    <div className="shell">
      <header className="page-intro">
        <span className="eyebrow accent">After checkout</span>
        <div className="page-intro-row">
          <h1>
            Thank you
            <br />
            <i>for choosing a print.</i>
          </h1>
          <p>
            Your payment receipt confirms your purchase. Printing starts after
            payment is verified. If you haven’t received a receipt or need help,
            contact the studio with the email used at checkout.
          </p>
        </div>
        <Link className="text-link" href="/prints">
          Return to prints
        </Link>
      </header>
    </div>
  );
}
