"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Search } from "lucide-react";
import { formatCitation } from "../lib/bibtex.mjs";
import { createClient } from "../lib/supabase/client";
import { getPublicConfig } from "../lib/supabase/config";

export function VaultList() {
  const [state, setState] = useState({ status: "loading" });
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [downloadState, setDownloadState] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const client = createClient();
        const { data: userData, error: userError } = await client.auth.getUser();
        if (userError || !userData?.user) { window.location.replace("/login/?next=/vault/"); return; }
        const { data: member, error: memberError } = await client.from("members").select("id,active").maybeSingle();
        if (memberError) throw memberError;
        if (!member?.active) { if (!cancelled) setState({ status: "denied" }); return; }
        const { data, error } = await client.from("materials_member").select("id,title,description,citation_json,file_name,file_type,mime_type,status,visibility,created_at,updated_at,display_name").order("updated_at", { ascending: false });
        if (error) throw error;
        if (!cancelled) setState({ status: "ready", items: data || [] });
      } catch { if (!cancelled) setState({ status: "error" }); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const items = useMemo(() => state.items || [], [state.items]);
  const shown = useMemo(() => items.filter(item => (type === "all" || item.file_type === type) && `${item.title} ${item.description} ${item.display_name} ${item.visibility}`.toLowerCase().includes(query.toLowerCase())), [items, query, type]);

  async function download(id, fileName) {
    setDownloadState(id);
    try {
      const client = createClient();
      const { data: sessionData } = await client.auth.getSession();
      const config = getPublicConfig();
      const response = await fetch(`${config.url}/functions/v1/material-download?id=${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${sessionData.session?.access_token || ""}`, apikey: config.key } });
      if (!response.ok) throw new Error("download");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = fileName || "material"; link.click();
      URL.revokeObjectURL(url);
    } catch { setDownloadState("error"); }
    finally { setDownloadState(value => value === "error" ? value : ""); }
  }

  if (state.status === "loading") return <div className="empty" role="status">Checking member access…</div>;
  if (state.status === "denied") return <div className="empty"><h2>Member approval required</h2><p>This space is available only to active SU2QC members.</p></div>;
  if (state.status === "error") return <div className="empty"><h2>Vault unavailable</h2><p>Your session or the member service could not be verified. Sign in again and retry.</p></div>;
  return <div><div className="vault-tools"><label className="search"><Search size={18}/><span className="sr-only">Search Vault</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search title, description, or contributor" /></label><label>File type<select value={type} onChange={event => setType(event.target.value)}><option value="all">All types</option>{[...new Set(items.map(item => item.file_type).filter(Boolean))].map(value => <option key={value} value={value}>{value}</option>)}</select></label></div>{shown.length === 0 ? <div className="empty"><h2>No Vault materials yet</h2><p>Upload a member-only working material, or broaden your search.</p></div> : <div className="material-list">{shown.map(item => <article key={item.id}><FileText/><div><div className="material-meta">{item.file_type || "Research material"} · {item.visibility === "vault" ? "Vault" : "Library"} · Updated {new Date(item.updated_at || item.created_at).toLocaleDateString()}</div><h2>{item.title}</h2><p>{item.description}</p>{item.citation_json && <p className="citation">{formatCitation(item.citation_json)}</p>}<span>Shared by {item.display_name}</span></div><button className="button quiet" type="button" onClick={() => download(item.id, item.file_name)} disabled={downloadState === item.id}><Download size={16}/>{downloadState === item.id ? "Opening…" : "Open"}</button></article>)}</div>}<div className="actions"><a className="button primary" href="/upload/">Upload material</a><a className="button quiet" href="/my-materials/">Manage my materials</a></div>{downloadState === "error" && <p className="status" role="status">The download could not be completed. Your session may have expired.</p>}</div>;
}
