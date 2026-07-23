// Synthetic demonstration data for the OneFlow v0 console.
// Names, files, and metrics are illustrative stand-ins — replace with live
// IDMC/Databricks connections and real company documents when they exist.

export type WorkflowStatus = "healthy" | "attention" | "failed" | "draft"

export type BusinessDomain = "Insurance" | "Dealer Management" | "Finance"

export const BUSINESS_DOMAINS: BusinessDomain[] = ["Insurance", "Dealer Management", "Finance"]

export type ColumnType =
  | "string"
  | "integer"
  | "decimal"
  | "date"
  | "boolean"
  | "email"
  | "currency"

export const COLUMN_TYPES: ColumnType[] = [
  "string",
  "integer",
  "decimal",
  "date",
  "boolean",
  "email",
  "currency",
]

export interface SchemaColumn {
  name: string
  type: ColumnType
  required: boolean
  rule: string
  sample: string
  meaning: string
  confidence: number
  source: "ai" | "user"
}

export type DatasetStatus = "validated" | "profiling" | "failed" | "queued"

export interface DatasetFeed {
  id: string
  name: string
  format: "CSV" | "XLSX" | "JSON" | "PARQUET"
  size: string
  rows: number
  status: DatasetStatus
  passRate: number | null
  addedAt: string
}

export interface WorkflowRun {
  id: string
  startedAt: string
  duration: string
  passed: number
  failed: number
  status: "completed" | "failed" | "running"
}

export interface Workflow {
  id: string
  name: string
  domain: BusinessDomain
  description: string
  status: WorkflowStatus
  updatedAt: string
  schema: SchemaColumn[]
  datasets: DatasetFeed[]
  runs: WorkflowRun[]
  rulesCount: number
}

