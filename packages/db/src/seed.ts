import dotenv from "dotenv"
import { fileURLToPath } from "node:url"

import {
  companies,
  companyDocuments,
  datasets,
  runDatasets,
  runs,
  workflowVersions,
  workflows,
  yamlArtifacts,
  type FinalSchemaColumn,
} from "./schema"

const envPath = fileURLToPath(new URL("../../../apps/server/.env", import.meta.url))
const seedCreatedAt = new Date("2026-07-01T12:00:00.000Z")
const parsedAt = new Date("2026-07-01T12:05:00.000Z")
const runStartedAt = new Date("2026-07-02T09:00:00.000Z")
const runCompletedAt = new Date("2026-07-02T09:02:18.000Z")
const seedIds = {
  company: "seed-company-datalens",
  workflow: "seed-workflow-claims-intake",
  workflowVersion: "seed-workflow-claims-intake-v1",
  dataset: "seed-dataset-claims-july",
  run: "seed-run-claims-intake-001",
  yaml: "seed-yaml-claims-intake-001",
  documents: {
    overview: "seed-document-data-classification",
    operations: "seed-document-claims-standard",
    glossary: "seed-document-retention-policy",
  },
} as const

dotenv.config({ path: envPath })

const { db } = await import("./index")

const companySeed = {
  id: seedIds.company,
  name: "Datalens AI",
  slug: "datalens-ai",
  createdAt: seedCreatedAt,
  updatedAt: runCompletedAt,
} satisfies typeof companies.$inferInsert

const documentSeeds = [
  {
    id: seedIds.documents.overview,
    companyId: seedIds.company,
    name: "Company Overview",
    storageKey: `seed/${companySeed.slug}/documents/company-overview.pdf`,
    mimeType: "application/pdf",
    status: "parsed",
    parsedText:
      "Datalens AI helps insurance teams consolidate operational data from brokers, policy administrators, and claims platforms. The claims intake group receives files throughout each reporting cycle and prepares them for downstream analytics, finance, and customer service teams. Work is organized by business line and source partner, with each intake tracked from receipt through review.",
    metadata: {
      pageCount: 6,
      language: "en",
      parser: "seed",
    },
    parsedAt,
    createdAt: seedCreatedAt,
  },
  {
    id: seedIds.documents.operations,
    companyId: seedIds.company,
    name: "Claims Operations Handbook",
    storageKey: `seed/${companySeed.slug}/documents/claims-operations-handbook.docx`,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    status: "parsed",
    parsedText:
      "Claims specialists review new submissions, connect them to the relevant policy, and capture the circumstances and financial details of the reported incident. Records may arrive through partner portals, email-assisted intake, or scheduled file transfers. The operations team uses a common vocabulary so adjusters, finance teams, and analysts can discuss the same claim consistently across systems.",
    metadata: {
      pageCount: 7,
      language: "en",
      parser: "seed",
    },
    parsedAt,
    createdAt: seedCreatedAt,
  },
  {
    id: seedIds.documents.glossary,
    companyId: seedIds.company,
    name: "Insurance Product Glossary",
    storageKey: `seed/${companySeed.slug}/documents/insurance-product-glossary.pdf`,
    mimeType: "application/pdf",
    status: "parsed",
    parsedText:
      "A claim is a request for coverage following a reported incident. A policy identifies the insurance contract associated with that claim. The incident date describes when the covered event occurred, while the claimed amount describes the amount requested before assessment. Brokers, policyholders, adjusters, and underwriters may each contribute information during the claim lifecycle.",
    metadata: {
      pageCount: 12,
      language: "en",
      parser: "seed",
    },
    parsedAt,
    createdAt: seedCreatedAt,
  },
] satisfies Array<typeof companyDocuments.$inferInsert>

const workflowSeed = {
  id: seedIds.workflow,
  companyId: seedIds.company,
  name: "Claims Intake",
  domain: "Insurance",
  description: "Validate inbound claims files before they land in Bronze storage.",
  status: "healthy",
  createdAt: seedCreatedAt,
  updatedAt: runCompletedAt,
} satisfies typeof workflows.$inferInsert

const finalSchema: FinalSchemaColumn[] = [
  {
    name: "claim_id",
    type: "string",
    required: true,
    description: "Unique identifier assigned to a claim at intake.",
    rules: ["not_null", "unique", "matches:^CLM-[0-9]{8}$"],
  },
  {
    name: "policy_number",
    type: "string",
    required: true,
    description: "Policy against which the claim was filed.",
    rules: ["not_null"],
  },
  {
    name: "incident_date",
    type: "date",
    required: true,
    description: "Date on which the insured incident occurred.",
    rules: ["not_null", "not_in_future"],
  },
  {
    name: "claimed_amount",
    type: "currency",
    required: true,
    description: "Amount requested by the claimant.",
    rules: ["not_null", "greater_than_or_equal:0"],
  },
]

