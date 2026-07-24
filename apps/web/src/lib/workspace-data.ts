export type WorkflowStatus = "healthy" | "attention" | "failed" | "draft"
export type DatasetStatus = "validated" | "profiling" | "failed" | "queued"
export type RunStatus = "queued" | "running" | "completed" | "failed"

export interface FinalSchemaColumn {
  name: string
  type: "string" | "integer" | "decimal" | "date" | "boolean" | "email" | "currency"
  required: boolean
  description: string
  rules: string[]
}

export interface WorkflowSummary {
  id: string
  name: string
  domain: string
  description: string
  status: WorkflowStatus
  updatedAt: string
  version: number | null
  columnCount: number
  datasetCount: number
  rulesCount: number
  latestPassRate: number | null
}

export interface DatasetFeed {
  id: string
  name: string
  storageKey: string
  format: string
  sizeBytes: number
  rowCount: number
  status: DatasetStatus
  passRate: number | null
  createdAt: string
}

export interface WorkflowRun {
  id: string
  name: string
  customInstructions: string | null
  status: RunStatus
  passedRows: number
  failedRows: number
  durationSeconds: number | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
}

export interface YamlArtifact {
  id: string
  runId: string
  storageKey: string
  content: string
  createdAt: string
}

export interface WorkflowDetail {
  id: string
  name: string
  domain: string
  description: string
  status: WorkflowStatus
  updatedAt: string
  version: number | null
  finalSchema: FinalSchemaColumn[]
  rulesCount: number
  datasets: DatasetFeed[]
  runs: WorkflowRun[]
  yamlArtifacts: YamlArtifact[]
}

export interface ParsedCompanyDocument {
  id: string
  name: string
  storageKey: string
  mimeType: string
  status: "uploaded" | "parsed" | "failed"
  parsedText: string | null
  metadata: {
    pageCount: number
    language: string
    parser: string
  } | null
  parsedAt: string | null
  createdAt: string
}

export interface CompanyWorkspace {
  company: {
    id: string
    name: string
    slug: string
  }
  documents: ParsedCompanyDocument[]
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

export function formatRows(count: number): string {
  return new Intl.NumberFormat("en-US").format(count)
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—"

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`
}

export function formatDateTime(value: string | null): string {
  return value ? dateTimeFormatter.format(new Date(value)) : "—"
}