export const WORKFLOWS: Workflow[] = [
  {
    id: "claims-intake",
    name: "Claims Intake",
    domain: "Insurance",
    description:
      "Inbound claims files from regional offices, validated against the curated claims schema before landing in bronze storage.",
    status: "healthy",
    updatedAt: "2026-07-22",
    rulesCount: 14,
    schema: [
      {
        name: "claim_id",
        type: "string",
        required: true,
        rule: "not null · unique · matches ^CLM-\\d{8}$",
        sample: "CLM-00429381",
        meaning: "Unique claim identifier assigned at intake",
        confidence: 0.98,
        source: "ai",
      },
      {
        name: "policy_number",
        type: "string",
        required: true,
        rule: "not null · lookup in policies",
        sample: "POL-88412-M",
        meaning: "Policy the claim is filed against",
        confidence: 0.96,
        source: "ai",
      },
      {
        name: "incident_date",
        type: "date",
        required: true,
        rule: "not null · ≤ filing_date",
        sample: "2026-06-30",
        meaning: "Date the loss occurred",
        confidence: 0.93,
        source: "ai",
      },
      {
        name: "filing_date",
        type: "date",
        required: true,
        rule: "not null · within 90 days of incident_date",
        sample: "2026-07-03",
        meaning: "Date the claim was submitted",
        confidence: 0.95,
        source: "ai",
      },
      {
        name: "claimant_email",
        type: "email",
        required: false,
        rule: "valid RFC 5322 format",
        sample: "m.okafor@example.com",
        meaning: "Primary contact for the claimant",
        confidence: 0.91,
        source: "ai",
      },
      {
        name: "claimed_amount",
        type: "currency",
        required: true,
        rule: "not null · ≥ 0 · ≤ 5,000,000",
        sample: "18,450.00",
        meaning: "Amount requested by the claimant",
        confidence: 0.97,
        source: "ai",
      },
      {
        name: "adjuster_code",
        type: "string",
        required: false,
        rule: "length 5 · uppercase",
        sample: "AJ204",
        meaning: "Internal code of the assigned adjuster",
        confidence: 0.84,
        source: "ai",
      },
      {
        name: "is_total_loss",
        type: "boolean",
        required: true,
        rule: "not null",
        sample: "false",
        meaning: "Whether the claim is flagged as a total loss",
        confidence: 0.89,
        source: "ai",
      },
    ],
    datasets: [
      {
        id: "ds-claims-q2-east",
        name: "claims_q2_east.csv",
        format: "CSV",
        size: "48.2 MB",
        rows: 184220,
        status: "validated",
        passRate: 99.1,
        addedAt: "2026-07-18",
      },
      {
        id: "ds-claims-q2-west",
        name: "claims_q2_west.csv",
        format: "CSV",
        size: "51.7 MB",
        rows: 201540,
        status: "validated",
        passRate: 98.7,
        addedAt: "2026-07-18",
      },
      {
        id: "ds-claims-jul-week3",
        name: "claims_2026_w29.csv",
        format: "CSV",
        size: "11.4 MB",
        rows: 42318,
        status: "profiling",
        passRate: null,
        addedAt: "2026-07-21",
      },
    ],
    runs: [
      {
        id: "run-0142",
        startedAt: "2026-07-21 06:00",
        duration: "4m 12s",
        passed: 41871,
        failed: 447,
        status: "completed",
      },
      {
        id: "run-0141",
        startedAt: "2026-07-20 06:00",
        duration: "9m 48s",
        passed: 200118,
        failed: 1422,
        status: "completed",
      },
      {
        id: "run-0140",
        startedAt: "2026-07-19 06:00",
        duration: "8m 55s",
        passed: 182663,
        failed: 1557,
        status: "completed",
      },
    ],
  },
  {
    id: "dealer-onboarding",
    name: "Dealer Onboarding",
    domain: "Dealer Management",
    description:
      "New-dealer extracts from the DMS migration. Column meanings confirmed by the ops team; rule set still being tuned.",
    status: "attention",
    updatedAt: "2026-07-20",
    rulesCount: 11,
    schema: [
      {
        name: "dealer_code",
        type: "string",
        required: true,
        rule: "not null · unique · length 6",
        sample: "DLR042",
        meaning: "Franchise dealer code from the DMS",
        confidence: 0.97,
        source: "ai",
      },
      {
        name: "dealership_name",
        type: "string",
        required: true,
        rule: "not null · length ≤ 120",
        sample: "Harborline Auto Group",
        meaning: "Trading name of the dealership",
        confidence: 0.94,
        source: "ai",
      },
      {
        name: "region",
        type: "string",
        required: true,
        rule: "one of North, South, East, West, Central",
        sample: "West",
        meaning: "Sales region the dealer operates in",
        confidence: 0.9,
        source: "user",
      },
      {
        name: "contract_start",
        type: "date",
        required: true,
        rule: "not null · ≥ 2015-01-01",
        sample: "2024-11-01",
        meaning: "Start of the current franchise agreement",
        confidence: 0.92,
        source: "ai",
      },
      {
        name: "floorplan_limit",
        type: "currency",
        required: false,
        rule: "≥ 0",
        sample: "2,500,000.00",
        meaning: "Maximum floor-plan financing extended",
        confidence: 0.81,
        source: "ai",
      },
      {
        name: "active",
        type: "boolean",
        required: true,
        rule: "not null",
        sample: "true",
        meaning: "Whether the dealership is currently trading",
        confidence: 0.88,
        source: "ai",
      },
    ],
    datasets: [
      {
        id: "ds-dealers-master",
        name: "dealer_master_extract.xlsx",
        format: "XLSX",
        size: "6.8 MB",
        rows: 4210,
        status: "validated",
        passRate: 93.4,
        addedAt: "2026-07-12",
      },
      {
        id: "ds-dealers-jul",
        name: "dealer_updates_jul.csv",
        format: "CSV",
        size: "0.9 MB",
        rows: 612,
        status: "failed",
        passRate: 78.2,
        addedAt: "2026-07-19",
      },
    ],
    runs: [
      {
        id: "run-0061",
        startedAt: "2026-07-19 07:30",
        duration: "1m 05s",
        passed: 479,
        failed: 133,
        status: "completed",
      },
      {
        id: "run-0060",
        startedAt: "2026-07-12 07:30",
        duration: "2m 41s",
        passed: 3934,
        failed: 276,
        status: "completed",
      },
    ],
  },
  {
    id: "policy-renewals",
    name: "Policy Renewals",
    domain: "Insurance",
    description:
      "Nightly renewal extracts. End schema drafted from a sample file — waiting for domain review before first run.",
    status: "draft",
    updatedAt: "2026-07-17",
    rulesCount: 6,
    schema: [
      {
        name: "policy_number",
        type: "string",
        required: true,
        rule: "not null · unique",
        sample: "POL-91027-R",
        meaning: "Policy being renewed",
        confidence: 0.96,
        source: "ai",
      },
      {
        name: "renewal_date",
        type: "date",
        required: true,
        rule: "not null",
        sample: "2026-08-01",
        meaning: "Effective date of the renewal term",
        confidence: 0.93,
        source: "ai",
      },
      {
        name: "premium_delta",
        type: "currency",
        required: false,
        rule: "between −50% and +50% of prior premium",
        sample: "212.40",
        meaning: "Change in premium versus the expiring term",
        confidence: 0.77,
        source: "ai",
      },
      {
        name: "renewed",
        type: "boolean",
        required: true,
        rule: "not null",
        sample: "true",
        meaning: "Whether the policyholder accepted the renewal",
        confidence: 0.85,
        source: "ai",
      },
    ],
    datasets: [
      {
        id: "ds-renewals-sample",
        name: "renewals_sample.csv",
        format: "CSV",
        size: "0.2 MB",
        rows: 500,
        status: "queued",
        passRate: null,
        addedAt: "2026-07-17",
      },
    ],
    runs: [],
  },
  {
    id: "gl-postings",
    name: "GL Postings",
    domain: "Finance",
    description:
      "General-ledger postings from the ERP close process. Last run failed on duplicate journal IDs — under investigation.",
    status: "failed",
    updatedAt: "2026-07-21",
    rulesCount: 12,
    schema: [
      {
        name: "journal_id",
        type: "string",
        required: true,
        rule: "not null · unique · matches ^JE-\\d{10}$",
        sample: "JE-0004821955",
        meaning: "Unique journal entry identifier",
        confidence: 0.98,
        source: "ai",
      },
      {
        name: "account_code",
        type: "string",
        required: true,
        rule: "not null · lookup in chart_of_accounts",
        sample: "6100-442",
        meaning: "GL account the posting hits",
        confidence: 0.95,
        source: "ai",
      },
      {
        name: "posting_date",
        type: "date",
        required: true,
        rule: "not null · within open period",
        sample: "2026-07-15",
        meaning: "Date the posting is effective",
        confidence: 0.94,
        source: "ai",
      },
      {
        name: "amount",
        type: "currency",
        required: true,
        rule: "not null · non-zero",
        sample: "9,120.75",
        meaning: "Posted amount in ledger currency",
        confidence: 0.97,
        source: "ai",
      },
      {
        name: "cost_center",
        type: "string",
        required: false,
        rule: "length 4 · numeric",
        sample: "0142",
        meaning: "Cost center bearing the posting",
        confidence: 0.86,
        source: "ai",
      },
    ],
    datasets: [
      {
        id: "ds-gl-close-jun",
        name: "gl_close_2026-06.csv",
        format: "CSV",
        size: "22.6 MB",
        rows: 96410,
        status: "validated",
        passRate: 99.6,
        addedAt: "2026-07-02",
      },
      {
        id: "ds-gl-close-jul-mid",
        name: "gl_midmonth_2026-07.csv",
        format: "CSV",
        size: "9.8 MB",
        rows: 41205,
        status: "failed",
        passRate: 88.9,
        addedAt: "2026-07-16",
      },
    ],
    runs: [
      {
        id: "run-0208",
        startedAt: "2026-07-16 05:15",
        duration: "3m 37s",
        passed: 36630,
        failed: 4575,
        status: "failed",
      },
      {
        id: "run-0207",
        startedAt: "2026-07-02 05:15",
        duration: "7m 02s",
        passed: 96024,
        failed: 386,
        status: "completed",
      },
    ],
  },
]

