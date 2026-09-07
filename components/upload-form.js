"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { createClient } from "../lib/supabase/client";
import { getPublicConfig } from "../lib/supabase/config";
import { isMissingAuthSession } from "../lib/supabase/auth";
import { messageForUploadError, messageForUploadResponse } from "../lib/upload-status.mjs";

export function UploadForm() {
  const [state, setState] = useState("");
  const [visibility, setVisibility] = useState("vault");

  async function submit(event) {
    event.preventDefault();
    setState("Uploading…");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    let client;
    try {
      client = createClient();
    } catch (error) {
      setState(messageForUploadError(error, "config"));
      return;
    }

    let session;
    try {
      const result = await client.auth.getSession();
      if (result.error) {
        setState(messageForUploadError(result.error, "session"));
        return;
      }
      session = result.data?.session;
    } catch (error) {
      setState(isMissingAuthSession(error) ? "Your session has expired. Sign in again." : messageForUploadError(error, "session"));
      return;
    }
    if (!session?.access_token) { setState("Your session has expired. Sign in again."); return; }

    let config;
    try {
      config = getPublicConfig();
    } catch (error) {
      setState(messageForUploadError(error, "config"));
      return;
    }

    let response;
    try {
      response = await fetch(`${config.url}/functions/v1/materials-upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, apikey: config.key },
        body: form,
      });
    } catch {
      setState(messageForUploadError(null, "network"));
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch {
      setState(messageForUploadError(null, "response"));
      return;
    }
    setState(messageForUploadResponse(response.status, data));
    if (response.ok) formElement.reset();
  }

  return <form className="upload-card" onSubmit={submit}><div className="two-col"><label>Title<input name="title" required maxLength={180}/></label><label>File<input name="file" required type="file" accept=".pdf,.ppt,.pptx,.key,.doc,.docx,.odt,.odp,.md,.markdown,.txt,.tex,.latex,.py,.js,.jsx,.ts,.tsx,.c,.h,.cpp,.hpp,.rs,.go,.java,.ipynb,.zip,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.apple.keynote"/></label></div><label>Description<textarea name="description" required rows={5} maxLength={2000} placeholder="What is this material about?"/></label><label>Destination<select name="visibility" value={visibility} onChange={event => setVisibility(event.target.value)}><option value="vault">Vault — members only</option><option value="library">Library — public</option></select></label>{visibility === "library" && <label className="consent"><input name="public_acknowledged" type="checkbox" value="true" required/> I understand that this file and its metadata will be visible in the public Library.</label>}<label>BibTeX citation <span>(optional)</span><textarea name="bibtex" rows={8} placeholder={'@article{key,\n  author = {Family, Given and Family, Given},\n  title = {Paper title},\n  journal = {Journal},\n  year = {2026}\n}'}/></label><p className="form-note">Accepted documents, presentations, notes, source files, notebooks, and ZIP code packages · Maximum 50 MB. Files are validated server-side; malware scanning is not included.</p><button className="button primary" type="submit"><Upload size={17}/> Upload material</button><div role="status" aria-live="polite" className="status">{state}</div></form>;
}
