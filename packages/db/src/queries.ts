import { eq } from "drizzle-orm"

import { db } from "./index"
import {
  companies,
  companyDocuments,
  datasets,
  runs,
  workflowVersions,
  workflows,
  yamlArtifacts,
} from "./schema"

const toIso = (value: Date | null) => value?.toISOString() ?? null

export async function getCompanyWorkspace() {
  const [companyRows, documentRows] = await Promise.all([
    db.select().from(companies),
    db.select().from(companyDocuments),
  ])
  const company = companyRows[0]

  if (!company) return null

  return {
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
    },
    documents: documentRows
      .filter((document) => document.companyId === company.id)
      .map((document) => ({
        id: document.id,
        name: document.name,
        storageKey: document.storageKey,
        mimeType: document.mimeType,
        status: document.status,
        parsedText: document.parsedText,
        metadata: document.metadata,
        parsedAt: toIso(document.parsedAt),
        createdAt: document.createdAt.toISOString(),
      }))
      .toSorted((first, second) => second.createdAt.localeCompare(first.createdAt)),
  }
}

export async function getWorkflowSummaries() {
  const [workflowRows, versionRows, datasetRows, runRows] = await Promise.all([
    db.select().from(workflows),
    db.select().from(workflowVersions),
    db.select().from(datasets),
    db.select().from(runs),
  ])
  const versionsById = new Map(versionRows.map((version) => [version.id, version]))
  const latestVersions = new Map<string, (typeof versionRows)[number]>()
  const datasetCounts = new Map<string, number>()
  const latestRuns = new Map<string, (typeof runRows)[number]>()

  for (const version of versionRows) {
    const current = latestVersions.get(version.workflowId)

    if (!current) {
      latestVersions.set(version.workflowId, version)
      continue
    }

    if (version.version > current.version) {
      latestVersions.set(version.workflowId, version)
    }
  }

  for (const dataset of datasetRows) {
    datasetCounts.set(dataset.workflowId, (datasetCounts.get(dataset.workflowId) ?? 0) + 1)
  }

  for (const run of runRows) {
    const version = versionsById.get(run.workflowVersionId)
    if (!version) continue

    const current = latestRuns.get(version.workflowId)
    const runTime = run.startedAt?.getTime() ?? run.createdAt.getTime()

    if (!current) {
      latestRuns.set(version.workflowId, run)
      continue
    }

    const currentTime = current.startedAt?.getTime() ?? current.createdAt.getTime()
    if (runTime > currentTime) {
      latestRuns.set(version.workflowId, run)
    }
  }

  return workflowRows
    .map((workflow) => {
      const version = latestVersions.get(workflow.id)
      const latestRun = latestRuns.get(workflow.id)
      const runRowsTotal = latestRun
        ? latestRun.passedRows + latestRun.failedRows
        : 0

      return {
        id: workflow.id,
        name: workflow.name,
        domain: workflow.domain,
        description: workflow.description,
        status: workflow.status,
        updatedAt: workflow.updatedAt.toISOString(),
        version: version?.version ?? null,
        columnCount: version?.finalSchema.length ?? 0,
        datasetCount: datasetCounts.get(workflow.id) ?? 0,
        rulesCount:
          version?.finalSchema.reduce(
            (total, column) => total + column.rules.length,
            0,
          ) ?? 0,
        latestPassRate:
          latestRun && runRowsTotal > 0
            ? (latestRun.passedRows / runRowsTotal) * 100
            : null,
      }
    })
    .toSorted((first, second) => second.updatedAt.localeCompare(first.updatedAt))
}

export async function getWorkflowDetail(workflowId: string) {
  const workflow = (
    await db.select().from(workflows).where(eq(workflows.id, workflowId)).limit(1)
  )[0]

  if (!workflow) return null

  const [versionRows, datasetRows, runRows, artifactRows] = await Promise.all([
    db
      .select()
      .from(workflowVersions)
      .where(eq(workflowVersions.workflowId, workflowId)),
    db.select().from(datasets).where(eq(datasets.workflowId, workflowId)),
    db
      .select({ run: runs })
      .from(runs)
      .innerJoin(
        workflowVersions,
        eq(runs.workflowVersionId, workflowVersions.id),
      )
      .where(eq(workflowVersions.workflowId, workflowId)),
    db
      .select({ artifact: yamlArtifacts })
      .from(yamlArtifacts)
      .innerJoin(runs, eq(yamlArtifacts.runId, runs.id))
      .innerJoin(
        workflowVersions,
        eq(runs.workflowVersionId, workflowVersions.id),
      )
      .where(eq(workflowVersions.workflowId, workflowId)),
  ])
  const version = versionRows.toSorted(
    (first, second) => second.version - first.version,
  )[0]

  return {
    id: workflow.id,
    name: workflow.name,
    domain: workflow.domain,
    description: workflow.description,
    status: workflow.status,
    updatedAt: workflow.updatedAt.toISOString(),
    version: version?.version ?? null,
    finalSchema: version?.finalSchema ?? [],
    rulesCount:
      version?.finalSchema.reduce(
        (total, column) => total + column.rules.length,
        0,
      ) ?? 0,
    datasets: datasetRows
      .map((dataset) => ({
        id: dataset.id,
        name: dataset.name,
        storageKey: dataset.storageKey,
        format: dataset.format,
        sizeBytes: dataset.sizeBytes,
        rowCount: dataset.rowCount,
        status: dataset.status,
        passRate: dataset.passRate,
        createdAt: dataset.createdAt.toISOString(),
      }))
      .toSorted((first, second) => second.createdAt.localeCompare(first.createdAt)),
    runs: runRows
      .map(({ run }) => ({
        id: run.id,
        name: run.name,
        customInstructions: run.customInstructions,
        status: run.status,
        passedRows: run.passedRows,
        failedRows: run.failedRows,
        durationSeconds: run.durationSeconds,
        startedAt: toIso(run.startedAt),
        completedAt: toIso(run.completedAt),
        createdAt: run.createdAt.toISOString(),
      }))
      .toSorted((first, second) => {
        const firstDate = first.startedAt ?? first.createdAt
        const secondDate = second.startedAt ?? second.createdAt
        return secondDate.localeCompare(firstDate)
      }),
    yamlArtifacts: artifactRows.map(({ artifact }) => ({
      id: artifact.id,
      runId: artifact.runId,
      storageKey: artifact.storageKey,
      content: artifact.content,
      createdAt: artifact.createdAt.toISOString(),
    })),
  }
}
