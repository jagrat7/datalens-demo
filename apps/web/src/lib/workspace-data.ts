// Temporary UI boundary for workspace data until the Bronze API is connected.
export type WorkflowStatus = "healthy" | "attention" | "failed" | "draft"

export type BusinessDomain = "Insurance" | "Dealer Management" | "Finance"

export const BUSINESS_DOMAINS: BusinessDomain[] = [
  "Insurance",
  "Dealer Management",
  "Finance",
]

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

export const WORKFLOWS: Workflow[] = []

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

export const COMPANY_DOCUMENTS: CompanyDocument[] = []

export function getWorkflow(id: string): Workflow | undefined {
  return WORKFLOWS.find((workflow) => workflow.id === id)
}

export function formatRows(count: number): string {
  return new Intl.NumberFormat("en-US").format(count)
}

export function passRateLabel(rate: number | null): string {
  return rate === null ? "—" : `${rate.toFixed(1)}%`
}
