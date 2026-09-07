# Unresolved and discarded Graphify relationships

The raw Graphify merge contained model output outside the declared corpus and malformed records. The final graph keeps only records with an allowed repository-relative source, valid node IDs/labels, valid endpoints, relation, confidence, and provenance. No edges were invented.

- Raw nodes: 423; retained nodes: 327; discarded nodes: 96.
- Raw edges: 565; retained edges: 448; discarded edges: 117.
- Dynamic relationships and omitted model relationships remain unresolved rather than being inferred here.

## Discarded node samples

```json
[
  {
    "id": "base-out::public_materials",
    "source_file": null,
    "label": "public.materials"
  },
  {
    "id": "base-out::public_members",
    "source_file": null,
    "label": "public.members"
  },
  {
    "id": "base-out::public_set_material_updated_at",
    "source_file": null,
    "label": "public.set_material_updated_at"
  },
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
    "id": "base-out::src_auth_otp_js",
    "source_file": "src/auth/otp.js",
    "label": "Auth OTP"
  },
  {
    "id": "base-out::src_auth_session_js",
    "source_file": "src/auth/session.js",
    "label": "Auth Session"
  },
  {
    "id": "base-out::src_materials_download_js",
    "source_file": "src/materials/download.js",
    "label": "Materials Download"
  },
  {
    "id": "base-out::src_materials_manage_js",
    "source_file": "src/materials/manage.js",
    "label": "Materials Manage"
  },
  {
    "id": "base-out::src_materials_upload_js",
    "source_file": "src/materials/upload.js",
    "label": "Materials Upload"
  },
  {
    "id": "base-out::src_shared_validators_js",
    "source_file": "src/shared/validators.js",
    "label": "Shared Validators"
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
    "id": "base-out::9",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::aliases",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::auth_identities",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::member_identities",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::migration_006_v2_0_0_people_vault_otp_sql",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::existing_public_member_route_implementation",
    "source_file": "PRODUCT.md#Evidence on Hand",
    "label": "Existing Public/Member Route Implementation"
  },
  {
    "id": "base-out::next_js_app_router",
    "source_file": "PRODUCT.md#Stack",
    "label": "Next.js App Router"
  },
  {
    "id": "base-out::react",
    "source_file": "PRODUCT.md#Stack",
    "label": "React"
  },
  {
    "id": "base-out::member_routes",
    "source_file": "PRODUCT.md#Capabilities and Constraints",
    "label": "Member Routes"
  },
  {
    "id": "base-out::named_investigator_data_and_official_profile_links",
    "source_file": "PRODUCT.md#Evidence on Hand",
    "label": "Named Investigator Data and Official Profile Links"
  },
  {
    "id": "base-out::normalized_member_alias_table",
    "source_file": "PRODUCT.md#Capabilities and Constraints",
    "label": "Normalized Member-Alias Table"
  },
  {
    "id": "base-out::production_supabase_project_and_two_edge_functions",
    "source_file": "PRODUCT.md#Evidence on Hand",
    "label": "Production Supabase Project and Two Edge Functions"
  },
  {
    "id": "base-out::public_routes",
    "source_file": "PRODUCT.md#Capabilities and Constraints",
    "label": "Public Routes"
  },
  {
    "id": "base-out::supabase_authentication_database_storage",
    "source_file": "PRODUCT.md#Stack",
    "label": "Supabase Authentication/Database/Storage"
  },
  {
    "id": "base-out::supabase_edge_functions",
    "source_file": "PRODUCT.md#Stack",
    "label": "Supabase Edge Functions"
  },
  {
    "id": "base-out::supabase_schema_and_policies",
    "source_file": "PRODUCT.md#Evidence on Hand",
    "label": "Supabase Schema and Policies"
  },
  {
    "id": "base-out::supabase_service_role_credentials",
    "source_file": "PRODUCT.md#Capabilities and Constraints",
    "label": "Supabase Service-Role Credentials"
  },
  {
    "id": "base-out::upload_edge_function",
    "source_file": "PRODUCT.md#Capabilities and Constraints",
    "label": "Upload Edge Function"
  },
  {
    "id": "base-out::public_source_register",
    "source_file": "PRODUCT.md#Evidence on Hand",
    "label": "Public Source Register"
  },
  {
    "id": "base-out::10",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::11",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::12",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::13",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::14",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::15",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::16",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::17",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::18",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::19",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::20",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::auth_core_configuration",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::edge_functions",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::materials_bucket_privacy",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::migration_007",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::migration_008",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::migration_009",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::BACKUP_MANIFEST_v1_8_2",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::DESIGN_md",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::EXECUTION_REPORT_v1_8_2",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::EXECUTION_REPORT_v2_0_0",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::PRODUCT_md",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::PROJECT_CONTEXT_v1_8_2",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::README_md",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::codebase_graph",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::docs_SOURCES_md",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::docs_UPLOAD_GUIDE_md",
    "source_file": null,
    "label": null
  },
  {
    "id": "base-out::obsidian_vault",
    "source_file": null,
    "label": null
  },
  {
    "id": "semantic-out-2-0::gh_pages_deployment_commit_d36c2a0",
    "source_file": "gh-pages",
    "label": "Publish v1.6.1 upload remediation"
  },
  {
    "id": "semantic-out-2-0::main_remediation_commit_37b2631",
    "source_file": "main",
    "label": "Fix production upload availability states"
  },
  {
    "id": "semantic-out-2-0::built_in_github_pages_run_31990210789",
    "source_file": "github-pages",
    "label": "GitHub Pages publication"
  },
  {
    "id": "semantic-out-4-0::app_favicon_ico",
    "source_file": "app/favicon.ico",
    "label": "Favicon ICO"
  },
  {
    "id": "semantic-out-5-0::graphify_0_9_30_tool",
    "source_file": null,
    "label": "Graphify 0.9.30 Tool"
  },
  {
    "id": "semantic-out-5-0::ollama_backend",
    "source_file": null,
    "label": "Ollama Backend"
  },
  {
    "id": "semantic-out-5-0::qwen2_5_coder_7b_model",
    "source_file": null,
    "label": "Qwen2.5-coder:7b Model"
  },
  {
    "id": "semantic-out-5-0::supabase_project_zvhachktcgnkxwtdxucj",
    "source_file": null,
    "label": "Supabase Project zvhachktcgnkxwtdxucj"
  },
  {
    "id": "semantic-out-5-1::npm_run_lint",
    "source_file": null,
    "label": "npm run lint"
  },
  {
    "id": "semantic-out-5-1::npm_test",
    "source_file": null,
    "label": "npm test"
  },
  {
    "id": "semantic-out-5-1::impeccable_detect_json_app_components",
    "source_file": null,
    "label": "npx impeccable detect --json app components"
  },
  {
    "id": "semantic-out-5-1::impeccable_doctor",
    "source_file": null,
    "label": "impeccable doctor"
  },
  {
    "id": "semantic-out-5-1::next_public_site_url_build",
    "source_file": null,
    "label": "NEXT_PUBLIC_SITE_URL=https://su2qc.github.io npm run build"
  }
]
```
