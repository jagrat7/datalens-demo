import { Button } from "@oneflow-demo/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@oneflow-demo/ui/components/empty"
import { Skeleton } from "@oneflow-demo/ui/components/skeleton"
import { RefreshCw, TriangleAlert } from "lucide-react"

export function DataQueryState({
  isPending,
  error,
  onRetry,
}: {
  isPending: boolean
  error: Error | null
  onRetry: () => void
}) {
  if (isPending) {
    return (
      <div className="flex flex-col gap-3 p-5" aria-label="Loading workspace data">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlert />
          </EmptyMedia>
          <EmptyTitle>Unable to load data</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" variant="outline" onClick={onRetry}>
            <RefreshCw data-icon="inline-start" />
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return null
}
