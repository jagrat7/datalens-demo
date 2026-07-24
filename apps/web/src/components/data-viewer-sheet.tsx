import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@oneflow-demo/ui/components/sheet"
import { Separator } from "@oneflow-demo/ui/components/separator"
import { cn } from "@oneflow-demo/ui/lib/utils"
import type { ReactNode } from "react"

interface ViewerMetadata {
  label: string
  value: ReactNode
  wide?: boolean
}

interface DataViewerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  metadata: ViewerMetadata[]
  children: ReactNode
}

export function DataViewerSheet({
  open,
  onOpenChange,
  title,
  description,
  metadata,
  children,
}: DataViewerSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader className="gap-1 px-5 py-4 pr-14">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <Separator />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 bg-muted/30 px-5 py-4">
          {metadata.map((item) => (
            <div
              key={item.label}
              className={cn("min-w-0", item.wide && "col-span-2")}
            >
              <dt className="text-[11px] font-medium text-muted-foreground">
                {item.label}
              </dt>
              <dd className="mt-1 break-words text-xs">{item.value}</dd>
            </div>
          ))}
        </dl>
        <Separator />
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
