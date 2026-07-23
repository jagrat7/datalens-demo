import { Badge } from "@oneflow-demo/ui/components/badge"
import { Button } from "@oneflow-demo/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@oneflow-demo/ui/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@oneflow-demo/ui/components/tabs"
import { Link, createFileRoute } from "@tanstack/react-router"
import { ChevronRight, FileSpreadsheet, Play, Plus } from "lucide-react"
import { toast } from "sonner"

import { PassRate } from "@/components/pass-rate"
import { StatusBadge, datasetTone, runTone, workflowTone } from "@/components/status-badge"
import { formatRows, getWorkflow } from "@/lib/sample-data"

export const Route = createFileRoute("/workflows/$workflowId")({
  component: WorkflowDetailComponent,
})

function AiBadge({ confidence }: { confidence: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground"
      title={`Inferred by OneFlow AI · ${Math.round(confidence * 100)}% confidence`}
    >
      <span
        aria-hidden="true"
        className="size-1.5"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--lens-teal), var(--lens-blue), var(--lens-violet))",
        }}
      />
      AI {Math.round(confidence * 100)}%
    </span>
  )
}

function WorkflowDetailComponent() {
  const { workflowId } = Route.useParams()
  const workflow = getWorkflow(workflowId)

  if (!workflow) {
    return (
      <div className="px-6 py-16 text-center lg:px-8">
        <h1 className="text-lg font-semibold">Workflow not found</h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          “{workflowId}” does not exist in this demo workspace.
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

  const status = workflowTone(workflow.status)
  const lastRun = workflow.runs[0]
  const validatedRates = workflow.datasets
    .map((dataset) => dataset.passRate)
    .filter((rate): rate is number => rate !== null)
  const latestPassRate =
    validatedRates.length > 0 ? validatedRates[validatedRates.length - 1] : null

  return (
    <div>
      <div className="border-b border-border px-6 pt-5 pb-4 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/workflows" className="transition-colors hover:text-foreground">
            Workflows
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{workflow.name}</span>
        </nav>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight">{workflow.name}</h1>
              <Badge variant="secondary">{workflow.domain}</Badge>
              <StatusBadge tone={status.tone} label={status.label} />
            </div>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
              {workflow.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Adding datasets is part of the setup flow in this demo")}
            >
              <Plus className="size-3.5" />
              Add dataset
            </Button>
            <Button
              size="sm"
              onClick={() => toast.success("Validation run queued — demo only")}
            >
              <Play className="size-3.5" />
              Run validation
            </Button>
          </div>
        </div>

        <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-muted-foreground">Datasets</dt>
            <dd className="font-mono tabular-nums">{workflow.datasets.length}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-muted-foreground">Schema columns</dt>
            <dd className="font-mono tabular-nums">{workflow.schema.length}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-muted-foreground">Rules</dt>
            <dd className="font-mono tabular-nums">{workflow.rulesCount}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-muted-foreground">Last run</dt>
            <dd className="font-mono tabular-nums">{lastRun ? lastRun.startedAt : "—"}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-muted-foreground">Latest pass rate</dt>
            <dd>
              <PassRate rate={latestPassRate} />
            </dd>
          </div>
        </dl>
      </div>

      <div className="px-6 py-5 lg:px-8">
        <Tabs defaultValue="schema">
          <TabsList variant="line">
            <TabsTrigger value="schema">End schema</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="runs">Runs</TabsTrigger>
          </TabsList>

          <TabsContent value="schema" className="mt-4">
            <div className="border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead>Sample</TableHead>
                    <TableHead className="w-[26%]">Meaning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflow.schema.map((column) => (
                    <TableRow key={column.name}>
                      <TableCell>
                        <span className="block font-medium">{column.name}</span>
                        {column.source === "ai" ? (
                          <AiBadge confidence={column.confidence} />
                        ) : (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            User defined
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{column.type}</TableCell>
                      <TableCell className="text-xs">
                        {column.required ? "Yes" : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-[11px] text-muted-foreground">
                        <span className="block max-w-60 break-words">{column.rule}</span>
                      </TableCell>
                      <TableCell className="font-mono text-[11px] text-muted-foreground">
                        <span className="block max-w-40 break-words">{column.sample}</span>
                      </TableCell>
                      <TableCell className="text-xs leading-relaxed text-muted-foreground">
                        {column.meaning}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-2.5 text-[11px] text-muted-foreground">
              AI-inferred columns show their confidence. Confirm or correct meanings before the
              next run — nothing executes without review.
            </p>
          </TabsContent>

          <TabsContent value="datasets" className="mt-4">
            <div className="border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feed</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead className="text-right">Rows</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pass rate</TableHead>
                    <TableHead className="text-right">Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflow.datasets.map((dataset) => {
                    const datasetStatus = datasetTone(dataset.status)
                    return (
                      <TableRow key={dataset.id}>
                        <TableCell>
                          <span className="flex items-center gap-2 font-medium">
                            <FileSpreadsheet className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="font-mono text-xs">{dataset.name}</span>
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{dataset.format}</TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {dataset.size}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {formatRows(dataset.rows)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge tone={datasetStatus.tone} label={datasetStatus.label} />
                        </TableCell>
                        <TableCell>
                          <PassRate rate={dataset.passRate} />
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">
                          {dataset.addedAt}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="runs" className="mt-4">
            {workflow.runs.length === 0 ? (
              <div className="border border-dashed border-border px-6 py-12 text-center">
                <p className="text-[13px] font-medium">No runs yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  This workflow is still a draft. Run validation once the schema and datasets are
                  confirmed.
                </p>
              </div>
            ) : (
              <div className="border border-border bg-card">
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
                    {workflow.runs.map((run) => {
                      const runStatus = runTone(run.status)
                      const total = run.passed + run.failed
                      const rate = total > 0 ? (run.passed / total) * 100 : null
                      return (
                        <TableRow key={run.id}>
                          <TableCell className="font-mono text-xs font-medium">{run.id}</TableCell>
                          <TableCell className="font-mono text-xs">{run.startedAt}</TableCell>
                          <TableCell className="font-mono text-xs">{run.duration}</TableCell>
                          <TableCell className="text-right font-mono text-xs tabular-nums">
                            {formatRows(run.passed)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs tabular-nums">
                            {formatRows(run.failed)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge tone={runStatus.tone} label={runStatus.label} />
                          </TableCell>
                          <TableCell>
                            <PassRate rate={rate} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
