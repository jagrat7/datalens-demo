import { Badge } from "@oneflow-demo/ui/components/badge"
import { buttonVariants } from "@oneflow-demo/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@oneflow-demo/ui/components/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@oneflow-demo/ui/components/table"
import { useQuery } from "@tanstack/react-query"
import { Link, createFileRoute } from "@tanstack/react-router"
import { Plus, Workflow as WorkflowIcon } from "lucide-react"

import { DataQueryState } from "@/components/data-query-state"
import { Canvas, PageHeader } from "@/components/page-header"
import { PassRate } from "@/components/pass-rate"
import { StatusBadge, workflowTone } from "@/components/status-badge"
import { workflowsQuery } from "@/lib/queries"
import { formatDateTime } from "@/lib/workspace-data"

export const Route = createFileRoute("/workflows/")({
  component: WorkflowsComponent,
})

function WorkflowsComponent() {
  const {
    data: workflows = [],
    error,
    isPending,
    refetch,
  } = useQuery(workflowsQuery)

  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Each workflow owns one end schema and the datasets that feed it. Open a workflow to review its schema, feeds, and validation runs."
      >
        <Link to="/workflows/new" className={buttonVariants({ size: "sm" })}>
          <Plus data-icon="inline-start" />
          New workflow
        </Link>
      </PageHeader>

      <Canvas>
        <div className="border border-border bg-card">
          <DataQueryState
            isPending={isPending}
            error={error}
            onRetry={() => void refetch()}
          />
          {!isPending && !error && workflows.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-right">Columns</TableHead>
                  <TableHead className="text-right">Datasets</TableHead>
                  <TableHead className="text-right">Rules</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Latest pass rate</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((workflow) => {
                  const status = workflowTone(workflow.status)
                  return (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <Link
                          to="/workflows/$workflowId"
                          params={{ workflowId: workflow.id }}
                          className="block font-medium hover:text-primary hover:underline hover:underline-offset-4"
                        >
                          {workflow.name}
                        </Link>
                        <span className="block max-w-md truncate text-xs text-muted-foreground">
                          {workflow.description}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{workflow.domain}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {workflow.columnCount}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {workflow.datasetCount}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {workflow.rulesCount}
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={status.tone} label={status.label} />
                      </TableCell>
                      <TableCell>
                        <PassRate rate={workflow.latestPassRate} />
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {formatDateTime(workflow.updatedAt)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : !isPending && !error ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <WorkflowIcon />
                </EmptyMedia>
                <EmptyTitle>No workflows yet</EmptyTitle>
                <EmptyDescription>
                  Start with an end schema, then attach the datasets that should enter Bronze.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link to="/workflows/new" className={buttonVariants({ size: "sm" })}>
                  <Plus data-icon="inline-start" />
                  Create workflow
                </Link>
              </EmptyContent>
            </Empty>
          ) : null}
        </div>
      </Canvas>
    </div>
  )
}
