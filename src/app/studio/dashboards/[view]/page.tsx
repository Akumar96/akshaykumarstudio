import { redirect, notFound } from "next/navigation";
import { isOwner } from "@/lib/studio/auth";
import { readProjects } from "@/lib/studio/store";
import { readOperations } from "@/lib/studio/operations-store";
import { dashboardViews } from "@/lib/studio/operations";
import StudioFrame from "@/components/studio/StudioFrame";
import OperationsDashboard from "@/components/studio/OperationsDashboard";
export default async function Dashboard({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  if (!(await isOwner())) redirect("/studio/login");
  const { view } = await params;
  if (!dashboardViews.some((d) => d.id === view)) notFound();
  return (
    <StudioFrame>
      <OperationsDashboard
        view={view}
        initial={readOperations()}
        projects={readProjects()}
      />
    </StudioFrame>
  );
}