const workflowVersionSeed = {
  id: seedIds.workflowVersion,
  workflowId: seedIds.workflow,
  version: 1,
  finalSchema,
  defaultInstructions:
    "Use parsed company documents only for business terminology and domain context. Derive validation constraints from the final schema and dataset profile, preserve source lineage, and emit the generated rules as YAML.",
  createdAt: seedCreatedAt,
} satisfies typeof workflowVersions.$inferInsert

const datasetSeed = {
  id: seedIds.dataset,
  companyId: seedIds.company,
  workflowId: seedIds.workflow,
  name: "claims_2026_07.csv",
  storageKey: `seed/${companySeed.slug}/datasets/claims_2026_07.csv`,
  format: "CSV",
  sizeBytes: 284_160,
  rowCount: 1_250,
  status: "validated",
  passRate: 100,
  createdAt: runStartedAt,
} satisfies typeof datasets.$inferInsert

const runSeed = {
  id: seedIds.run,
  workflowVersionId: seedIds.workflowVersion,
  name: "Claims Intake · July 2026",
  customInstructions:
    "Use company terminology as descriptive context for the claims data.",
  status: "completed",
  passedRows: 1_250,
  failedRows: 0,
  durationSeconds: 138,
  startedAt: runStartedAt,
  completedAt: runCompletedAt,
  createdAt: runStartedAt,
} satisfies typeof runs.$inferInsert

const yamlSeed = {
  id: seedIds.yaml,
  runId: seedIds.run,
  storageKey: `seed/${companySeed.slug}/runs/${seedIds.run}/validation-rules.yaml`,
  content: `version: 1
workflow: claims-intake
rules:
  - column: claim_id
    checks:
      - not_null
      - unique
      - matches: "^CLM-[0-9]{8}$"
  - column: policy_number
    checks:
      - not_null
  - column: incident_date
    checks:
      - not_null
      - not_in_future
  - column: claimed_amount
    checks:
      - not_null
      - greater_than_or_equal: 0
`,
  createdAt: runCompletedAt,
} satisfies typeof yamlArtifacts.$inferInsert

try {
  await db.transaction(async (tx) => {
    await tx
      .insert(companies)
      .values(companySeed)
      .onConflictDoUpdate({
        target: companies.id,
        set: {
          name: companySeed.name,
          slug: companySeed.slug,
          updatedAt: companySeed.updatedAt,
        },
      })

    for (const document of documentSeeds) {
      await tx
        .insert(companyDocuments)
        .values(document)
        .onConflictDoUpdate({
          target: companyDocuments.id,
          set: {
            name: document.name,
            storageKey: document.storageKey,
            mimeType: document.mimeType,
            status: document.status,
            parsedText: document.parsedText,
            metadata: document.metadata,
            parsedAt: document.parsedAt,
          },
        })
    }

    await tx
      .insert(workflows)
      .values(workflowSeed)
      .onConflictDoUpdate({
        target: workflows.id,
        set: {
          name: workflowSeed.name,
          domain: workflowSeed.domain,
          description: workflowSeed.description,
          status: workflowSeed.status,
          updatedAt: workflowSeed.updatedAt,
        },
      })

    await tx
      .insert(workflowVersions)
      .values(workflowVersionSeed)
      .onConflictDoUpdate({
        target: workflowVersions.id,
        set: {
          version: workflowVersionSeed.version,
          finalSchema: workflowVersionSeed.finalSchema,
          defaultInstructions: workflowVersionSeed.defaultInstructions,
        },
      })

    await tx
      .insert(datasets)
      .values(datasetSeed)
      .onConflictDoUpdate({
        target: datasets.id,
        set: {
          name: datasetSeed.name,
          storageKey: datasetSeed.storageKey,
          format: datasetSeed.format,
          sizeBytes: datasetSeed.sizeBytes,
          rowCount: datasetSeed.rowCount,
          status: datasetSeed.status,
          passRate: datasetSeed.passRate,
        },
      })

    await tx
      .insert(runs)
      .values(runSeed)
      .onConflictDoUpdate({
        target: runs.id,
        set: {
          name: runSeed.name,
          customInstructions: runSeed.customInstructions,
          status: runSeed.status,
          passedRows: runSeed.passedRows,
          failedRows: runSeed.failedRows,
          durationSeconds: runSeed.durationSeconds,
          startedAt: runSeed.startedAt,
          completedAt: runSeed.completedAt,
        },
      })

    await tx
      .insert(runDatasets)
      .values({
        runId: seedIds.run,
        datasetId: seedIds.dataset,
      })
      .onConflictDoNothing()

    await tx
      .insert(yamlArtifacts)
      .values(yamlSeed)
      .onConflictDoUpdate({
        target: yamlArtifacts.id,
        set: {
          storageKey: yamlSeed.storageKey,
          content: yamlSeed.content,
        },
      })
  })

  console.log("Seeded one company, three parsed documents, and one successful workflow run")
} catch (error) {
  console.error("Database seed failed", error)
  process.exitCode = 1
}
