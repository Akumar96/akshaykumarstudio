"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Arrow from "./Arrow";
const links = [
  { href: "/portfolio", label: "Work" },
  { href: "/about", label: "Studio" },
  { href: "/info", label: "Information" },
  { href: "/prints", label: "Prints" },
  { href: "/clients", label: "Clients" },
];
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header shell">
      <Link
        href="/"
        aria-label="Akshay Kumar Studios home"
        className="wordmark"
        onClick={() => setOpen(false)}
      >
        <span className="monogram">
          ak<span>·</span>
        </span>
        <span>
          AKSHAY KUMAR
          <br />
          <span className="wordmark-sub">PHOTOGRAPHY & FILM</span>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname.startsWith(link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link href="/booking" className="header-contact">
        Let’s talk <Arrow diagonal />
      </Link>
      <button
        ref={menuButton}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[...links, { href: "/booking", label: "Let’s talk" }].map(
            (link, i) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={
                  pathname.startsWith(link.href) ? "page" : undefined
                }
                onClick={() => setOpen(false)}
              >
                <span className="eyebrow">0{i + 1}</span>
                {link.label}
                <Arrow diagonal />
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
