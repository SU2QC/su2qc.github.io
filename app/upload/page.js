"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { SupabaseConfigurationError } from "../../lib/supabase/config";
import { isMissingAuthSession } from "../../lib/supabase/auth";
import { UploadForm } from "../../components/upload-form";
import { SectionIntro } from "../../components/section-intro";

export default function UploadPage() {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    async function checkAccess() {
      try {
        const client = createClient();
        const { data, error } = await client.auth.getUser();
        if (error && !isMissingAuthSession(error)) {
          if (!cancelled) setState({ status: "error", title: "Authentication unavailable", message: "The sign-in service could not be reached. Try again shortly." });
          return;
        }
        const user = data?.user;
        if (!user) {
          window.location.replace("/login?next=/upload");
          return;
        }
        const { data: member, error: memberError } = await client.from("members").select("id,display_name,active").eq("email", user.email?.toLowerCase() || "").maybeSingle();
        if (memberError) {
          if (!cancelled) setState({ status: "error", title: "Access check unavailable", message: "Your sign-in succeeded, but member access could not be verified. Try again shortly." });
          return;
        }
        if (!member?.active) {
          if (!cancelled) setState({ status: "denied" });
          return;
        }
        if (!cancelled) setState({ status: "ready", email: user.email });
      } catch (error) {
        if (!cancelled) setState(error instanceof SupabaseConfigurationError
          ? { status: "error", title: "Configuration required", message: "Set the public Supabase URL and publishable key in .env.local, then restart the static server." }
          : { status: "error", title: "Supabase unavailable", message: "The Supabase service could not be reached. Try again shortly." });
      }
    }
    checkAccess();
    return () => { cancelled = true; };
  }, []);

  if (state.status === "loading") return <section className="page-hero shell"><SectionIntro title="Checking member access." as="h1" className="page-intro">The upload form is available only to active SU2QC members.</SectionIntro></section>;
  if (state.status === "error") return <section className="page-hero shell"><SectionIntro title={state.title} as="h1" className="page-intro">{state.message}</SectionIntro></section>;
  if (state.status === "denied") return <section className="page-hero shell"><SectionIntro title="Member approval required" as="h1" className="page-intro">Authentication alone does not grant upload access. Ask a SU2QC administrator to activate your institutional email.</SectionIntro></section>;
  async function signOut() { await createClient().auth.signOut(); window.location.replace("/login/"); }
  return <section className="page-hero shell"><SectionIntro title="Share a research artifact." as="h1" className="page-intro">Signed in as {state.email}. Files are published only after a successful, policy-checked upload.</SectionIntro><div className="actions"><button className="button quiet" type="button" onClick={signOut}>Sign out</button></div><UploadForm /></section>;
}
