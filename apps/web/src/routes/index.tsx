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
import { ArrowRight, Plus } from "lucide-react"

import { Canvas } from "@/components/page-header"
import { PassRate } from "@/components/pass-rate"
import { StatusBadge, workflowTone } from "@/components/status-badge"
import { WORKFLOWS } from "@/lib/sample-data"

export const Route = createFileRoute("/")({
  component: HomeComponent,
})

const FLOW_STEPS = [
  {
    number: "1",
    title: "Define the end schema",
    body: "Upload a sample file and let OneFlow infer the columns, or write them yourself — types, constraints, and rules included.",
  },
  {
    number: "2",
    title: "Feed datasets",
    body: "CSV, Excel, and more flow into the workflow as feeds. Each one is profiled against your schema before it lands.",
  },
  {
    number: "3",
    title: "Review, then validate",
    body: "Confirm AI-inferred meanings and recommended rules with their evidence in front of you. Then run and watch pass rates.",
  },
]

function latestPassRate(workflow: (typeof WORKFLOWS)[number]): number | null {
  const withRates = workflow.datasets.filter((dataset) => dataset.passRate !== null)
  if (withRates.length === 0) return null
  return withRates[withRates.length - 1]?.passRate ?? null
}

function HomeComponent() {
  const navigate = useNavigate()
  const recent = [...WORKFLOWS].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <div>
      <section className="border-b border-border px-6 pt-10 pb-8 lg:px-8">
        <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-balance">
          Move a dataset from raw to validated — in one flow.
        </h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          Create a workflow to define the end schema and feed it datasets. OneFlow infers what
          every column means, recommends the rules it should satisfy, and waits for your
          confirmation before anything runs.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button render={<Link to="/workflows/new" />} nativeButton={false}>
            <Plus className="size-3.5" />
            New workflow
          </Button>
          <Button variant="outline" render={<Link to="/company-data" />} nativeButton={false}>
            Add company data
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 border-b border-border md:grid-cols-3">
        {FLOW_STEPS.map((step) => (
          <div
            key={step.number}
            className="border-border px-6 py-5 not-first:border-t md:not-first:border-t-0 md:not-first:border-l lg:px-8"
          >
            <p className="font-mono text-xs text-muted-foreground">{step.number}</p>
            <h2 className="mt-1.5 text-[13px] font-semibold">{step.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </section>

      <Canvas>
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold">Jump back in</h2>
          <Button
            variant="ghost"
            size="sm"
            render={<Link to="/workflows" />}
            nativeButton={false}
          >
            All workflows
            <ArrowRight className="size-3.5" />
          </Button>
        </div>

        <div className="mt-3 border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Datasets</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Latest pass rate</TableHead>
                <TableHead className="text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((workflow) => {
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
                    <TableCell className="font-medium">{workflow.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{workflow.domain}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {workflow.datasets.length}
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

        <p className="mt-3 text-[11px] text-muted-foreground">
          Demo workspace — every workflow, dataset, and pass rate on this page is illustrative
          sample data.
        </p>
      </Canvas>
    </div>
  )
}
