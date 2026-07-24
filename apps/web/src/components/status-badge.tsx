import { cn } from "@oneflow-demo/ui/lib/utils"

import type { DatasetStatus, WorkflowStatus } from "@/lib/workspace-data"

type Tone = "healthy" | "warning" | "failed" | "info" | "muted"

const toneClasses: Record<Tone, string> = {
  healthy: "bg-healthy-soft text-healthy-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  failed: "bg-failed-soft text-failed-foreground",
  info: "bg-info-soft text-info-foreground",
  muted: "bg-secondary text-muted-foreground",
}

const dotClasses: Record<Tone, string> = {
  healthy: "bg-healthy",
  warning: "bg-warning",
  failed: "bg-failed",
  info: "bg-info",
  muted: "bg-muted-foreground",
}

export function StatusDot({ tone, className }: { tone: Tone; className?: string }) {
  return <span className={cn("inline-block size-1.5 shrink-0", dotClasses[tone], className)} />
}

export function StatusBadge({
  tone,
  label,
  className,
}: {
  tone: Tone
  label: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1.5 px-1.5 text-[11px] font-medium whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
    >
      <StatusDot tone={tone} />
      {label}
    </span>
  )
}

export function workflowTone(status: WorkflowStatus): { tone: Tone; label: string } {
  switch (status) {
    case "healthy":
      return { tone: "healthy", label: "Healthy" }
    case "attention":
      return { tone: "warning", label: "Attention" }
    case "failed":
      return { tone: "failed", label: "Failed" }
    case "draft":
      return { tone: "muted", label: "Draft" }
  }
}

export function datasetTone(status: DatasetStatus): { tone: Tone; label: string } {
  switch (status) {
    case "validated":
      return { tone: "healthy", label: "Validated" }
    case "profiling":
      return { tone: "info", label: "Profiling" }
    case "failed":
      return { tone: "failed", label: "Failed" }
    case "queued":
      return { tone: "muted", label: "Queued" }
  }
}

export function runTone(status: "queued" | "completed" | "failed" | "running"): {
  tone: Tone
  label: string
} {
  switch (status) {
    case "completed":
      return { tone: "healthy", label: "Completed" }
    case "failed":
      return { tone: "failed", label: "Failed" }
    case "running":
      return { tone: "info", label: "Running" }
    case "queued":
      return { tone: "muted", label: "Queued" }
  }
}
