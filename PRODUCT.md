# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A mix of data engineers and data analysts. Their day-to-day situation: they are responsible for data pipelines running across Informatica IDMC and Databricks — monitoring execution status, data freshness, and SLAs; triaging failures; and getting pipelines recovered quickly. In incident workflows they act as operators: reviewing AI diagnoses and approving or rejecting remediation. The dataset-validation capability serves the same mix when onboarding new datasets.

## Product Purpose

OneFlow is a centralized AIOps Observability platform for data pipelines. It continuously monitors pipelines across Informatica IDMC and Databricks, provides end-to-end visibility (status, freshness, duration, throughput, SLA compliance, lineage, per-pipeline health score), proactively detects failures and anomalies, uses LLMs to analyze logs and identify root causes, recommends remediation, and lets operators recover pipelines through a human-in-the-loop approval workflow. Success, as stated in the product brief: faster failure detection, reduced MTTR, improved SLA compliance, less manual troubleshooting, standardized incident response across IDMC and Databricks, and recommendations that keep improving through continuous learning.

## Positioning

One console, both platforms — pipelines in IDMC and Databricks are normally monitored in separate, siloed tools that show symptoms without explaining them; generic APM tools don't understand data-pipeline semantics (freshness, lineage, checkpoints, SLA). OneFlow correlates failures across both platforms and the supporting infrastructure, then has the AI diagnose and recommend — with confidence scores, evidence, and related historical incidents — while the human stays the decision-maker: every remediation is reviewed and approved before it runs, and every operator decision teaches the system. A dataset-validation capability (LLM-inferred column meanings, recommended quality rules compiled to executable YAML) extends the same "machine authors, human confirms" loop to data onboarding.

## Operating Context

The product brief's target shape: data sources (IDMC, Databricks workflows/jobs/notebooks, Unity Catalog, infrastructure and cloud logs) feed an observability layer (metrics, logs, events, pipeline metadata, lineage), then an AIOps intelligence layer (log analytics, root-cause analysis, anomaly detection, recommendation engine, knowledge base, LLM incident summarization), surfaced in an operations portal: unified dashboard, incident console, AI recommendations with confidence and estimated business impact, pipeline health views, one-click retry (full re-run, failed-tasks-only, or restart from last successful checkpoint), and a human approval workflow with escalation. Alerts go out via Microsoft Teams, email, or ServiceNow; incidents are prioritized by business criticality and tracked with MTTD/MTTR. Predictive operations forecast failures, capacity bottlenecks, and SLA violations. Operator feedback and successful resolutions are captured for continuous learning.

The dataset-validation capability (current concept in `docs/arch.png`, not binding): upload CSV/Excel, state a business domain (insurance, dealer management, finance are the named examples), review LLM-inferred column meanings with evidence (types, null %, sample values), select and edit recommended generic + business validation rules, compile to YAML (Soda / Great Expectations format), execute, and land passed/failed records, reports, and cleaned data in bronze-layer storage with logs, audit trail, and notifications.

This is a demo/prototype-stage project. The repo today is a fresh Better-T-Stack scaffold: React 19 + TanStack Router + Vite (`apps/web`), Hono API (`apps/server`), Drizzle + SQLite/Turso (`packages/db`), shared shadcn/ui primitives including an unused set of chat components (`packages/ui`). No product features are implemented yet.

## Capabilities and Constraints

- Confirmed capability areas (from the brief): centralized observability with lineage and health scores; intelligent failure detection and cross-platform correlation; AI log analysis (root cause, plain-language summaries, incident categorization, resolution recommendations); an AI recommendation engine (diagnosis, confidence, remediation steps, business impact, preventive measures, related incidents); human-in-the-loop recovery (approve/reject, automated remediation where appropriate, one-click retry modes, escalation); automated incident management (Teams/email/ServiceNow, criticality-based priority, MTTD/MTTR); predictive operations; continuous learning from operator feedback.
- Explicitly undecided: validation engine (Soda vs Great Expectations), validation execution database (Postgres vs Databricks), LLM provider/model, whether conversation is a primary interaction model (chat primitives installed but unused), and whether the demo runs on simulated pipeline data or real IDMC/Databricks connections.
- The web app and API already run locally (`bun run dev`; web on :3001, API on :3000).

## Brand Commitments

- Product name in UI: **OneFlow** — "OneFlow" is the product, Datalens is the company attribution.
- Company brand: **Datalens AI** (datalensai.com) — "Transforming Data into Intelligence"; a Gen AI / BI-ML / data engineering consultancy. Logo (user-provided): dark background, a "dl" monogram built from teal-to-purple gradient lines, with a DATALENS spaced-caps wordmark.
- Binding visual constraint (user-stated): the UI should feel similar to databricks.com, carrying the Datalens brand. This pins the reference and the brand, not a palette or type system — the visual world itself gets defined in new-work.

## Evidence on Hand

- `docs/arch.png` — architecture diagram of the dataset-validation flow.
- The AIOps platform brief (objective, capabilities, architecture, expected benefits), provided by the user in conversation; its benefits are stated goals, not measured proof.
- datalensai.com public site copy and the Datalens logo image.
- No real pipeline data, incidents, customers, benchmarks, or MTTR/accuracy numbers exist. Future work must not fabricate them; dashboards and consoles must use clearly illustrative sample data only.

## Product Principles

1. **AI recommends, the human decides.** Every diagnosis and remediation is reviewable with its evidence; approval is the core workflow, and nothing executes silently.
2. **Evidence with every claim.** Root causes cite log lines, confidence scores, and related historical incidents — no naked AI assertions.
3. **One console, both platforms.** IDMC and Databricks failures are correlated into a single operational picture; no swivel-chair between native tools.
4. **Detection to resolution in one flow.** Shorten the path anomaly → diagnosis → approved action → recovered pipeline; MTTD and MTTR are the numbers that matter.
5. **Every incident teaches.** Operator feedback and successful resolutions are captured and improve future recommendations.
