import { cn } from "@oneflow-demo/ui/lib/utils"

export function PassRate({ rate, className }: { rate: number | null; className?: string }) {
  if (rate === null) {
    return <span className={cn("font-mono text-xs text-muted-foreground", className)}>—</span>
  }
  const tone =
    rate >= 98 ? "bg-healthy" : rate >= 90 ? "bg-warning" : "bg-failed"
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="font-mono text-xs tabular-nums">{rate.toFixed(1)}%</span>
      <span className="h-1 w-10 bg-muted">
        <span className={cn("block h-full", tone)} style={{ width: `${rate}%` }} />
      </span>
    </span>
  )
}
