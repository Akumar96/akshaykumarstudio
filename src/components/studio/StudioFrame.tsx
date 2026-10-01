import Link from "next/link";
import { dashboardViews } from "@/lib/studio/operations";
import { Logout } from "./StudioControls";
export default function StudioFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="studio-shell">
      <header className="studio-header">
        <Link href="/studio" className="studio-brand">
          ak<span>·</span> <small>STUDIO WORKSPACE</small>
        </Link>
        <nav>
          <Link href="/studio">Projects</Link>
          <Link href="/" target="_blank">
            View website ↗
          </Link>
          <Logout />
        </nav>
      </header>
      <nav className="ops-navigation" aria-label="Studio dashboards">
        {dashboardViews.map((d) => (
          <Link key={d.id} href={`/studio/dashboards/${d.id}`}>
            {d.label}
          </Link>
        ))}
      </nav>
      {children}
      <footer className="studio-foot">
        Private studio records · Commercial spaces / Real estate / Hotels
      </footer>
    </div>
  );
}
