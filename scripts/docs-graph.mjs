import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const tmp = path.join(root, ".codex-tmp", "docs-graph-v181");
const graphDir = path.join(root, "docs", "codebase-graph");
const vaultDir = path.join(root, "docs", "obsidian-vault");
const graphPath = path.join(graphDir, "graph.json");
const mapNote = "SU2QC Codebase Map.md";
const majorNotes = [
  "System Architecture.md", "Repository Structure.md", "Application Routes.md", "React Components.md",
  "Investigator Images.md", "Authentication Flow.md", "Approved Member Authorization.md", "Upload Flow.md",
  "Library Rendering.md", "Signed Download Flow.md", "Supabase Data Model.md", "Row-Level Security.md",
  "Private Storage Security.md", "Edge Functions.md", "Environment Variables.md", "Static Export.md",
  "GitHub Pages Deployment.md", "Local Testing.md", "Production Browser Validation.md", "Security Model.md",
  "Operational Runbook.md", "Known Limitations.md", "Execution Report Index.md", "Graphify Coverage and Limitations.md",
];

const exclusions = {
  ".env.example": "Graphify classifies the example environment file as unsupported; retained in the repository but excluded from the graph corpus.",
  ".gitignore": "Git metadata instructions are not a source module and Graphify classifies this file as unsupported.",
  "app/favicon.ico": "Binary favicon is audited separately; Graphify classifies ICO as unsupported.",
  "app/globals.css": "Graphify 0.9.45 classifies this CSS file as unsupported; styling remains covered by the source audit and local tests.",
  "package-lock.json": "Dependency lockfile is intentionally excluded from the Graphify corpus; package.json and the installed dependency graph remain included.",
  "docs/BACKUP_MANIFEST_v1.8.2.json": "Machine-readable backup manifest is validated separately; Graphify 0.9.45 produces no source node for this JSON artifact.",
  "docs/codebase-graph/": "Generated Graphify output is a result, not extraction input.",
  "docs/obsidian-vault/": "Generated Obsidian output is a result, not extraction input.",
};

const run = (command, args, options = {}) => execFileSync(command, args, { cwd: root, stdio: "inherit", ...options });
const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};
const safeName = value => value.replace(/[^A-Za-z0-9_.-]+/g, "_").replace(/^_+|_+$/g, "") || "node";
const wiki = file => `[[${file.replace(/\.md$/i, "")}]]`;
const trackedFiles = () => execFileSync("git", ["--git-dir=.release-git/.git", "ls-files"], { cwd: root, encoding: "utf8" }).trim().split("\n").filter(Boolean);
const isExcluded = file => Object.keys(exclusions).some(pattern => pattern.endsWith("/") ? file.startsWith(pattern) : file === pattern);
const includedFiles = () => trackedFiles().filter(file => !isExcluded(file));
const semanticFiles = files => files.filter(file => /\.(md|pdf|png|jpe?g|webp|gif)$/i.test(file));

function stageHead(stage) {
  fs.mkdirSync(stage, { recursive: true });
  const archive = path.join(tmp, "source.tar");
  run("git", ["--git-dir=.release-git/.git", "archive", "--format=tar", `--output=${archive}`, "HEAD"]);
  run("tar", ["-x", "-C", stage, "-f", archive]);
  for (const generated of ["docs/codebase-graph", "docs/obsidian-vault"]) {
    fs.rmSync(path.join(stage, generated), { recursive: true, force: true });
  }
}

