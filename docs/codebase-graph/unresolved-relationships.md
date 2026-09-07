# Unresolved and discarded Graphify relationships

The raw Graphify merge contained model output outside the declared corpus and malformed records. The final graph keeps only records with an allowed repository-relative source, valid node IDs/labels, valid endpoints, relation, confidence, and provenance. No edges were invented.

- Raw nodes: 409; retained nodes: 324; discarded nodes: 85.
- Raw edges: 551; retained edges: 448; discarded edges: 103.
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
    "id": "base-out::src_auth_migration_js",
    "source_file": "src/auth/migration.js",
    "label": "Auth migration"
  },
  {
    "id": "base-out::src_auth_otp_js",
    "source_file": "src/auth/otp.js",
    "label": "Auth OTP"
  },
  {
    "id": "base-out::src_auth_session_js",
    "source_file": "src/auth/session.js",
    "label": "Auth session"
  },
  {
    "id": "base-out::src_materials_download_js",
    "source_file": "src/materials/download.js",
    "label": "Materials download"
  },
  {
    "id": "base-out::src_materials_manage_js",
    "source_file": "src/materials/manage.js",
    "label": "Materials manage"
  },
  {
    "id": "base-out::src_materials_upload_js",
    "source_file": "src/materials/upload.js",
    "label": "Materials upload"
  },
  {
    "id": "base-out::src_materials_validation_js",
    "source_file": "src/materials/validation.js",
    "label": "Materials validation"
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
    "id": "base-out::normalized_member_alias_table",
    "source_file": "PRODUCT.md#Capabilities and Constraints",
    "label": "Normalized Member-Alias Table"
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
    "id": "base-out::public_routes",
    "source_file": "PRODUCT.md#Capabilities and Constraints",
    "label": "Public Routes"
  },
  {
    "id": "base-out::existing_public_member_route_implementation",
    "source_file": "PRODUCT.md#Evidence on Hand",
    "label": "Existing Public/Member Route Implementation"
  },
  {
    "id": "base-out::labeled_controls",
    "source_file": "PRODUCT.md#Accessibility & Inclusion",
    "label": "Labeled Controls"
  },
  {
    "id": "base-out::minimum_44px_interactive_targets",
    "source_file": "PRODUCT.md#Accessibility & Inclusion",
    "label": "Minimum 44px Interactive Targets"
  },
  {
    "id": "base-out::named_investigator_data_and_official_profile_links",
    "source_file": "PRODUCT.md#Evidence on Hand",
    "label": "Named Investigator Data and Official Profile Links"
  },
  {
    "id": "base-out::production_supabase_project",
    "source_file": "PRODUCT.md#Evidence on Hand",
    "label": "Production Supabase Project"
  },
  {
    "id": "base-out::readable_contrast",
    "source_file": "PRODUCT.md#Accessibility & Inclusion",
    "label": "Readable Contrast"
  },
  {
    "id": "base-out::reduced_motion_support",
    "source_file": "PRODUCT.md#Accessibility & Inclusion",
    "label": "Reduced Motion Support"
  },
  {
    "id": "base-out::semantic_headings",
    "source_file": "PRODUCT.md#Accessibility & Inclusion",
    "label": "Semantic Headings"
  },
  {
    "id": "base-out::skip_link",
    "source_file": "PRODUCT.md#Accessibility & Inclusion",
    "label": "Skip Link"
  },
  {
    "id": "base-out::supabase_schema_and_policies",
    "source_file": "PRODUCT.md#Evidence on Hand",
    "label": "Supabase Schema and Policies"
  },
  {
    "id": "base-out::visible_keyboard_focus",
    "source_file": "PRODUCT.md#Accessibility & Inclusion",
    "label": "Visible Keyboard Focus"
  },
  {
    "id": "base-out::public_source_register",
    "source_file": "PRODUCT.md#Evidence on Hand",
    "label": "Public Source Register"
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
  },
  {
    "id": "semantic-out-5-1::out_favicon_ico",
    "source_file": null,
    "label": "out/favicon.ico"
  },
  {
    "id": "semantic-out-5-1::openai_package",
    "source_file": null,
    "label": "OpenAI Package"
  },
  {
    "id": "semantic-out-5-1::tree_sitter_sql",
    "source_file": null,
    "label": "Tree-sitter SQL"
  },
  {
    "id": "semantic-out-6-1::graphify_cli",
    "source_file": null,
    "label": "Graphify CLI"
  },
  {
    "id": "semantic-out-6-1::ollama_backend",
    "source_file": null,
    "label": "Ollama backend"
  },
  {
    "id": "semantic-out-6-1::qwen2_5_coder_7b",
    "source_file": null,
    "label": "qwen2.5-coder:7b"
  },
  {
    "id": "semantic-out-7-1::setup_py",
    "source_file": "setup.py",
    "label": "Setup Script"
  },
  {
    "id": "semantic-out-7-1::digonto10602_su2qc_website_backup",
    "source_file": "personal backup",
    "label": "Personal Backup"
  },
  {
    "id": "semantic-out-7-1::docs_BACKUP_MANIFEST_v1_8_2_json",
    "source_file": "docs/BACKUP_MANIFEST_v1.8.2.json",
    "label": "Backup Manifest v1.8.2"
  },
  {
    "id": "semantic-out-9-0::app_index_js",
    "source_file": "app/index.js",
    "label": "App Index JS"
  },
  {
    "id": "semantic-out-9-0::components_header_js",
    "source_file": "components/header.js",
    "label": "Header JS"
  }
]
```
