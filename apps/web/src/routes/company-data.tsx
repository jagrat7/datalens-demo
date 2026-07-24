import { Badge } from "@oneflow-demo/ui/components/badge"
import { Button } from "@oneflow-demo/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@oneflow-demo/ui/components/empty"
import { Input } from "@oneflow-demo/ui/components/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@oneflow-demo/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@oneflow-demo/ui/components/table"
import { createFileRoute } from "@tanstack/react-router"
import { BookOpenText, Download, FileText, Search, Upload } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { Canvas, PageHeader } from "@/components/page-header"
import {
  COMPANY_DOCUMENTS,
  DOCUMENT_CATEGORIES,
  type DocumentCategory,
} from "@/lib/workspace-data"

export const Route = createFileRoute("/company-data")({
  component: CompanyDataComponent,
})

function CompanyDataComponent() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<DocumentCategory | "all">("all")

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return COMPANY_DOCUMENTS.filter((document) => {
      const matchesCategory = category === "all" || document.category === category
      const matchesQuery =
        normalized.length === 0 ||
        document.name.toLowerCase().includes(normalized) ||
        document.owner.toLowerCase().includes(normalized)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  function notifyUploadPending() {
    toast.info("Document upload will be connected with the Bronze data service")
  }

  return (
    <div>
      <PageHeader
        title="Company Data"
        description="Policy documents and company references. OneFlow treats these as ground truth when it infers column meanings and recommends validation rules."
      >
        <Button size="sm" onClick={notifyUploadPending}>
          <Upload data-icon="inline-start" />
          Upload document
        </Button>
      </PageHeader>

      <Canvas>
        {COMPANY_DOCUMENTS.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search documents or owners…"
                  aria-label="Search documents"
                  className="pl-7"
                />
              </div>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as DocumentCategory | "all")}
              >
                <SelectTrigger className="w-44" aria-label="Filter by category">
                  <SelectValue>{category === "all" ? "All categories" : category}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All categories</SelectItem>
                    {DOCUMENT_CATEGORIES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="ml-auto text-xs text-muted-foreground">
                {filtered.length} of {COMPANY_DOCUMENTS.length} documents
              </p>
            </div>

            <div className="mt-3 border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Updated</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <span className="flex items-center gap-2 font-medium">
                          <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                          {document.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{document.category}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{document.format}</TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {document.size}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{document.owner}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {document.updatedAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Download ${document.name}`}
                          onClick={() =>
                            toast.info("Document download is not connected yet")
                          }
                        >
                          <Download />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Empty className="py-8">
                          <EmptyHeader>
                            <EmptyTitle>No matching documents</EmptyTitle>
                            <EmptyDescription>
                              Try a different search or category.
                            </EmptyDescription>
                          </EmptyHeader>
                        </Empty>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="border border-border bg-card">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BookOpenText />
                </EmptyMedia>
                <EmptyTitle>No company data yet</EmptyTitle>
                <EmptyDescription>
                  Add the policies and reference documents that should inform Bronze validation
                  rules.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm" onClick={notifyUploadPending}>
                  <Upload data-icon="inline-start" />
                  Upload document
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </Canvas>
    </div>
  )
}
