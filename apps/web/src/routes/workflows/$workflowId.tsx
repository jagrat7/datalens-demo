import { Badge } from "@oneflow-demo/ui/components/badge"
import { Button } from "@oneflow-demo/ui/components/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@oneflow-demo/ui/components/empty"
import { Separator } from "@oneflow-demo/ui/components/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@oneflow-demo/ui/components/table"
import { cn } from "@oneflow-demo/ui/lib/utils"
import { Link, createFileRoute } from "@tanstack/react-router"
import {
  Check,
  ChevronRight,
  Database,
  FileSpreadsheet,
  Pencil,
  Plus,
} from "lucide-react"
import { useState, type ReactNode } from "react"
import { toast } from "sonner"

import { PassRate } from "@/components/pass-rate"
import { StatusBadge, datasetTone, runTone } from "@/components/status-badge"
import { formatRows, getWorkflow } from "@/lib/workspace-data"
import type { DatasetStatus } from "@/lib/workspace-data"

const BRONZE_DATASET_STATE = {
  validated: {
    label: "Processed",
    detail: "Validation rules extracted",
  },
  profiling: {
    label: "Processing",
    detail: "Extracting validation rules",
  },
  failed: {
    label: "Failed",
    detail: "Validation rules need review",
  },
  queued: {
    label: "Queued",
    detail: "Waiting to process",
  },
} satisfies Record<DatasetStatus, { label: string; detail: string }>

type StageTone = "healthy" | "warning" | "failed" | "info" | "muted"

interface PipelineStageProps {
  number: number
  name: string
  title: string
  description: string
  state: {
    tone: StageTone
    label: string
  }
  isLast?: boolean
  children: ReactNode
}

export const Route = createFileRoute("/workflows/$workflowId")({
  component: WorkflowDetailComponent,
})

function PipelineStage({
  number,
  name,
  title,
  description,
  state,
  isLast = false,
  children,
}: PipelineStageProps) {
  return (
    <li
      className={cn(
        "grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[2rem_11rem_minmax(0,1fr)]",
        !isLast && "border-b border-border",
      )}
    >
      <div className="relative row-span-2 flex justify-center md:row-span-1">
        <span className="relative flex size-8 items-center justify-center border border-border bg-background font-mono text-xs font-medium tabular-nums">
          {number}
        </span>
        {!isLast ? (
          <span
            aria-hidden="true"
            className="absolute top-8 -bottom-6 w-px bg-border"
          />
        ) : null}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          {name}
        </p>
        <h2 className="mt-1 text-sm font-semibold">{title}</h2>
        <p className="mt-1 max-w-48 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
        <StatusBadge className="mt-3" tone={state.tone} label={state.label} />
      </div>

      <div className="col-start-2 mt-4 min-w-0 md:col-start-3 md:row-start-1 md:mt-0">
        {children}
      </div>
    </li>
  )
}

