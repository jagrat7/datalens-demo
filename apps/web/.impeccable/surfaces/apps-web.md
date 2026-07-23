---
version: 1
slug: "apps-web"
primary_target: "apps/web"
related_targets: ["apps/web/src/routes"]
---

# Surface brief — OneFlow v0 console (apps/web)

- **Scope:** the whole v0 app shell and its four routes — home (`/`), company data (`/company-data`), workflows list (`/workflows`), new workflow (`/workflows/new`), workflow detail (`/workflows/$workflowId`).
- **Visitor mode:** Operate.
- **Audience & job:** data engineers + analysts acting as operators; they create workflows (define the end schema, attach dataset feeds) and review validation state at a glance.
- **Action/task:** home funnels into "New workflow"; the wizard converges upload-to-infer and manual definition into one editable schema table; each workflow owns a page with End schema / Datasets / Runs tabs.
- **Proof/content:** all content is clearly-marked illustrative sample data (sidebar footer + home footnote); no real customer data, metrics, or claims may be introduced.
- **Constraints:** light-primary, token-based (dark theme works via `.dark`); hamburger in the navbar owns user settings + misc, never navigation; sidebar owns portals (Company Data, Workflows) and per-workflow wayfinding.
- **Chosen direction:** brief-pinned Databricks-class operations console carrying the Datalens brand; see DESIGN.md "The Operations Console". Direction contract lives at the top of `packages/ui/src/styles/globals.css`.
- **Memorable moment:** AI-inferred schema columns carry a rationed-gradient marker + confidence, making "machine authors, human confirms" visible in the table itself.
- **Unresolved:** persistence (nothing is saved; create flow toasts and routes back), real IDMC/Databricks connections, search/notifications are demo stubs that toast.
