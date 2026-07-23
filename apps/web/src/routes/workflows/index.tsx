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
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { Canvas, PageHeader } from "@/components/page-header"
import { PassRate } from "@/components/pass-rate"
import { StatusBadge, workflowTone } from "@/components/status-badge"
import { WORKFLOWS } from "@/lib/sample-data"

export const Route = createFileRoute("/workflows/")({
  component: WorkflowsComponent,
})

function latestPassRate(workflow: (typeof WORKFLOWS)[number]): number | null {
  const withRates = workflow.datasets.filter((dataset) => dataset.passRate !== null)
  if (withRates.length === 0) return null
  return withRates[withRates.length - 1]?.passRate ?? null
}

function WorkflowsComponent() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Each workflow owns one end schema and the datasets that feed it. Open a workflow to review its schema, feeds, and validation runs."
      >
        <Button size="sm" render={<Link to="/workflows/new" />} nativeButton={false}>
          <Plus className="size-3.5" />
          New workflow
        </Button>
      </PageHeader>

      <Canvas>
        <div className="border border-border bg-card">
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
              {WORKFLOWS.map((workflow) => {
                const status = workflowTone(workflow.status)
                return (
                  <TableRow
                    key={workflow.id}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate({
                        to: "/workflows/$workflowId",
                        params: { workflowId: workflow.id },
                      })
                    }
                  >
                    <TableCell>
                      <span className="block font-medium">{workflow.name}</span>
                      <span className="block max-w-md truncate text-xs text-muted-foreground">
                        {workflow.description}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{workflow.domain}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {workflow.schema.length}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {workflow.datasets.length}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {workflow.rulesCount}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={status.tone} label={status.label} />
                    </TableCell>
                    <TableCell>
                      <PassRate rate={latestPassRate(workflow)} />
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {workflow.updatedAt}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Canvas>
    </div>
  )
}
