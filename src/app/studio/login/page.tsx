import { redirect } from "next/navigation";
import { isOwner, ownerKey } from "@/lib/studio/auth";
import { LoginForm } from "@/components/studio/StudioControls";
export default async function StudioLogin() {
  if (await isOwner()) redirect("/studio");
  ownerKey();
  return (
    <div className="studio-shell studio-login">
      <span className="eyebrow accent">
        Akshay Kumar Studios / Private workspace
      </span>
      <h1>
        The work
        <br />
        <i>behind the work.</i>
      </h1>
      <p>
        Manage each project from the first conversation to the final handoff.
      </p>
      <LoginForm />
      <small>
        Owner access only. Use the access key configured on your studio server.
      </small>
    </div>
  );
}
