import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container w-full py-20 px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="font-headline text-lg tracking-widest uppercase text-primary">
            The Curated Archive
          </div>
          <p className="text-secondary text-sm leading-relaxed max-w-xs font-body">
            A boutique photography and film studio specializing in high-end editorial storytelling and maritime heritage documentation.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-secondary hover:text-primary transition-all underline decoration-1 underline-offset-4">Instagram</Link>
            <Link href="#" className="text-secondary hover:text-primary transition-all">Vimeo</Link>
            <Link href="#" className="text-secondary hover:text-primary transition-all">Journal</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface mb-6">Navigation</p>
            <Link href="/booking" className="block text-sm text-secondary hover:text-primary transition-all">Contact</Link>
            <Link href="/portfolio" className="block text-sm text-secondary hover:text-primary transition-all">Portfolio</Link>
            <Link href="/topics" className="block text-sm text-secondary hover:text-primary transition-all">Archive</Link>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface mb-6">Legal</p>
            <Link href="#" className="block text-sm text-secondary hover:text-primary transition-all">Privacy</Link>
            <Link href="#" className="block text-sm text-secondary hover:text-primary transition-all">Halifax Editorial Services</Link>
          </div>
        </div>
        <div className="space-y-8">
          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface mb-6">Studio</p>
          <div className="space-y-2">
            <p className="text-sm text-secondary font-body">1234 Lower Water St.</p>
            <p className="text-sm text-secondary font-body">Halifax, NS B3J 3S8</p>
          </div>
          <a href="mailto:hello@curatedarchive.ca" className="text-xl font-headline italic block hover:opacity-60 transition-opacity">
            hello@curatedarchive.ca
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-secondary">
          © 2024 The Curated Archive. Halifax Fine Art Photography.
        </p>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 bg-secondary rounded-full"></span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-secondary">Built for the Coast</span>
        </div>
      </div>
    </footer>
  );
}
