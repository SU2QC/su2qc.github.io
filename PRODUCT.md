# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router with React, static export, Supabase authentication/database/storage, and Supabase Edge Functions.

## Users

Inferred from the existing routes and execution brief: public researchers, students, collaborators, and technically curious visitors who need to understand the SU2QC program; approved collaboration members who need to publish research materials.

## Product Purpose

SU2QC is a public academic collaboration website for AI-accelerated quantum simulation of non-Abelian gauge dynamics. It explains the research program, identifies the named investigators, and provides a public library of member-shared materials. Success means a visitor can understand the program and find trustworthy public context, while an approved member can securely publish a research artifact.

## Positioning

The site connects field-theory structure, quantum computing, machine learning, and high-performance workflows in one physics-first collaboration space, with a source-backed public surface and an allowlisted private publishing path.

## Operating Context

Visitors read the research, people, and library pages on the web. Approved members use institutional-email password authentication to upload PDF, PowerPoint, or Keynote materials with optional BibTeX metadata. Public downloads use short-lived signed URLs from private storage.

## Capabilities and Constraints

- Public routes cover the home, research, people, and library experiences.
- Member routes cover password login, upload, and authenticated material publishing.
- The upload Edge Function must enforce membership, ownership, file size, extension, MIME type, and file-signature checks.
- Supabase service-role credentials remain server-only; storage remains private and protected by row-level security.
- Public claims about people, institutions, and the collaboration use the official sources listed in `docs/SOURCES.md`.
- The four named investigators are the only named people; unconfirmed students and postdoctoral researchers remain unnamed.
- GitHub Pages hosts only generated static output; all application validation and static generation remain local, with no custom GitHub Actions workflow.

## Brand Commitments

The existing identity is SU2QC. Public language is concise, source-backed, and academically restrained. The interface preserves a warm paper ground, deep ink, restrained cobalt accent, editorial serif headings, disciplined grid, and generous whitespace.

## Evidence on Hand

- Public source register: `docs/SOURCES.md`.
- Named investigator data and official profile links: `data/people.js`.
- Existing public/member route implementation under `app/` and `components/`.
- Existing Supabase schema and policies: `supabase/migrations/001_initial.sql`.
- The production Supabase project and two Edge Functions are configured outside this static source tree; secrets remain managed by Supabase.

## Product Principles

- Physics before spectacle: explain the research without overstating results.
- Public trust is earned through official sources and explicit limitations.
- Secure publishing is allowlisted, private by default, and server-enforced.
- One collaboration, two access levels: public understanding and member contribution.
- Every state should tell the user what happened and what to do next.

## Accessibility & Inclusion

The web interface preserves a skip link, semantic headings, visible keyboard focus, labeled controls, minimum 44px interactive targets, readable contrast, and reduced-motion support. A full automated screen-reader audit remains outside the current local toolchain.
