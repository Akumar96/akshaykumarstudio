import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { isOwner } from "@/lib/studio/auth";
import { readProjects } from "@/lib/studio/store";
import { workflow } from "@/lib/studio/workflow";
import StudioFrame from "@/components/studio/StudioFrame";
import {
  StageEditor,
  ArchiveProject,
  ProjectInvoiceDraft,
} from "@/components/studio/StudioControls";
export default async function ProjectStage({
  params,
}: {
  params: Promise<{ id: string; stage: string }>;
}) {
  if (!(await isOwner())) redirect("/studio/login");
  const route = await params,
    project = readProjects().find((p) => p.id === route.id),
    stage = workflow.find((s) => s.id === route.stage);
  if (!project || !stage) notFound();
  return (
    <StudioFrame>
      <div className="studio-project-heading">
        <Link href="/studio">← All projects</Link>
        <div>
          <span className="eyebrow accent">
            {project.type}
            {project.archived ? " / Archived" : ""}
          </span>
          <h1>{project.name}</h1>
          <p>
            {project.client}
            {project.email ? ` · ${project.email}` : ""}
          </p>
        </div>
        <ArchiveProject project={project} />
      </div>
      <nav className="studio-steps" aria-label="Project workflow">
        {workflow.map((s, i) => (
          <Link
            href={`/studio/${project.id}/${s.id}`}
            key={s.id}
            aria-current={s.id === stage.id ? "page" : undefined}
          >
            <span>0{i + 1}</span>
            {s.label}
            {project.stage === s.id && <small>Current</small>}
          </Link>
        ))}
      </nav>
      {stage.id === "presell" && <ProjectInvoiceDraft project={project} />}
      <div className="studio-stage-layout">
        <aside>
          <span className="eyebrow accent">{stage.label}</span>
          <h2>{stage.heading}</h2>
          <p>{stage.intro}</p>
          <div className="studio-prompt">
            <span className="eyebrow">Conversation starter</span>
            <p>{stage.prompt}</p>
          </div>
          <small>
            Last saved{" "}
            {new Date(project.updatedAt).toLocaleString("en-CA", {
              timeZone: "America/Halifax",
            })}{" "}
            (Halifax)
          </small>
          <p className="studio-note-small">
            Private working notes. Saving does not send messages, sign an
            agreement or process a payment.
          </p>
        </aside>
        <StageEditor
          key={`${project.id}-${stage.id}`}
          project={project}
          stageId={stage.id}
        />
      </div>
    </StudioFrame>
  );
}