function WorkflowDetailComponent() {
  const { workflowId } = Route.useParams()
  const workflow = getWorkflow(workflowId)
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)

  if (!workflow) {
    return (
      <div className="px-6 py-16 text-center lg:px-8">
        <h1 className="text-lg font-semibold">Workflow not found</h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          “{workflowId}” does not exist in this workspace.
        </p>
        <Button
          variant="outline"
          className="mt-5"
          render={<Link to="/workflows" />}
          nativeButton={false}
        >
          Back to workflows
        </Button>
      </div>
    )
  }

  const processedDatasets = workflow.datasets.filter(
    (dataset) => dataset.status === "validated",
  )
  const hasFailures = workflow.datasets.some(
    (dataset) => dataset.status === "failed",
  )
  const isProcessing = workflow.datasets.some(
    (dataset) => dataset.status === "profiling",
  )
  const totalDatasets = workflow.datasets.length
  const processedCount = processedDatasets.length
  const remainingCount = totalDatasets - processedCount
  const stagedRows = processedDatasets.reduce(
    (total, dataset) => total + dataset.rows,
    0,
  )
  const recentRuns = workflow.runs
    .toSorted((first, second) => second.startedAt.localeCompare(first.startedAt))
    .slice(0, 3)
  const selectedRun =
    recentRuns.find((run) => run.id === selectedRunId) ?? recentRuns[0] ?? null
  const selectedRunTotal = selectedRun
    ? selectedRun.passed + selectedRun.failed
    : stagedRows
  const selectedRunStatus = selectedRun ? runTone(selectedRun.status) : null
  const allProcessed = totalDatasets > 0 && remainingCount === 0
  const datasetNoun = totalDatasets === 1 ? "source dataset" : "source datasets"
  const remainingNoun = remainingCount === 1 ? "input" : "inputs"
  const finalDatasetName = `${workflow.name} final dataset`
  const bronzeState = hasFailures
    ? ({ tone: "failed", label: "Needs attention" } as const)
    : allProcessed
      ? ({ tone: "healthy", label: "Complete" } as const)
      : isProcessing
        ? ({ tone: "info", label: "Processing" } as const)
        : ({ tone: "muted", label: "Waiting" } as const)
  const silverState = hasFailures
    ? ({ tone: "failed", label: "Blocked" } as const)
    : processedCount > 0
      ? allProcessed
        ? ({ tone: "healthy", label: "Complete" } as const)
        : ({ tone: "info", label: "Building" } as const)
      : ({ tone: "muted", label: "Waiting" } as const)
  const goldState = hasFailures
    ? ({ tone: "failed", label: "Blocked" } as const)
    : allProcessed
      ? ({ tone: "info", label: "Ready to build" } as const)
      : ({ tone: "muted", label: "Waiting" } as const)
  const displayedGoldState = selectedRunStatus ?? goldState

  return (
    <div>
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pt-5 pb-5 lg:px-8">
          <nav
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link to="/workflows" className="transition-colors hover:text-foreground">
              Workflows
            </Link>
            <ChevronRight aria-hidden="true" className="size-3" />
            <span className="text-foreground">{workflow.name}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">{workflow.name}</h1>
                <Badge variant="secondary">{workflow.domain}</Badge>
              </div>
              <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
                Build one schema-ready dataset from {totalDatasets} {datasetNoun}.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("Workflow editing is not connected yet")
                }
              >
                <Pencil data-icon="inline-start" />
                Edit workflow
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  toast.info("Dataset runs will be connected with the Bronze data service")
                }
              >
                <Plus data-icon="inline-start" />
                New run
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-7 lg:px-8">
        <section aria-labelledby="runs-heading">
          <div>
            <h2 id="runs-heading" className="text-sm font-semibold">
              Runs
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Select one of the three most recent runs to update the pipeline below.
            </p>
          </div>

          <div className="mt-4 border border-border bg-card">
            {recentRuns.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Run</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Passed</TableHead>
                      <TableHead className="text-right">Failed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pass rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRuns.map((run) => {
                      const runTotal = run.passed + run.failed
                      const runPassRate =
                        runTotal > 0 ? (run.passed / runTotal) * 100 : null
                      const status = runTone(run.status)
                      const isSelected = selectedRun?.id === run.id

                      return (
                        <TableRow
                          key={run.id}
                          tabIndex={0}
                          aria-label={`View ${run.id}`}
                          aria-selected={isSelected}
                          data-state={isSelected ? "selected" : undefined}
                          className="cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
                          onClick={() => setSelectedRunId(run.id)}
                          onKeyDown={(event) => {
                            if (!["Enter", " "].includes(event.key)) return

                            event.preventDefault()
                            setSelectedRunId(run.id)
                          }}
                        >
                          <TableCell className="font-mono text-xs font-medium">
                            {run.id}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {run.startedAt}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {run.duration}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs tabular-nums">
                            {formatRows(run.passed)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs tabular-nums">
                            {formatRows(run.failed)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge tone={status.tone} label={status.label} />
                          </TableCell>
                          <TableCell>
                            <PassRate rate={runPassRate} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                <Separator />
                <div className="flex justify-center px-4 py-1.5">
                  <Button
                    variant="link"
                    size="xs"
                    onClick={() =>
                      toast.info("Full run history is not connected yet")
                    }
                  >
                    See all
                  </Button>
                </div>
              </>
            ) : (
              <Empty className="py-8">
                <EmptyHeader>
                  <EmptyTitle>No runs yet</EmptyTitle>
                  <EmptyDescription>
                    Recent runs will appear here after processing begins.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="dataset-journey-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="dataset-journey-heading" className="text-sm font-semibold">
                Path to final dataset
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedRun
                  ? `Showing pipeline output from ${selectedRun.startedAt}.`
                  : "Follow each input from validation through aggregation to the Gold output."}
              </p>
            </div>
            <p className="font-mono text-xs text-muted-foreground tabular-nums">
              {selectedRun
                ? `Viewing ${selectedRun.id}`
                : `${processedCount} of ${totalDatasets} inputs processed`}
            </p>
          </div>

          <Separator className="mt-5" />

          <ol className="pt-6" aria-label="Dataset refinement timeline">
            <PipelineStage
              number={1}
              name="Bronze"
              title="Validate inputs"
              description="Process each upload and extract its validation rules."
              state={bronzeState}
            >
              <div className="border-y border-border">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/60 px-4 py-2.5">
                  <p className="text-xs font-medium">Input datasets</p>
                  <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {workflow.rulesCount} validation rules
                  </p>
                </div>

                {totalDatasets === 0 ? (
                  <Empty className="py-8">
                    <EmptyHeader>
                      <EmptyTitle>No datasets yet</EmptyTitle>
                      <EmptyDescription>
                        Add a dataset to begin Bronze processing.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <ul className="divide-y divide-border">
                    {workflow.datasets.map((dataset) => {
                      const tone = datasetTone(dataset.status)
                      const state = BRONZE_DATASET_STATE[dataset.status]

                      return (
                        <li
                          key={dataset.id}
                          className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <FileSpreadsheet
                              aria-hidden="true"
                              className="size-4 shrink-0 text-muted-foreground"
                            />
                            <span className="truncate font-mono text-xs font-medium">
                              {dataset.name}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <StatusBadge tone={tone.tone} label={state.label} />
                            <span className="text-[11px] text-muted-foreground">
                              {state.detail}
                            </span>
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              <p className="mt-2.5 text-[11px] text-muted-foreground">
                Validation begins when a dataset is uploaded.
              </p>
            </PipelineStage>

            <PipelineStage
              number={2}
              name="Silver"
              title="Combine validated data"
              description="Aggregate only the inputs that have cleared Bronze."
              state={silverState}
            >
              <div className="border-y border-border">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/60 px-4 py-2.5">
                  <p className="text-xs font-medium">Datasets in the aggregate</p>
                  <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {processedCount} included
                  </p>
                </div>

                {processedCount === 0 ? (
                  <Empty className="py-8">
                    <EmptyHeader>
                      <EmptyTitle>Nothing to aggregate yet</EmptyTitle>
                      <EmptyDescription>
                        Validated Bronze datasets will appear here.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <ul className="divide-y divide-border">
                    {processedDatasets.map((dataset) => (
                      <li
                        key={dataset.id}
                        className="flex items-center justify-between gap-4 px-4 py-3"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <Check
                            aria-hidden="true"
                            className="size-4 shrink-0 text-healthy"
                          />
                          <span className="truncate font-mono text-xs font-medium">
                            {dataset.name}
                          </span>
                        </span>
                        <Badge variant="secondary">Included</Badge>
                      </li>
                    ))}
                  </ul>
                )}

                {remainingCount > 0 ? (
                  <>
                    <Separator />
                    <p className="bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
                      {remainingCount} {remainingNoun}{" "}
                      {hasFailures
                        ? "blocked in Bronze and cannot move forward."
                        : "will be included after Bronze processing."}
                    </p>
                  </>
                ) : null}
              </div>
              <p className="mt-2.5 text-[11px] text-muted-foreground">
                {selectedRun ? (
                  <>
                    Selected run input:{" "}
                    <span className="font-mono tabular-nums">
                      {formatRows(selectedRunTotal)} rows
                    </span>
                  </>
                ) : processedCount > 0 ? (
                  <>
                    Current aggregate:{" "}
                    <span className="font-mono tabular-nums">
                      {formatRows(stagedRows)} rows
                    </span>
                  </>
                ) : (
                  "Waiting for a validated dataset."
                )}
              </p>
            </PipelineStage>

            <PipelineStage
              number={3}
              name="Gold"
              title="Produce final dataset"
              description="Shape the aggregate to match the end schema."
              state={displayedGoldState}
              isLast
            >
              <div className="border-y border-border bg-muted/30 px-4 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center border border-border bg-background">
                      <Database
                        aria-hidden="true"
                        className="size-4 text-muted-foreground"
                      />
                    </span>
                    <div className="min-w-0">
                      <Badge variant="outline">Final dataset</Badge>
                      <h3 className="mt-2 text-sm font-semibold">{finalDatasetName}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        One output aligned to the target end schema.
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    tone={displayedGoldState.tone}
                    label={displayedGoldState.label}
                  />
                </div>

                <Separator className="my-4" />

                <dl className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-[11px] text-muted-foreground">End schema</dt>
                    <dd className="mt-1 font-mono text-xs tabular-nums">
                      {workflow.schema.length} columns
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Output rows</dt>
                    <dd className="mt-1 font-mono text-xs tabular-nums">
                      {selectedRun
                        ? formatRows(selectedRun.passed)
                        : processedCount > 0
                          ? formatRows(stagedRows)
                          : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Rejected rows</dt>
                    <dd className="mt-1 font-mono text-xs tabular-nums">
                      {selectedRun ? formatRows(selectedRun.failed) : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
              <p className="mt-2.5 text-[11px] text-muted-foreground">
                {selectedRun
                  ? `${selectedRun.id} is reflected in this Gold output summary.`
                  : "Gold is produced after every source clears Bronze and Silver."}
              </p>
            </PipelineStage>
          </ol>
        </section>
      </main>
    </div>
  )
}