export type DocumentCategory = "Policy" | "Standard" | "Reference" | "Template"
export type DocumentFormat = "PDF" | "DOCX" | "XLSX" | "MD"

export interface CompanyDocument {
  id: string
  name: string
  category: DocumentCategory
  format: DocumentFormat
  size: string
  updatedAt: string
  owner: string
}

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  "Policy",
  "Standard",
  "Reference",
  "Template",
]

export const COMPANY_DOCUMENTS: CompanyDocument[] = [
  {
    id: "doc-classification",
    name: "Data Classification Policy",
    category: "Policy",
    format: "PDF",
    size: "1.2 MB",
    updatedAt: "2026-06-28",
    owner: "Data Governance",
  },
  {
    id: "doc-pii",
    name: "PII Handling Standard",
    category: "Standard",
    format: "DOCX",
    size: "684 KB",
    updatedAt: "2026-07-04",
    owner: "Compliance",
  },
  {
    id: "doc-naming",
    name: "Schema Naming Conventions",
    category: "Standard",
    format: "MD",
    size: "24 KB",
    updatedAt: "2026-07-11",
    owner: "Data Platform",
  },
  {
    id: "doc-sla-dealer",
    name: "SLA Definitions — Dealer Management",
    category: "Reference",
    format: "XLSX",
    size: "96 KB",
    updatedAt: "2026-05-19",
    owner: "Dealer Ops",
  },
  {
    id: "doc-retention",
    name: "Retention & Archival Policy",
    category: "Policy",
    format: "PDF",
    size: "940 KB",
    updatedAt: "2026-04-30",
    owner: "Legal",
  },
  {
    id: "doc-claims-glossary",
    name: "Claims Domain Glossary",
    category: "Reference",
    format: "DOCX",
    size: "412 KB",
    updatedAt: "2026-07-09",
    owner: "Claims Ops",
  },
  {
    id: "doc-rule-style",
    name: "Validation Rule Style Guide",
    category: "Standard",
    format: "MD",
    size: "31 KB",
    updatedAt: "2026-07-15",
    owner: "Data Platform",
  },
  {
    id: "doc-bronze-runbook",
    name: "Bronze Layer Runbook",
    category: "Template",
    format: "PDF",
    size: "1.8 MB",
    updatedAt: "2026-06-12",
    owner: "Data Platform",
  },
]

export function getWorkflow(id: string): Workflow | undefined {
  return WORKFLOWS.find((workflow) => workflow.id === id)
}

export function formatRows(count: number): string {
  return new Intl.NumberFormat("en-US").format(count)
}

export function passRateLabel(rate: number | null): string {
  return rate === null ? "—" : `${rate.toFixed(1)}%`
}
