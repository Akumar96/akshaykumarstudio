"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fcf9f5]/80 backdrop-blur-xl">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto">
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
        <Link
          href="/booking"
          className="bg-primary text-on-primary px-6 py-2 tracking-widest uppercase text-[11px] font-medium hover:opacity-70 transition-opacity active:scale-[0.98]"
        >
          Inquire
        </Link>
      </div>
    </nav>
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
