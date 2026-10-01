"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projectTypes, workflow, type Project } from "@/lib/studio/workflow";
export function LoginForm() {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      className="studio-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const password = new FormData(e.currentTarget).get("password");
        try {
          const r = await fetch("/api/studio/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });
          if (!r.ok) {
            const data = await r.json();
            throw new Error(data.error || "Could not sign in.");
          }
          router.replace("/studio");
          router.refresh();
        } catch (e) {
          setError((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        Owner access key
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <button disabled={busy}>{busy ? "Opening…" : "Open studio"}</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
export function Logout() {
  const router = useRouter();
  return (
    <button
      className="studio-quiet"
      onClick={async () => {
        const r = await fetch("/api/studio/session", { method: "DELETE" });
        if (r.ok) {
          router.push("/studio/login");
          router.refresh();
        }
      }}
    >
      Sign out
    </button>
  );
}
export function NewProject() {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <details className="studio-new">
      <summary>+ New project</summary>
      <form
        className="studio-form studio-new-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const data = Object.fromEntries(new FormData(e.currentTarget));
          try {
            const r = await fetch("/api/studio/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            const p = await r.json();
            if (!r.ok) throw new Error(p.error || "Could not save project");
            router.push(`/studio/${p.id}/prequalify`);
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Project / property
          <input
            name="name"
            required
            maxLength={160}
            placeholder="Property or project name"
          />
        </label>
        <label>
          Client / business
          <input name="client" required maxLength={160} />
        </label>
        <label>
          Contact email
          <input name="email" type="email" maxLength={254} />
        </label>
        <label>
          Project type
          <select name="type">
            {projectTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <button disabled={busy}>{busy ? "Creating…" : "Create project"}</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </details>
  );
}
export function StageEditor({
  project,
  stageId,
}: {
  project: Project;
  stageId: string;
}) {
  const stage = workflow.find((s) => s.id === stageId)!;
  const index = workflow.indexOf(stage);
  const [version, setVersion] = useState(project.version),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(false),
    [dirty, setDirty] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!dirty) return;
    const unload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    const navigate = (event: MouseEvent) => {
      const target =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (
        target &&
        target.getAttribute("href") &&
        !window.confirm("Leave this stage without saving your changes?")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", navigate, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", navigate, true);
    };
  }, [dirty]);
  return (
    <form
      className="studio-form"
      onChange={() => {
        setDirty(true);
        setMessage("Unsaved changes");
        setError(false);
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget),
          submitter = (e.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement;
        const advance = submitter?.value === "advance";
        const values = Object.fromEntries(
          stage.fields.map((f) => [
            f.key,
            f.type === "checkbox"
              ? form.get(f.key) === "on"
              : String(form.get(f.key) || ""),
          ]),
        );
        setBusy(true);
        setError(false);
        try {
          const r = await fetch(`/api/studio/projects/${project.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ version, stage: stageId, values, advance }),
          });
          if (r.status === 401)
            throw new Error(
              "Your session expired. Open Studio in another tab to sign in, then save these entries again.",
            );
          const data = await r.json();
          if (!r.ok) throw new Error(data.error || "Save failed");
          setVersion(data.version);
          setDirty(false);
          setMessage("Saved to studio records.");
          if (advance && index < 4)
            router.push(`/studio/${project.id}/${workflow[index + 1].id}`);
          router.refresh();
        } catch (e) {
          setError(true);
          setMessage((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="studio-fields">
        {stage.fields
          .filter((f) => f.type !== "checkbox")
          .map((f) => (
            <label
              key={f.key}
              className={f.type === "textarea" ? "studio-wide" : ""}
            >
              {f.label}
              {f.type === "textarea" ? (
                <textarea
                  name={f.key}
                  rows={4}
                  maxLength={6000}
                  defaultValue={String(
                    project.sections[stageId]?.[f.key] || "",
                  )}
                />
              ) : f.type === "select" ? (
                <select
                  name={f.key}
                  defaultValue={String(
                    project.sections[stageId]?.[f.key] || f.options?.[0],
                  )}
                >
                  {f.options?.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  name={f.key}
                  type={f.type || "text"}
                  min={f.type === "number" ? 0 : undefined}
                  step={f.type === "number" ? "0.01" : undefined}
                  maxLength={6000}
                  defaultValue={String(
                    project.sections[stageId]?.[f.key] || "",
                  )}
                />
              )}{" "}
              {f.hint && <small>{f.hint}</small>}
            </label>
          ))}
      </div>
      <fieldset className="studio-checklist">
        <legend>Before moving on</legend>
        {stage.fields
          .filter((f) => f.type === "checkbox")
          .map((f) => (
            <label key={f.key}>
              <input
                type="checkbox"
                name={f.key}
                defaultChecked={project.sections[stageId]?.[f.key] === true}
              />
              {f.label}
            </label>
          ))}
      </fieldset>
      <div className="studio-save">
        <button disabled={busy} value="save">
          {busy ? "Saving…" : "Save this stage"}
        </button>
        {index < 4 && (
          <button className="studio-secondary" disabled={busy} value="advance">
            Save & move to {workflow[index + 1].label}
          </button>
        )}
        <span
          role={error ? "alert" : "status"}
          className={error ? "studio-error" : ""}
        >
          {message ||
            (dirty ? "Unsaved changes" : "Changes save when you choose Save.")}
        </span>
      </div>
    </form>
  );
}
export function ArchiveProject({ project }: { project: Project }) {
  const router = useRouter();
  const [error, setError] = useState("");
  return (
    <>
      <button
        className="studio-quiet"
        onClick={async () => {
          try {
            const r = await fetch(`/api/studio/projects/${project.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                version: project.version,
                archived: !project.archived,
              }),
            });
            if (!r.ok)
              throw new Error("Could not update. Refresh and try again.");
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        {project.archived ? "Restore project" : "Archive project"}
      </button>
      {error && <span role="alert">{error}</span>}
    </>
  );
}

export function ProjectInvoiceDraft({ project }: { project: Project }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <details className="studio-new">
      <summary>Prepare invoice & agreement from this offer</summary>
      <form
        className="studio-form studio-new-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            const values = Object.fromEntries(new FormData(e.currentTarget));
            const r = await fetch("/api/studio/invoices/from-project", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...values,
                projectId: project.id,
                projectVersion: project.version,
              }),
            });
            const data = await r.json();
            if (!r.ok)
              throw new Error(data.error || "Could not create invoice");
            router.push(`/studio/invoices/${data.id}`);
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Invoice number
          <input
            name="number"
            required
            maxLength={100}
            placeholder="Your invoice reference"
          />
        </label>
        <label>
          Payment due date
          <input name="date" type="date" required />
        </label>
        <p className="contact-prompt">
          Uses the saved proposed fee:{" "}
          {String(project.sections.presell?.fee || "not set")} CAD before tax.
          Save your offer first. This creates a draft and sends nothing.
        </p>
        <button disabled={busy}>
          {busy ? "Preparing…" : "Create document draft"}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    </details>
  );
}
