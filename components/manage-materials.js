"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { getPublicConfig } from "../lib/supabase/config";

async function managementRequest(path = "", options = {}) {
  const client = createClient();
  const { data } = await client.auth.getSession();
  const config = getPublicConfig();
  return fetch(`${config.url}/functions/v1/materials-manage${path}`, { ...options, headers: { apikey: config.key, Authorization: `Bearer ${data.session?.access_token || ""}`, ...(options.headers || {}) } });
}

export function ManageMaterials() {
  const [state, setState] = useState({ status: "loading" });
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const response = await managementRequest();
      if (response.status === 401) { window.location.replace("/login/?next=/my-materials/"); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setState({ status: "ready", items: data.materials || [] });
    } catch { setState({ status: "error" }); }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { load(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function save(event, item) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    body.public_acknowledged = body.public_acknowledged === "true" || body.public_acknowledged === "on";
    setMessage("Saving…");
    const response = await managementRequest(`?id=${encodeURIComponent(item.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setMessage(response.ok ? "Saved." : "The material could not be updated.");
    if (response.ok) load();
  }

  async function replace(event, item) {
    event.preventDefault();
    const body = new FormData(event.currentTarget);
    setMessage("Replacing file…");
    const response = await managementRequest(`?id=${encodeURIComponent(item.id)}`, { method: "PUT", body });
    setMessage(response.ok ? "File replaced." : "The file could not be replaced.");
    if (response.ok) { event.currentTarget.reset(); load(); }
  }

  async function remove(item) {
    if (!window.confirm(`Delete “${item.title}” and its stored file? This cannot be undone.`)) return;
    setMessage("Deleting…");
    const response = await managementRequest(`?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    setMessage(response.ok ? "Deleted." : "The material could not be deleted.");
    if (response.ok) load();
  }

  if (state.status === "loading") return <div className="empty" role="status">Checking member access…</div>;
  if (state.status === "error") return <div className="empty"><h2>Management unavailable</h2><p>Sign in again and retry.</p></div>;
  return <div className="management-list">{state.items.length === 0 ? <div className="empty"><h2>No materials to manage</h2><p>Upload a material from the member upload page.</p></div> : state.items.map(item => <article className="management-card" key={item.id}><div className="material-meta">{item.file_type || "Research material"} · {item.visibility === "vault" ? "Vault — members only" : "Library — public"} · {item.status}</div><h2>{item.title}</h2><form className="upload-card" onSubmit={event => save(event, item)}><div className="two-col"><label>Title<input name="title" defaultValue={item.title} maxLength={180} required /></label><label>Destination<select name="visibility" defaultValue={item.visibility}><option value="vault">Vault — members only</option><option value="library">Library — public</option></select></label></div><label>Status<select name="status" defaultValue={item.status}><option value="published">Published</option><option value="archived">Archived</option><option value="draft">Draft</option></select></label><label>Description<textarea name="description" defaultValue={item.description} rows={3} maxLength={2000} /></label><label>BibTeX citation<textarea name="bibtex" defaultValue={item.bibtex || ""} rows={5} placeholder="Optional valid BibTeX citation" /></label><label className="consent"><input name="public_acknowledged" type="checkbox" value="true" defaultChecked={item.visibility === "library"} /> I understand that a Library destination makes this file and metadata public.</label><div className="actions"><button className="button primary" type="submit">Save metadata</button><button className="button quiet" type="button" onClick={() => remove(item)}>Delete</button></div></form><form className="replace-form" onSubmit={event => replace(event, item)}><label>Replace file<input name="file" type="file" required /></label><input type="hidden" name="title" value={item.title} /><input type="hidden" name="description" value={item.description || ""} /><input type="hidden" name="visibility" value={item.visibility} /><input type="hidden" name="status" value={item.status} /><input type="hidden" name="public_acknowledged" value={item.visibility === "library" ? "true" : "false"} /><button className="button quiet" type="submit">Replace file</button></form></article>)}<div className="actions"><a className="button quiet" href="/vault/">Back to Vault</a></div><div className="status" role="status" aria-live="polite">{message}</div></div>;
}
