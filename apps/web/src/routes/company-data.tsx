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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@oneflow-demo/ui/components/table"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { BookOpenText, Eye, FileText, Search, Upload } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { DataQueryState } from "@/components/data-query-state"
import { DataViewerSheet } from "@/components/data-viewer-sheet"
import { Canvas, PageHeader } from "@/components/page-header"
import { companyWorkspaceQuery } from "@/lib/queries"
import { formatDateTime } from "@/lib/workspace-data"
import type { ParsedCompanyDocument } from "@/lib/workspace-data"

export const Route = createFileRoute("/company-data")({
  component: CompanyDataComponent,
})

function CompanyDataComponent() {
  const [query, setQuery] = useState("")
  const [selectedDocument, setSelectedDocument] =
    useState<ParsedCompanyDocument | null>(null)
  const {
    data: workspace,
    error,
    isPending,
    refetch,
  } = useQuery(companyWorkspaceQuery)
  const documents = workspace?.documents ?? []
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (normalized.length === 0) return documents

    return documents.filter((document) =>
      [document.name, document.parsedText ?? ""].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    )
  }, [documents, query])

  function notifyUploadPending() {
    toast.info("Document upload will be connected with the Bronze data service")
  }

  return (
    <div>
      <PageHeader
        title="Company Data"
        description={
          workspace
            ? `Parsed policies and company references for ${workspace.company.name}. OneFlow uses these as context when it recommends Bronze validation rules.`
            : "Parsed policies and company references used to recommend Bronze validation rules."
        }
      >
        <Button size="sm" onClick={notifyUploadPending}>
          <Upload data-icon="inline-start" />
          Upload document
        </Button>
      </PageHeader>

      <Canvas>
        <div className="border border-border bg-card">
          <DataQueryState
            isPending={isPending}
            error={error}
            onRetry={() => void refetch()}
          />

          {!isPending && !error && documents.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search parsed documents…"
                    aria-label="Search parsed documents"
                    className="pl-7"
                  />
                </div>
                <p className="ml-auto text-xs text-muted-foreground">
                  {filtered.length} of {documents.length} parsed documents
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Pages</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead className="text-right">Parsed</TableHead>
                    <TableHead className="w-20" />
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
                        {document.parsedText ? (
                          <span className="mt-1 block max-w-xl truncate text-xs text-muted-foreground">
                            {document.parsedText}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{document.status}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs uppercase">
                        {document.storageKey.split(".").at(-1) ?? document.mimeType}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {document.metadata?.pageCount ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {document.metadata?.language ?? "—"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {formatDateTime(document.parsedAt ?? document.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedDocument(document)}
                        >
                          <Eye data-icon="inline-start" />
                          View
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
                            <EmptyDescription>Try a different search.</EmptyDescription>
                          </EmptyHeader>
                        </Empty>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </>
          ) : !isPending && !error ? (
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
          ) : null}
        </div>
      </Canvas>

      <DataViewerSheet
        open={selectedDocument !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDocument(null)
        }}
        title={selectedDocument?.name ?? "Company document"}
        description="Parsed company context available to Bronze rule generation."
        metadata={[
          {
            label: "Status",
            value: <Badge variant="secondary">{selectedDocument?.status ?? "—"}</Badge>,
          },
          {
            label: "Format",
            value: (
              <span className="font-mono uppercase">
                {selectedDocument?.storageKey.split(".").at(-1) ?? "—"}
              </span>
            ),
          },
          {
            label: "Pages",
            value: (
              <span className="font-mono tabular-nums">
                {selectedDocument?.metadata?.pageCount ?? "—"}
              </span>
            ),
          },
          {
            label: "Language",
            value: selectedDocument?.metadata?.language ?? "—",
          },
          {
            label: "Parser",
            value: selectedDocument?.metadata?.parser ?? "—",
          },
          {
            label: "Parsed",
            value: formatDateTime(
              selectedDocument?.parsedAt ?? selectedDocument?.createdAt ?? null,
            ),
          },
          {
            label: "Storage key",
            value: (
              <span className="font-mono">{selectedDocument?.storageKey ?? "—"}</span>
            ),
            wide: true,
          },
        ]}
      >
        <article>
          <h2 className="text-sm font-semibold">Parsed content</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            This normalized text is supplied to the rule-generation context.
          </p>
          <div className="mt-4 border-y border-border bg-muted/30 px-4 py-4">
            {selectedDocument?.parsedText ? (
              <p className="max-w-[75ch] whitespace-pre-wrap text-[13px] leading-6">
                {selectedDocument.parsedText}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                No parsed content is available for this document.
              </p>
            )}
          </div>
        </article>
      </DataViewerSheet>
    </div>
  )
}
