# QA checklist

- [x] Home, Research, People, Library, Login, and Upload routes render locally.
- [x] All people facts match the official public sources in `docs/SOURCES.md`.
- [x] No private source material appears in the repository or rendered site.
- [x] Static `/upload/` browser guard and Edge Function membership gate are present.
- [x] Edge-side membership and ownership gates remain present; login responses do not reveal allowlist membership.
- [x] PDF/PPT/PPTX/Keynote checks cover extension, MIME type, size, and practical file signatures.
- [x] Files above 50 MB fail before metadata insertion.
- [x] Failed metadata insertion removes the orphaned storage object.
- [x] BibTeX requires author and title; nested braces, multiple authors, DOI/URL, and malformed input are tested.
- [x] Library search filters by title, description, and contributor.
- [x] Form controls have labels and status messages use live regions.
- [x] Keyboard focus is visible; skip link and reduced motion are implemented.
- [x] Layout is checked at 390, 768, 1024, and 1440 px with Chrome headless smoke coverage.
- [x] Every `SectionIntro` heading-description pair is coordinate-checked below the heading at 390, 768, 1024, and 1440 px.
- [x] Supplied SU2QC hero and all four investigator portraits decode, load with HTTP 200, and use matching alt text.
- [x] Home and People responsive evidence is saved under `docs/qa/v1.2.0/`.
- [x] Upload origin checks, fail-closed download behavior, and member-prefixed storage paths are covered by Edge Function source tests.
- [x] `npm test`, `npm run lint`, `npm run build`, and the plain static-server route checks pass locally.
- [x] `out/index.html` and static route trees are generated.
- [x] Supabase migration and Edge Function negative gates pass.
- [x] `npx impeccable detect --json app components` returns no findings.
- [x] No repository-authored GitHub Actions workflow exists; GitHub-managed Pages deployment is the only workflow shown remotely.
- [x] Live password login, library rendering, signed download, private-object denial, non-allowlisted RLS denial, and official Storage API cleanup passed for the disposable integration fixture.
- [x] Production password login, real upload/download, and cleanup passed through the hidden member-password test; remote logs recorded upload `201`, signed download `302`, and final Supabase counts were materials `0` and storage objects `0`.
- [x] v1.6.1 upload availability states distinguish configuration, expired session, denied membership, Edge Function unavailability, network/CORS failure, invalid service response, and validation/upload failure.
- [x] v1.6.1 production static bundle contains the corrected upload endpoint and no longer contains the misleading generic availability string.

The Chrome DevTools responsive runner remains host-blocked in this environment because loopback socket binding is denied; plain static-server route checks passed for all six exported routes.

The authenticated API fallback passed after v1.6.1 deployment (`201` upload, `302` signed download, `401` denial); a real browser upload remains unverified because the available Chrome/Firefox runtimes cannot reach the network in this host.
