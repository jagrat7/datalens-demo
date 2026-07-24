import { sql } from "drizzle-orm"
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"

export const documentStatuses = ["uploaded", "parsed", "failed"] as const
export const workflowStatuses = ["draft", "healthy", "attention", "failed"] as const
export const datasetStatuses = ["queued", "profiling", "validated", "failed"] as const
export const runStatuses = ["queued", "running", "completed", "failed"] as const

export interface DocumentMetadata {
  pageCount: number
  language: string
  parser: string
}

export interface FinalSchemaColumn {
  name: string
  type: "string" | "integer" | "decimal" | "date" | "boolean" | "email" | "currency"
  required: boolean
  description: string
  rules: string[]
}

const timestamp = (name: string) =>
  integer(name, { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)

export const companies = sqliteTable(
  "companies",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [uniqueIndex("companies_slug_unique").on(table.slug)],
)

export const companyDocuments = sqliteTable(
  "company_documents",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    storageKey: text("storage_key").notNull(),
    mimeType: text("mime_type").notNull(),
    status: text("status", { enum: documentStatuses }).notNull().default("uploaded"),
    parsedText: text("parsed_text"),
    metadata: text("metadata", { mode: "json" }).$type<DocumentMetadata>(),
    parsedAt: integer("parsed_at", { mode: "timestamp" }),
    createdAt: timestamp("created_at"),
  },
  (table) => [
    index("company_documents_company_id_idx").on(table.companyId),
    uniqueIndex("company_documents_storage_key_unique").on(table.storageKey),
  ],
)

export const workflows = sqliteTable(
  "workflows",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    domain: text("domain").notNull(),
    description: text("description").notNull().default(""),
    status: text("status", { enum: workflowStatuses }).notNull().default("draft"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    index("workflows_company_id_idx").on(table.companyId),
    uniqueIndex("workflows_company_name_unique").on(table.companyId, table.name),
  ],
)

export const workflowVersions = sqliteTable(
  "workflow_versions",
  {
    id: text("id").primaryKey(),
    workflowId: text("workflow_id")
      .notNull()
      .references(() => workflows.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    finalSchema: text("final_schema", { mode: "json" })
      .$type<FinalSchemaColumn[]>()
      .notNull(),
    defaultInstructions: text("default_instructions").notNull().default(""),
    createdAt: timestamp("created_at"),
  },
  (table) => [
    index("workflow_versions_workflow_id_idx").on(table.workflowId),
    uniqueIndex("workflow_versions_workflow_version_unique").on(
      table.workflowId,
      table.version,
    ),
  ],
)

export const datasets = sqliteTable(
  "datasets",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    workflowId: text("workflow_id")
      .notNull()
      .references(() => workflows.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    storageKey: text("storage_key").notNull(),
    format: text("format").notNull(),
    sizeBytes: integer("size_bytes").notNull().default(0),
    rowCount: integer("row_count").notNull().default(0),
    status: text("status", { enum: datasetStatuses }).notNull().default("queued"),
    passRate: real("pass_rate"),
    createdAt: timestamp("created_at"),
  },
  (table) => [
    index("datasets_company_id_idx").on(table.companyId),
    index("datasets_workflow_id_idx").on(table.workflowId),
    uniqueIndex("datasets_storage_key_unique").on(table.storageKey),
  ],
)

export const runs = sqliteTable(
  "runs",
  {
    id: text("id").primaryKey(),
    workflowVersionId: text("workflow_version_id")
      .notNull()
      .references(() => workflowVersions.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    customInstructions: text("custom_instructions"),
    status: text("status", { enum: runStatuses }).notNull().default("queued"),
    passedRows: integer("passed_rows").notNull().default(0),
    failedRows: integer("failed_rows").notNull().default(0),
    durationSeconds: integer("duration_seconds"),
    startedAt: integer("started_at", { mode: "timestamp" }),
    completedAt: integer("completed_at", { mode: "timestamp" }),
    createdAt: timestamp("created_at"),
  },
  (table) => [
    index("runs_workflow_version_id_idx").on(table.workflowVersionId),
    index("runs_status_idx").on(table.status),
  ],
)

export const runDatasets = sqliteTable(
  "run_datasets",
  {
    runId: text("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    datasetId: text("dataset_id")
      .notNull()
      .references(() => datasets.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.runId, table.datasetId] }),
    index("run_datasets_dataset_id_idx").on(table.datasetId),
  ],
)

export const yamlArtifacts = sqliteTable(
  "yaml_artifacts",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    storageKey: text("storage_key").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at"),
  },
  (table) => [
    uniqueIndex("yaml_artifacts_run_id_unique").on(table.runId),
    uniqueIndex("yaml_artifacts_storage_key_unique").on(table.storageKey),
  ],
)

export type Company = typeof companies.$inferSelect
export type CompanyDocument = typeof companyDocuments.$inferSelect
export type Workflow = typeof workflows.$inferSelect
export type WorkflowVersion = typeof workflowVersions.$inferSelect
export type Dataset = typeof datasets.$inferSelect
export type Run = typeof runs.$inferSelect
export type YamlArtifact = typeof yamlArtifacts.$inferSelect