function graphSources(graph) {
  return new Set(graph.nodes.map(node => String(node.source_file || "").replace(/^\.\//, "")).filter(Boolean));
}

function createSemanticRetry(stage, relativeFile, index) {
  const source = fs.readFileSync(path.join(stage, relativeFile), "utf8");
  const lines = source.split("\n");
  const size = source.length > 6000 ? 70 : lines.length;
  const chunks = [];
  for (let start = 0; start < lines.length; start += size) chunks.push(lines.slice(start, start + size).join("\n"));
  const outputs = [];
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const mini = path.join(tmp, `semantic-${index}-${chunkIndex}`);
    fs.mkdirSync(path.join(mini, path.dirname(relativeFile)), { recursive: true });
    fs.writeFileSync(path.join(mini, relativeFile), chunks[chunkIndex]);
    const out = path.join(tmp, `semantic-out-${index}-${chunkIndex}`);
    try {
      run("graphify", ["extract", mini, "--out", out, "--no-gitignore", "--backend=ollama", "--model=qwen2.5-coder:7b", "--max-concurrency=1", "--api-timeout=120", "--token-budget=2000", "--force"]);
      outputs.push(path.join(out, "graphify-out", "graph.json"));
    } catch (error) {
      console.warn(`Semantic retry chunk failed for ${relativeFile}; continuing with remaining chunks.`);
    }
  }
  if (!outputs.length) console.warn(`Semantic retry failed for ${relativeFile}; retaining the base graph and recording the omission.`);
  return outputs;
}

function normalizeAndFilter(raw, allowed) {
  const allowedSet = new Set(allowed);
  const nodes = raw.nodes.filter(node => allowedSet.has(String(node.source_file || "").replace(/^\.\//, "")) && node.id && node.label);
  const ids = new Set(nodes.map(node => node.id));
  const links = raw.links.filter(link => ids.has(link.source) && ids.has(link.target) && link.relation && link.confidence && allowedSet.has(String(link.source_file || "").replace(/^\.\//, "")));
  const hyperedges = (raw.hyperedges || []).map(edge => ({ ...edge, nodes: (edge.nodes || []).filter(id => ids.has(id)) })).filter(edge => edge.id && edge.nodes.length >= 2);
  return {
    directed: Boolean(raw.directed),
    multigraph: Boolean(raw.multigraph),
    graph: { ...(raw.graph || {}), graphify_version: "0.9.45", source_commit: execFileSync("git", ["--git-dir=.release-git/.git", "rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim() },
    nodes,
    links,
    hyperedges,
  };
}

function writeManifests(included, raw, finalGraph) {
  writeJson(path.join(graphDir, "included-files.json"), {
    generated_by: "Graphify 0.9.45",
    source_commit: finalGraph.graph.source_commit,
    total: included.length,
    files: included,
    graph_nodes_by_source: Object.fromEntries(included.map(file => [file, finalGraph.nodes.filter(node => node.source_file === file).length])),
  });
  writeJson(path.join(graphDir, "exclusions.json"), { generated_by: "Graphify 0.9.45", files: exclusions, total: Object.keys(exclusions).length });
  const typeCounts = Object.fromEntries([...new Set(finalGraph.nodes.map(node => node.file_type || "unknown"))].sort().map(type => [type, finalGraph.nodes.filter(node => (node.file_type || "unknown") === type).length]));
  const edgeCounts = Object.fromEntries([...new Set(finalGraph.links.map(link => link.relation))].sort().map(type => [type, finalGraph.links.filter(link => link.relation === type).length]));
  const provenance = Object.fromEntries([...new Set(finalGraph.links.map(link => link.confidence))].sort().map(type => [type, finalGraph.links.filter(link => link.confidence === type).length]));
  writeJson(path.join(graphDir, "statistics.json"), {
    generated_by: "Graphify 0.9.45",
    source_commit: finalGraph.graph.source_commit,
    included_files: included.length,
    nodes: finalGraph.nodes.length,
    edges: finalGraph.links.length,
    hyperedges: finalGraph.hyperedges.length,
    communities: new Set(finalGraph.nodes.map(node => node.community).filter(value => value !== undefined)).size,
    node_types: typeCounts,
    edge_types: edgeCounts,
    provenance,
    raw_nodes: raw.nodes.length,
    raw_edges: raw.links.length,
    discarded_nodes: raw.nodes.length - finalGraph.nodes.length,
    discarded_edges: raw.links.length - finalGraph.links.length,
  });
  const discardedSources = raw.nodes.filter(node => !included.includes(String(node.source_file || "").replace(/^\.\//, ""))).map(node => ({ id: node.id, source_file: node.source_file || null, label: node.label || null }));
  fs.writeFileSync(path.join(graphDir, "unresolved-relationships.md"), [
    "# Unresolved and discarded Graphify relationships",
    "",
    "The raw Graphify merge contained model output outside the declared corpus and malformed records. The final graph keeps only records with an allowed repository-relative source, valid node IDs/labels, valid endpoints, relation, confidence, and provenance. No edges were invented.",
    "",
    `- Raw nodes: ${raw.nodes.length}; retained nodes: ${finalGraph.nodes.length}; discarded nodes: ${raw.nodes.length - finalGraph.nodes.length}.`,
    `- Raw edges: ${raw.links.length}; retained edges: ${finalGraph.links.length}; discarded edges: ${raw.links.length - finalGraph.links.length}.`,
    "- Dynamic relationships and omitted model relationships remain unresolved rather than being inferred here.",
    "",
    "## Discarded node samples",
    "",
    "```json",
    JSON.stringify(discardedSources.slice(0, 80), null, 2),
    "```",
    "",
  ].join("\n"));
}

function writeGraphReport(graph) {
  const stats = readJson(path.join(graphDir, "statistics.json"));
  const sourceRows = Object.entries(readJson(path.join(graphDir, "included-files.json")).graph_nodes_by_source).map(([file, count]) => `| \`${file}\` | ${count} |`).join("\n");
  fs.writeFileSync(path.join(graphDir, "GRAPH_REPORT.md"), [
    "# SU2QC Graphify 0.9.45 report", "", "This report describes the authentic Graphify extraction and merge after validation. Graphify-native node IDs are preserved. Out-of-scope or malformed model records are counted in `unresolved-relationships.md` and are not repaired.", "",
    `- Source commit: \`${graph.graph.source_commit}\``, `- Nodes: ${stats.nodes}; edges: ${stats.edges}; hyperedges: ${stats.hyperedges}; communities: ${stats.communities}.`, `- Edge provenance: ${Object.entries(stats.provenance).map(([key, value]) => `${key}=${value}`).join(", ") || "none"}.`, `- Graphify input: ${stats.included_files} included files; ${Object.keys(exclusions).length} documented exclusions.`, "",
    "## Node types", "", ...Object.entries(stats.node_types).map(([key, value]) => `- ${key}: ${value}`), "", "## Edge types", "", ...Object.entries(stats.edge_types).map(([key, value]) => `- ${key}: ${value}`), "", "## Source coverage", "", "| Repository file | Graph nodes |", "|---|---:|", sourceRows, "", "## Limitations", "", "Static AST extraction cannot prove runtime or dynamic relationships. The local Ollama model produced some omitted or malformed semantic records; only valid, in-scope Graphify records were retained. See `unresolved-relationships.md`.", "",
  ].join("\n"));
}

function generateVault(graph) {
  fs.mkdirSync(vaultDir, { recursive: true });
  const mapping = [];
  const noteById = new Map();
  for (const node of graph.nodes) {
    const file = `${safeName(node.id)}.md`;
    noteById.set(node.id, file);
    mapping.push({ graphify_node_id: node.id, source_object: node.label, source_file: node.source_file, obsidian_note: file, heading: null });
  }
  const outgoing = new Map(graph.nodes.map(node => [node.id, []]));
  const incoming = new Map(graph.nodes.map(node => [node.id, []]));
  for (const edge of graph.links) {
    outgoing.get(edge.source)?.push(edge.target);
    incoming.get(edge.target)?.push(edge.source);
  }
  const nodeNote = node => {
    const links = [...new Set((outgoing.get(node.id) || []).map(id => noteById.get(id)).filter(Boolean))];
    const incomingLinks = [...new Set((incoming.get(node.id) || []).map(id => noteById.get(id)).filter(Boolean))];
    return [
      "---", `graphify_id: ${node.id}`, `source_file: ${node.source_file}`, `node_type: ${node.file_type || "unknown"}`, "tags: [su2qc, graphify]", "---", "",
      `# ${node.label}`, "", `Purpose: Graphify extracted this ${node.file_type || "node"} from the repository.`, "",
      `Graphify node ID: \`${node.id}\``, `Repository source: \`${node.source_file}\``, `Node type: \`${node.file_type || "unknown"}\``, `Source commit: \`${graph.graph.source_commit}\``, "",
      "## Important symbols", "", `- ${node.label}`, "", "## Incoming dependencies", "", incomingLinks.length ? incomingLinks.map(file => `- ${wiki(file)}`).join("\n") : "- None recorded.", "",
      "## Outgoing dependencies", "", links.length ? links.map(file => `- ${wiki(file)}`).join("\n") : "- None recorded.", "",
      "## Responsibilities and security relevance", "", "Runtime responsibilities and security relevance are limited to what Graphify and the repository source establish; dynamic behavior remains subject to the execution reports.", "",
      `Related map: ${wiki(mapNote)}`, "",
    ].join("\n");
  };
  for (const node of graph.nodes) fs.writeFileSync(path.join(vaultDir, noteById.get(node.id)), nodeNote(node));
  const nodeLinks = graph.nodes.slice(0, 120).map(node => `- ${wiki(noteById.get(node.id))}`).join("\n");
  const mapContent = [
    "---", "title: SU2QC Codebase Map", "tags: [su2qc, graphify, map]", `source_commit: ${graph.graph.source_commit}`, "---", "",
    "# SU2QC Codebase Map", "", "Graphify-derived navigation for the first-party SU2QC repository. Node IDs and relationships come from Graphify 0.9.45; inferred relationships are not static proof.", "",
    "## Subsystems", "", majorNotes.map(wiki).map(link => `- ${link}`).join("\n"), "", "## Graph coverage", "", `- Nodes: ${graph.nodes.length}; edges: ${graph.links.length}; source commit: \`${graph.graph.source_commit}\`.`, `- ${wiki("Graphify Coverage and Limitations.md")}`, "", "## Graph nodes", "", nodeLinks, "",
  ].join("\n");
  fs.writeFileSync(path.join(vaultDir, mapNote), mapContent);
  const subsystemText = {
    "System Architecture.md": "Frontend routes and components connect to Supabase Auth, approved-member authorization, Edge Functions, private storage, and the library.",
    "Repository Structure.md": "The repository separates App Router routes, components, data, shared libraries, Supabase functions/migrations, tests, and public assets.",
    "Application Routes.md": "The public routes are home, research, people, and library; login and upload are member surfaces.",
    "React Components.md": "Reusable components cover headers, footers, section introductions, login, upload, and library rendering.",
    "Investigator Images.md": "People data maps four investigators to four emitted public image assets; source-image audit evidence is recorded in the execution report.",
    "Authentication Flow.md": "The browser login flow uses Supabase Auth and redirects unauthenticated users away from member routes.",
    "Approved Member Authorization.md": "Server-side authorization is based on the active approved member record and is enforced again in Edge Functions.",
    "Upload Flow.md": "The upload form validates usability in the browser and calls the authenticated materials-upload Edge Function.",
    "Library Rendering.md": "The library reads public metadata and renders BibTeX or material descriptions for approved content.",
    "Signed Download Flow.md": "The material-download Edge Function authorizes access and returns a signed private-storage download.",
    "Supabase Data Model.md": "SQL migrations define members, materials, storage, grants, and ownership relationships.",
    "Row-Level Security.md": "RLS protects public members/materials data and limits authenticated operations to the reviewed model.",
    "Private Storage Security.md": "The materials bucket remains private; access is mediated by policies and signed downloads.",
    "Edge Functions.md": "The upload and download functions hold trusted validation, authorization, CORS, and storage operations.",
    "Environment Variables.md": "Only public browser configuration belongs in the static client; service-role access remains inside trusted functions.",
    "Static Export.md": "Next.js emits the public application into the static output used by Pages delivery.",
    "GitHub Pages Deployment.md": "Release Git is stored in .release-git/.git and the organization remote is the only approved deployment remote.",
    "Local Testing.md": "Node tests, lint, build, static route checks, image checks, and responsive checks are run locally.",
    "Production Browser Validation.md": "The prior genuine Chrome gate covered login, upload, library, signed download, denials, hashes, and cleanup.",
    "Security Model.md": "The security boundary combines browser usability checks, Auth, active-member authorization, RLS, private storage, and Edge Functions.",
    "Operational Runbook.md": "Read current reports, preserve release boundaries, use fresh disposable browser contexts, and record exact evidence.",
    "Known Limitations.md": "Graphify cannot statically prove dynamic relationships; dashboard-only Auth plan settings and live warnings remain operational evidence.",
    "Execution Report Index.md": "Execution reports document the v1.6 through v1.8 gates, evidence classes, blockers, and deployment identifiers.",
    "Graphify Coverage and Limitations.md": "The graph is a filtered, validated Graphify merge. Out-of-scope model output and malformed records were discarded and counted.",
  };
  for (const note of majorNotes) {
    const related = graph.nodes.filter(node => String(node.source_file || "").startsWith(note.split(" ")[0].toLowerCase())).slice(0, 8).map(node => wiki(noteById.get(node.id)));
    fs.writeFileSync(path.join(vaultDir, note), ["---", `title: ${note.replace(/\.md$/, "")}`, "tags: [su2qc, subsystem]", `source_commit: ${graph.graph.source_commit}`, "---", "", `# ${note.replace(/\.md$/, "")}`, "", subsystemText[note], "", `Map: ${wiki(mapNote)}`, "", "## Related Graphify nodes", "", related.length ? related.map(link => `- ${link}`).join("\n") : "- See the graph coverage note and source-specific notes.", ""].join("\n"));
  }
  writeJson(path.join(vaultDir, "Graphify node mapping.json"), { graphify_version: "0.9.45", source_commit: graph.graph.source_commit, mapping });
  const canvasGroups = [
    ["frontend", "Frontend", ["Repository Structure.md", "Application Routes.md", "React Components.md", "Library Rendering.md"]],
    ["auth", "Authentication and authorization", ["Authentication Flow.md", "Approved Member Authorization.md", "Security Model.md"]],
    ["functions", "Edge Functions", ["Upload Flow.md", "Signed Download Flow.md", "Edge Functions.md"]],
    ["data", "Database and storage", ["Supabase Data Model.md", "Row-Level Security.md", "Private Storage Security.md"]],
    ["people", "People and assets", ["Investigator Images.md"]],
    ["deploy", "Deployment", ["Static Export.md", "GitHub Pages Deployment.md"]],
    ["test", "Testing", ["Local Testing.md", "Production Browser Validation.md"]],
  ];
  const canvasNodes = [], canvasEdges = [];
  for (let i = 0; i < canvasGroups.length; i++) {
    const [id, label, files] = canvasGroups[i];
    canvasNodes.push({ id: `group-${id}`, type: "group", x: i * 260, y: 0, width: 230, height: 520, label });
    files.forEach((file, j) => canvasNodes.push({ id: `${id}-${j}`, type: "file", file, x: i * 260 + 20, y: 60 + j * 130, width: 190, height: 80 }));
  }
  const flow = ["Application Routes.md", "Authentication Flow.md", "Approved Member Authorization.md", "Upload Flow.md", "Private Storage Security.md", "Supabase Data Model.md", "Library Rendering.md", "Signed Download Flow.md"];
  for (let i = 0; i < flow.length - 1; i++) canvasEdges.push({ id: `flow-${i}`, fromNode: flow[i].replace(/[^A-Za-z0-9]/g, "-").toLowerCase(), toNode: flow[i + 1].replace(/[^A-Za-z0-9]/g, "-").toLowerCase(), fromSide: "right", toSide: "left", label: "supports" });
  const fileNode = new Map(canvasNodes.filter(node => node.type === "file").map(node => [node.file, node.id]));
  const fixedEdges = [
    ["Application Routes.md", "Authentication Flow.md"], ["Authentication Flow.md", "Approved Member Authorization.md"], ["Approved Member Authorization.md", "Upload Flow.md"], ["Upload Flow.md", "Private Storage Security.md"], ["Private Storage Security.md", "Supabase Data Model.md"], ["Supabase Data Model.md", "Library Rendering.md"], ["Library Rendering.md", "Signed Download Flow.md"],
    ["Repository Structure.md", "Investigator Images.md"], ["Investigator Images.md", "Static Export.md"], ["Static Export.md", "GitHub Pages Deployment.md"], ["Local Testing.md", "Production Browser Validation.md"],
  ];
  canvasEdges.length = 0;
  fixedEdges.forEach(([from, to], i) => canvasEdges.push({ id: `edge-${i}`, fromNode: fileNode.get(from), toNode: fileNode.get(to), fromSide: "right", toSide: "left" }));
  writeJson(path.join(vaultDir, "SU2QC Architecture.canvas"), { nodes: canvasNodes, edges: canvasEdges });
}

function build() {
  fs.mkdirSync(tmp, { recursive: true });
  const allowed = includedFiles();
  const rawPath = path.join(tmp, "merged.json");
  let missing = [];
  let failedRetries = [];
  if (process.env.SU2QC_GRAPH_REUSE !== "1" || !fs.existsSync(rawPath)) {
    const stage = path.join(tmp, "input");
    stageHead(stage);
    const baseOut = path.join(tmp, "base-out");
    run("graphify", ["extract", stage, "--out", baseOut, "--no-gitignore", "--backend=ollama", "--model=qwen2.5-coder:7b", "--max-concurrency=1", "--api-timeout=120", "--token-budget=8000", "--force"]);
    const baseGraphPath = path.join(baseOut, "graphify-out", "graph.json");
    const baseGraph = readJson(baseGraphPath);
    missing = semanticFiles(allowed).filter(file => !graphSources(baseGraph).has(file));
    const graphPaths = [baseGraphPath];
    missing.forEach((file, index) => {
      const retry = createSemanticRetry(stage, file, index);
      if (retry.length) graphPaths.push(...retry);
      else failedRetries.push(file);
    });
    if (graphPaths.length === 1) fs.copyFileSync(graphPaths[0], rawPath);
    else run("graphify", ["merge-graphs", ...graphPaths, "--out", rawPath]);
    writeJson(path.join(tmp, "missing-semantic.json"), { missing, failed_retries: failedRetries });
  } else if (fs.existsSync(path.join(tmp, "missing-semantic.json"))) {
    const retryState = readJson(path.join(tmp, "missing-semantic.json"));
    missing = Array.isArray(retryState) ? retryState : retryState.missing || [];
    failedRetries = Array.isArray(retryState) ? [] : retryState.failed_retries || [];
  } else {
    missing = fs.readdirSync(tmp).filter(name => /^semantic-out-\d+$/.test(name)).flatMap(name => {
      const file = path.join(tmp, name, "graphify-out", "graph.json");
      return fs.existsSync(file) ? [...graphSources(readJson(file))] : [];
    }).filter((file, index, files) => semanticFiles(allowed).includes(file) && files.indexOf(file) === index);
  }
  const raw = readJson(rawPath);
  const finalGraph = normalizeAndFilter(raw, allowed);
  fs.mkdirSync(graphDir, { recursive: true });
  writeJson(graphPath, finalGraph);
  const clusterDir = path.join(tmp, "final");
  fs.rmSync(clusterDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(clusterDir, "graphify-out"), { recursive: true });
  fs.copyFileSync(graphPath, path.join(clusterDir, "graphify-out", "graph.json"));
  const final = readJson(graphPath);
  writeManifests(allowed, raw, final);
  writeGraphReport(final);
  run("graphify", ["export", "html"], { cwd: clusterDir });
  run("graphify", ["export", "graphml"], { cwd: clusterDir });
  for (const artifact of ["graph.html", "graph.graphml"]) {
    const source = path.join(clusterDir, "graphify-out", artifact);
    if (fs.existsSync(source)) fs.copyFileSync(source, path.join(graphDir, artifact));
  }
  writeJson(path.join(graphDir, "generation-metadata.json"), { graphify_version: "0.9.45", semantic_backend: "ollama", semantic_model: "qwen2.5-coder:7b", max_concurrency: 1, api_timeout_seconds: 120, source_commit: final.graph.source_commit, input_stage: "git archive HEAD", missing_semantic_retries: missing, failed_semantic_retries: failedRetries, raw_graph: "Graphify merge of full extraction plus per-file Graphify retries", generated_at_utc: new Date().toISOString() });
  generateVault(final);
  console.log(`Graph artifacts written: ${final.nodes.length} nodes, ${final.links.length} edges, ${missing.length} semantic retries.`);
}

function validate() {
  const errors = [];
  const graph = readJson(graphPath);
  const included = readJson(path.join(graphDir, "included-files.json"));
  const ids = new Set(graph.nodes.map(node => node.id));
  if (ids.size !== graph.nodes.length) errors.push("duplicate graph node IDs");
  for (const edge of graph.links) {
    if (!ids.has(edge.source) || !ids.has(edge.target)) errors.push(`dangling edge ${edge.source} -> ${edge.target}`);
    if (!edge.relation || !edge.confidence || !edge.source_file) errors.push("edge missing relation, confidence, or source_file");
  }
  const sourceCoverage = new Map(included.files.map(file => [file, graph.nodes.filter(node => node.source_file === file).length]));
  const missing = [...sourceCoverage].filter(([, count]) => count === 0).map(([file]) => file);
  if (missing.length) errors.push(`included files without graph nodes: ${missing.join(", ")}`);
  if (!graph.graph.source_commit || graph.graph.source_commit.length !== 40) errors.push("graph source commit metadata missing");
  const text = fs.readFileSync(graphPath, "utf8");
  if (/\/home\/|file:\/\/|BEGIN (RSA|OPENSSH) PRIVATE KEY|service_role|sb_secret_|Bearer\s+[A-Za-z0-9._-]{20,}|eyJ[A-Za-z0-9_-]{30,}/i.test(text)) errors.push("secret or machine-specific path detected in graph");
  const mapping = readJson(path.join(vaultDir, "Graphify node mapping.json"));
  const mapped = new Set(mapping.mapping.map(item => item.graphify_node_id));
  if (mapped.size !== graph.nodes.length || [...ids].some(id => !mapped.has(id))) errors.push("Graphify node mapping is incomplete");
  const noteFiles = new Set(fs.readdirSync(vaultDir).filter(file => file.endsWith(".md")));
  const links = /\[\[([^\]]+)\]\]/g;
  for (const file of noteFiles) {
    const content = fs.readFileSync(path.join(vaultDir, file), "utf8");
    let match;
    while ((match = links.exec(content))) if (!noteFiles.has(`${match[1]}.md`)) errors.push(`broken wiki link in ${file}: ${match[1]}`);
    if (file !== mapNote && !content.includes(wiki(mapNote))) errors.push(`note does not link to map: ${file}`);
    if (/\/home\/|file:\/\/|BEGIN (RSA|OPENSSH) PRIVATE KEY|service_role|sb_secret_|Bearer\s+[A-Za-z0-9._-]{20,}|eyJ[A-Za-z0-9_-]{30,}/i.test(content)) errors.push(`secret or machine-specific path in ${file}`);
  }
  const canvas = readJson(path.join(vaultDir, "SU2QC Architecture.canvas"));
  const canvasFiles = new Set(canvas.nodes.filter(node => node.type === "file").map(node => node.file));
  for (const file of canvasFiles) if (!noteFiles.has(file)) errors.push(`canvas points to missing note: ${file}`);
  for (const edge of canvas.edges) if (!canvas.nodes.some(node => node.id === edge.fromNode) || !canvas.nodes.some(node => node.id === edge.toNode)) errors.push("canvas contains dangling edge");
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; return; }
  console.log(`Knowledge artifacts PASS: ${graph.nodes.length} mapped nodes, ${graph.links.length} valid edges, ${noteFiles.size} notes.`);
}

if (process.argv[2] === "validate") validate();
else build();
