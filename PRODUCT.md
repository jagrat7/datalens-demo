# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A mix of data engineers and data analysts. Their shared situation: they receive raw datasets in varied formats (CSV, Excel, and others) from varied sources, and their job is to turn each dataset into a clean, validated output that conforms to a given target schema — today a slow, manual, code-heavy process. Business domains named so far include insurance, dealer management, and finance.

## Product Purpose

oneflow-demo takes a user from an arbitrary uploaded dataset to a validated, cleaned output matching a given schema, in one continuous flow. The product exists to remove the hand-written-analysis and hand-written-validation-code bottleneck from data onboarding. Success means a user can upload a file, confirm what its columns mean, confirm the rules it should satisfy, and receive passed/failed results and a cleaned output — without writing validation code themselves.

## Positioning

The machine authors, the human confirms. LLM analysis proposes the domain, the meaning of each column, and the validation rules; the user reviews and corrects rather than writes from scratch. Rules become durable, stored, reusable artifacts (generic, domain-specific, and custom) rather than one-off answers. Neighboring tools either validate without understanding (rule engines that require hand-authored configs) or understand without validating (chat over data that produces no executable, reusable rules).

## Operating Context

Current concept (per `docs/arch.png`, not yet binding — see open decisions below): the user uploads a dataset, states a business domain, and reviews LLM-inferred column meanings (with data types, null %, and sample values as evidence). The LLM then recommends generic validations (null, duplicate, type, length, range, format, distinct, pattern) and domain-specific business validations (cross-field, lookup, conditional, aggregation). The user selects and edits rules in a validation UI; selected rules are compiled to YAML (Soda / Great Expectations format), executed against the data on Postgres or Databricks, and produce passed records, failed records with reasons, and a summary report. Cleaned data, rejects, and reports land in bronze-layer storage, with process/error/execution logs, an audit trail, and email/Slack/Teams notifications.

This is a demo/prototype-stage project. The repo today is a fresh Better-T-Stack scaffold: React 19 + TanStack Router + Vite (`apps/web`), Hono API (`apps/server`), Drizzle + SQLite/Turso (`packages/db`), shared shadcn/ui primitives including an unused set of chat components (`packages/ui`). No product features are implemented yet.

## Capabilities and Constraints

- Nothing in the architecture diagram is a hard commitment yet; it is the current working concept.
- Explicitly undecided: validation engine (Soda vs Great Expectations), execution database (Postgres vs Databricks), LLM provider/model, and whether conversation is the primary interaction model (chat primitives are installed but unused).
- The web app and API already run locally (`bun run dev`; web on :3001, API on :3000).

## Brand Commitments

Working name: "oneflow-demo". No other confirmed name, voice, logo, or identity assets. (The README contains a stray `datalens-demo` line from an earlier scaffold; treat oneflow-demo as current.)

## Evidence on Hand

- `docs/arch.png` — the architecture diagram above; the only product-truth artifact so far.
- No real datasets, user quotes, customers, benchmarks, or accuracy numbers exist. Future work must not fabricate them; UI copy must use clearly illustrative sample data only.

## Product Principles

1. **Human confirms, machine authors.** Every LLM proposal — column meanings, domain, rules — is presented for review and edit before anything executes. Nothing runs silently.
2. **Trust through evidence.** Every inference shows its basis (sample values, null %, profile stats); every failed record carries its failure reasons.
3. **Rules are durable artifacts.** Validations are stored, reusable across datasets, and exportable — never disposable chat output.
4. **One flow, upload to outcome.** Minimize steps and handoffs between the raw file and the validated, schema-conforming output.
