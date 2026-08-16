"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { formatCitation } from "../lib/bibtex.mjs";
import { createClient } from "../lib/supabase/client";
import { getPublicConfig } from "../lib/supabase/config";

export function LibraryList() {
  const [items, setItems] = useState([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error } = await createClient().from("materials_public").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (!cancelled) setItems(data || []);
      } catch {
        if (!cancelled) setConfigured(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const shown = useMemo(() => items.filter(i => `${i.title} ${i.description} ${i.display_name}`.toLowerCase().includes(q.toLowerCase())), [items, q]);
  const downloadUrl = id => `${getPublicConfig().url.replace(/\/$/, "")}/functions/v1/material-download?id=${encodeURIComponent(id)}`;

  return <div><label className="search"><Search size={18}/><span className="sr-only">Search materials</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search title, description, or contributor"/></label>{loading&&<div className="empty" role="status">Loading public materials…</div>}{!loading&&!configured&&<div className="empty"><h2>Library ready for connection</h2><p>Sample content is intentionally not fabricated. Configure Supabase and uploaded materials will appear here.</p></div>}{!loading&&configured&&shown.length===0&&<div className="empty"><h2>No public materials yet</h2><p>Approved members can add the first presentation from the member upload page.</p></div>}<div className="material-list">{shown.map(i=><article key={i.id}><FileText/><div><div className="material-meta">{i.file_type || "Research material"} · {new Date(i.created_at).toLocaleDateString()}</div><h2>{i.title}</h2><p>{i.description}</p>{i.citation_json&&<p className="citation">{formatCitation(i.citation_json)}</p>}<span>Shared by {i.display_name}</span></div><a className="button quiet" href={downloadUrl(i.id)}>Open</a></article>)}</div></div>;
}
