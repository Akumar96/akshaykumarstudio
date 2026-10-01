export const metadata = {
  title: "Studio workspace",
  robots: { index: false, follow: false },
};
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
