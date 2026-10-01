import Link from "next/link";
import Arrow from "./Arrow";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-invitation">
          <span className="eyebrow">Photography & film for places</span>
          <Link href="/booking">
            Have a space in mind?
            <Arrow diagonal />
          </Link>
        </div>
        <div className="footer-details">
          <Link className="footer-brand" href="/">
            Akshay Kumar
            <br />
            <i>Studios.</i>
          </Link>
          <p>
            Photography & film.
            <br />
            Based in Halifax, Nova Scotia.
            <br />
            Commercial · Real estate · Hotels.
          </p>
          <div>
            <a href="mailto:a.kumar.uwo@gmail.com">a.kumar.uwo@gmail.com</a>
            <Link href="/booking">
              Plan a conversation <Arrow diagonal />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Akshay Kumar Studios</span>
          <div>
            <Link href="/portfolio">Work</Link>
            <Link href="/about">Studio</Link>
            <Link href="/info">Information</Link>
            <Link href="/prints">Prints</Link>
            <Link href="/clients">Client delivery</Link>
            <Link href="/topics">Journal</Link>
          </div>
          <span>A sense of place.</span>
        </div>
      </div>
    </footer>
  );
}
