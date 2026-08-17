# Unresolved and discarded Graphify relationships

The raw Graphify merge contained model output outside the declared corpus and malformed records. The final graph keeps only records with an allowed repository-relative source, valid node IDs/labels, valid endpoints, relation, confidence, and provenance. No edges were invented.

- Raw nodes: 221; retained nodes: 193; discarded nodes: 28.
- Raw edges: 296; retained edges: 271; discarded edges: 25.
- Dynamic relationships and omitted model relationships remain unresolved rather than being inferred here.

## Discarded node samples

```json
[
  {
    "id": "base-out::supabase_migrations_001_initial_sql_public",
    "source_file": null,
    "label": "public"
  },
  {
    "id": "base-out::supabase_migrations_002_live_supabase_bootstrap_sql_public",
    "source_file": null,
    "label": "public"
  },
  {
    "id": "base-out::next_next",
    "source_file": "next",
    "label": "next"
  },
  {
    "id": "base-out::uv_tool_install_command",
    "source_file": null,
    "label": "UV Tool Install Command"
  },
  {
    "id": "base-out::ollama_backend",
    "source_file": null,
    "label": "Ollama Backend"
  },
  {
    "id": "base-out::openai_package",
    "source_file": null,
    "label": "OpenAI Package"
  },
  {
    "id": "base-out::tree_sitter_sql",
    "source_file": null,
    "label": "Tree Sitter SQL"
  },
  {
    "id": "base-out::next_js_app_router",
    "source_file": "next.config.js",
    "label": "Next.js App Router"
  },
  {
    "id": "base-out::setup_py",
    "source_file": "setup.py",
    "label": "Setup"
  },
  {
    "id": "base-out::supabase_authentication_database_storage",
    "source_file": "supabase/config.js",
    "label": "Supabase Authentication/Database/Storage"
  },
  {
    "id": "base-out::supabase_edge_functions",
    "source_file": "supabase/edge-functions/upload.js",
    "label": "Supabase Edge Functions"
  },
  {
    "id": "base-out::1",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::2",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::3",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::4",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::5",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::6",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::7",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::8",
    "source_file": null,
    "label": null
  },
  {
    "id": "semantic-out-1::edge_function_unavailability",
    "source_file": null,
    "label": "Edge Function unavailability"
  },
  {
    "id": "semantic-out-1::expired_sessions",
    "source_file": null,
    "label": "Expired sessions"
  },
  {
    "id": "semantic-out-1::inactive_members",
    "source_file": null,
    "label": "Inactive members"
  },
  {
    "id": "semantic-out-1::invalid_service_responses",
    "source_file": null,
    "label": "Invalid service responses"
  },
  {
    "id": "semantic-out-1::network_cors_failure",
    "source_file": null,
    "label": "Network/CORS failure"
  },
  {
    "id": "semantic-out-1::validation_upload_errors",
    "source_file": null,
    "label": "Validation/upload errors"
  },
  {
    "id": "semantic-out-1::materials_upload_endpoint",
    "source_file": null,
    "label": "materials-upload endpoint"
  },
  {
    "id": "semantic-out-1::supabase_project_zvhachktcgnkxwtdxucj",
    "source_file": null,
    "label": "Supabase project zvhachktcgnkxwtdxucj"
  },
  {
    "id": "semantic-out-1::material_download_endpoint",
    "source_file": null,
    "label": "material-download endpoint"
  }
]
```
