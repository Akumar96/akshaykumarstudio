"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#fcf9f5]/80 backdrop-blur-xl">
        <div className="flex justify-between items-center w-full px-8 py-6 max-w-[1920px] mx-auto">
          <Link href="/" className="group flex items-center gap-3">
            {/* AK Monogram Logo */}
            <div className="relative w-10 h-10 border-2 border-[#191410] flex items-center justify-center group-hover:bg-[#191410] transition-colors duration-300">
              <span className="font-serif text-lg tracking-tighter text-[#191410] group-hover:text-[#fcf9f5] transition-colors duration-300">
                AK
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="font-serif text-sm tracking-widest uppercase text-[#191410] leading-none">
                Akshay Kumar
              </div>
              <div className="font-body text-[9px] tracking-[0.25em] uppercase text-secondary leading-none mt-1">
                Studios
              </div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <NavLink href="/" label="Home" active={pathname === "/"} />
            <NavLink href="/portfolio" label="Portfolio" active={pathname === "/portfolio"} />
            <NavLink href="/info" label="Info" active={pathname === "/info"} />
            <NavLink href="/booking" label="Booking" active={pathname === "/booking"} />
            <NavLink href="/about" label="About" active={pathname === "/about"} />
            <NavLink href="/topics" label="Topics" active={pathname === "/topics"} />
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/booking"
              className="hidden md:block bg-primary text-on-primary px-8 py-2.5 tracking-widest uppercase text-[11px] font-medium hover:opacity-70 transition-opacity active:scale-[0.98]"
            >
              Inquire
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-[2px] bg-[#191410] transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-6 h-[2px] bg-[#191410] transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-[2px] bg-[#191410] transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-40 bg-[#fcf9f5] transition-all duration-500 md:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {[
            { href: "/", label: "Home" },
            { href: "/portfolio", label: "Portfolio" },
            { href: "/info", label: "Info" },
            { href: "/booking", label: "Booking" },
            { href: "/about", label: "About" },
            { href: "/topics", label: "Topics" },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`text-3xl serif tracking-wide transition-all duration-500 ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              style={{ transitionDelay: mobileOpen ? `${i * 75}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setMobileOpen(false)}
            className={`mt-4 bg-primary text-on-primary px-10 py-3 tracking-widest uppercase text-[11px] font-medium transition-all duration-500 ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: mobileOpen ? "450ms" : "0ms" }}
          >
            Inquire
          </Link>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`tracking-widest uppercase text-[11px] font-medium transition-colors ${
        active
          ? "text-primary border-b border-primary pb-1"
          : "text-secondary hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );
}
