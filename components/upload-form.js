"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { createClient } from "../lib/supabase/client";
import { getPublicConfig } from "../lib/supabase/config";

export function UploadForm() {
  const [state, setState] = useState("");

  async function submit(event) {
    event.preventDefault();
    setState("Uploading…");
    const form = new FormData(event.currentTarget);
    try {
      const { data: { session } } = await createClient().auth.getSession();
      if (!session?.access_token) { setState("Your session has expired. Sign in again."); return; }
      const { url, key } = getPublicConfig();
      const response = await fetch(`${url}/functions/v1/materials-upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, apikey: key },
        body: form,
      });
      const data = await response.json();
      setState(response.ok ? "Published successfully. Open the library to verify it." : data.error || "The upload could not be completed.");
      if (response.ok) event.currentTarget.reset();
    } catch { setState("The upload is temporarily unavailable."); }
  }

  return <form className="upload-card" onSubmit={submit}><div className="two-col"><label>Title<input name="title" required maxLength={180}/></label><label>File<input name="file" required type="file" accept=".pdf,.ppt,.pptx,.key,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.apple.keynote"/></label></div><label>Description<textarea name="description" required rows={5} maxLength={2000} placeholder="What is this material about?"/></label><label>BibTeX citation <span>(optional)</span><textarea name="bibtex" rows={8} placeholder={'@article{key,\n  author = {Family, Given and Family, Given},\n  title = {Paper title},\n  journal = {Journal},\n  year = {2026}\n}'}/></label><p className="form-note">Accepted: PDF, PPT, PPTX, Keynote · Maximum 50 MB. BibTeX is parsed into a conventional academic reference. File type and size are checked before storage; malware scanning is not included.</p><button className="button primary" type="submit"><Upload size={17}/> Upload and publish</button><div role="status" aria-live="polite" className="status">{state}</div></form>;
}
