import Link from "next/link";
import { redirect } from "next/navigation";
import { isOwner } from "@/lib/studio/auth";
import { readProjects } from "@/lib/studio/store";
import { workflow } from "@/lib/studio/workflow";
import StudioFrame from "@/components/studio/StudioFrame";
import { NewProject, ArchiveProject } from "@/components/studio/StudioControls";
export default async function Studio() {
  if (!(await isOwner())) redirect("/studio/login");
  const projects = readProjects();
  const active = projects.filter((p) => !p.archived),
    archived = projects.filter((p) => p.archived);
  return (
    <StudioFrame>
      <div className="studio-title">
        <div>
          <span className="eyebrow accent">A considered client experience</span>
          <h1>
            Every project.
            <br />
            <i>A clear next step.</i>
          </h1>
        </div>
        <p>
          Prequalify, presell, plan, present, and deliver. Keep the
          conversations and decisions together.
        </p>
      </div>
      <NewProject />
      <div className="studio-board">
        {workflow.map((stage, i) => (
          <section key={stage.id}>
            <div className="studio-column-heading">
              <span className="eyebrow">0{i + 1}</span>
              <h2>{stage.label}</h2>
              <span>{active.filter((p) => p.stage === stage.id).length}</span>
            </div>
            {active
              .filter((p) => p.stage === stage.id)
              .map((p) => (
                <Link
                  className="studio-project-card"
                  href={`/studio/${p.id}/${p.stage}`}
                  key={p.id}
                >
                  <small>{p.type}</small>
                  <h3>{p.name}</h3>
                  <p>{p.client}</p>
                  <span>Open project →</span>
                </Link>
              ))}
            {!active.some((p) => p.stage === stage.id) && (
              <p className="studio-empty-column">No projects here yet.</p>
            )}
          </section>
        ))}
      </div>
      {!projects.length && (
        <div className="studio-empty">
          <h2>Your first project starts here.</h2>
          <p>
            Create a project above. Begin with the client’s goals, intended use,
            budget and deadline.
          </p>
        </div>
      )}
      {archived.length > 0 && (
        <details className="studio-archive">
          <summary>Archived projects ({archived.length})</summary>
          {archived.map((p) => (
            <div key={p.id}>
              <Link href={`/studio/${p.id}/${p.stage}`}>
                {p.name} · {p.client}
              </Link>
              <ArchiveProject project={p} />
            </div>
          ))}
        </details>
      )}
    </StudioFrame>
  );
}
