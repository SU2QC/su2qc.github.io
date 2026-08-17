# Unresolved and discarded Graphify relationships

The raw Graphify merge contained model output outside the declared corpus and malformed records. The final graph keeps only records with an allowed repository-relative source, valid node IDs/labels, valid endpoints, relation, confidence, and provenance. No edges were invented.

- Raw nodes: 276; retained nodes: 242; discarded nodes: 34.
- Raw edges: 364; retained edges: 333; discarded edges: 31.
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
    "id": "semantic-out-1-0::edge_function_unavailability_error",
    "source_file": null,
    "label": "Edge Function unavailability error"
  },
  {
    "id": "semantic-out-1-0::expired_sessions_error",
    "source_file": null,
    "label": "Expired sessions error"
  },
  {
    "id": "semantic-out-1-0::inactive_members_error",
    "source_file": null,
    "label": "Inactive members error"
  },
  {
    "id": "semantic-out-1-0::invalid_service_response_error",
    "source_file": null,
    "label": "Invalid service response error"
  },
  {
    "id": "semantic-out-1-0::network_cors_failure_error",
    "source_file": null,
    "label": "Network/CORS failure error"
  },
  {
    "id": "semantic-out-1-0::validation_upload_error",
    "source_file": null,
    "label": "Validation/upload error"
  },
  {
    "id": "semantic-out-1-0::built_in_github_pages_run_31990210789",
    "source_file": null,
    "label": "Built-in GitHub Pages run"
  },
  {
    "id": "semantic-out-1-0::gh_pages_deployment_commit_d36c2a0",
    "source_file": null,
    "label": "Publish v1.6.1 upload remediation commit"
  },
  {
    "id": "semantic-out-1-0::main_remediation_commit_37b2631",
    "source_file": null,
    "label": "Fix production upload availability states commit"
  },
  {
    "id": "semantic-out-1-0::materials_upload_endpoint",
    "source_file": null,
    "label": "materials-upload endpoint"
  },
  {
    "id": "semantic-out-1-0::supabase_project_ref_zvhachktcgnkxwtdxucj",
    "source_file": null,
    "label": "Supabase project ref zvhachktcgnkxwtdxucj"
  },
  {
    "id": "semantic-out-1-0::material_download_endpoint",
    "source_file": null,
    "label": "material-download endpoint"
  },
  {
    "id": "semantic-out-2-1::graphify_cli",
    "source_file": null,
    "label": "Graphify CLI"
  },
  {
    "id": "semantic-out-2-1::ollama_backend",
    "source_file": null,
    "label": "Ollama backend"
  },
  {
    "id": "semantic-out-2-1::qwen2_5_coder_7b",
    "source_file": null,
    "label": "qwen2.5-coder:7b"
  }
]
```
