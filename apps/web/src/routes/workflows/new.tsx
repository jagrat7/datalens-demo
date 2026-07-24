import { zodResolver } from "@hookform/resolvers/zod"
import { Badge } from "@oneflow-demo/ui/components/badge"
import { Button } from "@oneflow-demo/ui/components/button"
import { Checkbox } from "@oneflow-demo/ui/components/checkbox"
import { Input } from "@oneflow-demo/ui/components/input"
import { Label } from "@oneflow-demo/ui/components/label"
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
import { Textarea } from "@oneflow-demo/ui/components/textarea"
import { cn } from "@oneflow-demo/ui/lib/utils"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Check, FileSpreadsheet, Plus, Trash2, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Canvas, PageHeader } from "@/components/page-header"

export const Route = createFileRoute("/workflows/new")({
  component: NewWorkflowComponent,
})

const columnSchema = z.object({
  name: z.string(),
  type: z.enum(["string", "integer", "decimal", "date", "boolean", "email", "currency"]),
  required: z.boolean(),
  rule: z.string(),
  sample: z.string(),
  source: z.enum(["ai", "user"]),
})

const datasetSchema = z.object({
  name: z.string(),
  format: z.string(),
  size: z.string(),
})

const formSchema = z.object({
  name: z.string().min(3, "Give the workflow a name — at least 3 characters"),
  domain: z.enum(["Insurance", "Dealer Management", "Finance"], {
    error: "Pick the business domain this workflow serves",
  }),
  description: z.string(),
  columns: z.array(columnSchema),
  datasets: z.array(datasetSchema),
})

type FormValues = z.infer<typeof formSchema>

const STEPS = ["Details", "End schema", "Datasets", "Review"] as const

const COLUMN_TYPE_OPTIONS = columnSchema.shape.type.options

function formatSize(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

function fileFormat(name: string): string {
  return name.split(".").pop()?.toUpperCase() ?? "FILE"
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-2">
      {STEPS.map((label, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={label} className="flex items-center">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-5 items-center justify-center text-[10px] font-semibold",
                  done && "bg-healthy-soft text-healthy-foreground",
                  active && "bg-primary text-primary-foreground",
                  !done && !active && "border border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-xs",
                  active ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </span>
            {index < STEPS.length - 1 ? (
              <span className="mx-3 h-px w-8 bg-border" aria-hidden="true" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

function NewWorkflowComponent() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [schemaMode, setSchemaMode] = useState<"upload" | "manual">("upload")
  const [dragging, setDragging] = useState(false)
  const schemaFileRef = useRef<HTMLInputElement>(null)
  const datasetFileRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      columns: [],
      datasets: [],
    },
  })

  const columns = useFieldArray({ control: form.control, name: "columns" })
  const datasets = useFieldArray({ control: form.control, name: "datasets" })
  const errors = form.formState.errors
  const domain = form.watch("domain")

  function handleSchemaFile(fileName: string) {
    toast.info(
      `Schema inference for ${fileName} will be connected with the Bronze data service`,
    )
  }

  function addDatasetFiles(files: FileList | null) {
    if (!files) return
    for (const file of Array.from(files)) {
      datasets.append({ name: file.name, format: fileFormat(file.name), size: formatSize(file.size) })
    }
  }

  async function goNext() {
    if (step === 0) {
      const valid = await form.trigger(["name", "domain"])
      if (!valid) return
    }
    if (step === 1 && columns.fields.length === 0) {
      toast.error("Add at least one target column manually")
      return
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1))
  }

  function onCreate(values: FormValues) {
    toast.info(`Workflow “${values.name}” is ready, but persistence is not connected yet`)
  }

  return (
    <div>
      <PageHeader
        title="New workflow"
        description="Define the target schema and attach the datasets that should enter Bronze. Nothing runs without your review."
      />

      <Canvas>
        <div className="max-w-4xl">
          <Stepper current={step} />

          <div className="mt-6">
            {step === 0 ? (
              <section aria-label="Workflow details">
                <div className="grid gap-5">
                  <div className="grid gap-1.5">
                    <Label htmlFor="wf-name">Workflow name</Label>
                    <Input
                      id="wf-name"
                      placeholder="Workflow name"
                      autoFocus
                      aria-invalid={Boolean(errors.name)}
                      {...form.register("name")}
                    />
                    {errors.name ? (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-1.5">
                    <Label>Business domain</Label>
                    <Controller
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            className="w-64"
                            aria-label="Business domain"
                            aria-invalid={Boolean(errors.domain)}
                          >
                            <SelectValue placeholder="Select a domain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Insurance">Insurance</SelectItem>
                              <SelectItem value="Dealer Management">
                                Dealer Management
                              </SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.domain ? (
                      <p className="text-xs text-destructive">{errors.domain.message}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      The domain tunes which meanings and business rules OneFlow recommends.
                    </p>
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="wf-description">Description</Label>
                    <Textarea
                      id="wf-description"
                      placeholder="What feeds this workflow, and where does validated data land?"
                      rows={3}
                      {...form.register("description")}
                    />
                  </div>
                </div>
              </section>
            ) : null}

            {step === 1 ? (
              <section aria-label="End schema">
                <div className="flex items-center gap-1 border-b border-border">
                  <button
                    type="button"
                    onClick={() => setSchemaMode("upload")}
                    className={cn(
                      "-mb-px border-b-2 px-3 pb-2 text-xs font-medium transition-colors",
                      schemaMode === "upload"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Upload a sample
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchemaMode("manual")}
                    className={cn(
                      "-mb-px border-b-2 px-3 pb-2 text-xs font-medium transition-colors",
                      schemaMode === "manual"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Define manually
                  </button>
                </div>

                {schemaMode === "upload" ? (
                  <div
                    className={cn(
                      "mt-4 border border-dashed px-6 py-10 text-center transition-colors",
                      dragging ? "border-primary bg-accent" : "border-border",
                    )}
                    onDragOver={(event) => {
                      event.preventDefault()
                      setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault()
                      setDragging(false)
                      const file = event.dataTransfer.files[0]
                      if (file) handleSchemaFile(file.name)
                    }}
                  >
                    <Upload className="mx-auto size-5 text-muted-foreground" />
                    <p className="mt-2 text-[13px] font-medium">
                      Drop a sample file, or{" "}
                      <button
                        type="button"
                        className="text-lens-blue underline underline-offset-2"
                        onClick={() => schemaFileRef.current?.click()}
                      >
                        browse
                      </button>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      CSV, XLSX, or JSON. Schema inference is not connected yet; define columns
                      manually for now.
                    </p>
                    <input
                      ref={schemaFileRef}
                      type="file"
                      accept=".csv,.xlsx,.xls,.json"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) handleSchemaFile(file.name)
                        event.target.value = ""
                      }}
                    />
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Add every column the output must have. Schema upload can populate this table
                    once Bronze inference is connected.
                  </p>
                )}

                <div className="mt-4 border border-border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[22%]">Column</TableHead>
                        <TableHead className="w-32">Type</TableHead>
                        <TableHead className="w-20">Required</TableHead>
                        <TableHead>Rule</TableHead>
                        <TableHead className="w-[18%]">Sample</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {columns.fields.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-20 text-center text-xs text-muted-foreground">
                            No columns yet. Add the target schema manually.
                          </TableCell>
                        </TableRow>
                      ) : null}
                      {columns.fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <Input
                              aria-label={`Column ${index + 1} name`}
                              placeholder="column_name"
                              className="h-7 font-mono text-xs"
                              {...form.register(`columns.${index}.name`)}
                            />
                            {form.watch(`columns.${index}.source`) === "ai" ? (
                              <span className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                                <span
                                  aria-hidden="true"
                                  className="size-1.5"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(135deg, var(--lens-teal), var(--lens-blue), var(--lens-violet))",
                                  }}
                                />
                                AI inferred
                              </span>
                            ) : null}
                          </TableCell>
                          <TableCell>
                            <Controller
                              control={form.control}
                              name={`columns.${index}.type`}
                              render={({ field: typeField }) => (
                                <Select
                                  value={typeField.value}
                                  onValueChange={typeField.onChange}
                                >
                                  <SelectTrigger
                                    className="h-7 w-full font-mono text-xs"
                                    aria-label={`Column ${index + 1} type`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {COLUMN_TYPE_OPTIONS.map((type) => (
                                        <SelectItem key={type} value={type}>
                                          {type}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              control={form.control}
                              name={`columns.${index}.required`}
                              render={({ field: requiredField }) => (
                                <Checkbox
                                  checked={requiredField.value}
                                  onCheckedChange={(checked) =>
                                    requiredField.onChange(checked === true)
                                  }
                                  aria-label={`Column ${index + 1} required`}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              aria-label={`Column ${index + 1} rule`}
                              placeholder="not null · unique · range…"
                              className="h-7 font-mono text-xs"
                              {...form.register(`columns.${index}.rule`)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              aria-label={`Column ${index + 1} sample`}
                              placeholder="example value"
                              className="h-7 font-mono text-xs"
                              {...form.register(`columns.${index}.sample`)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Remove column ${index + 1}`}
                              onClick={() => columns.remove(index)}
                            >
                              <Trash2 />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    columns.append({
                      name: "",
                      type: "string",
                      required: true,
                      rule: "",
                      sample: "",
                      source: "user",
                    })
                  }
                >
                  <Plus className="size-3.5" />
                  Add column
                </Button>
              </section>
            ) : null}

            {step === 2 ? (
              <section aria-label="Datasets">
                <div
                  className={cn(
                    "border border-dashed px-6 py-10 text-center transition-colors",
                    dragging ? "border-primary bg-accent" : "border-border",
                  )}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault()
                    setDragging(false)
                    addDatasetFiles(event.dataTransfer.files)
                  }}
                >
                  <FileSpreadsheet className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-2 text-[13px] font-medium">
                    Drop dataset files, or{" "}
                    <button
                      type="button"
                      className="text-lens-blue underline underline-offset-2"
                      onClick={() => datasetFileRef.current?.click()}
                    >
                      browse
                    </button>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    These files feed the workflow. They are profiled against the end schema only
                    after you create it — nothing runs on its own.
                  </p>
                  <input
                    ref={datasetFileRef}
                    type="file"
                    multiple
                    accept=".csv,.xlsx,.xls,.json,.parquet"
                    className="sr-only"
                    onChange={(event) => {
                      addDatasetFiles(event.target.files)
                      event.target.value = ""
                    }}
                  />
                </div>

                {datasets.fields.length > 0 ? (
                  <div className="mt-4 border border-border bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Feed</TableHead>
                          <TableHead>Format</TableHead>
                          <TableHead className="text-right">Size</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-10" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {datasets.fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell className="font-mono text-xs font-medium">
                              {form.watch(`datasets.${index}.name`)}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {form.watch(`datasets.${index}.format`)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs tabular-nums">
                              {form.watch(`datasets.${index}.size`)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">Queued</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                aria-label={`Remove dataset ${index + 1}`}
                                onClick={() => datasets.remove(index)}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-muted-foreground">
                    No datasets yet — you can create the workflow now and feed it later.
                  </p>
                )}
              </section>
            ) : null}

            {step === 3 ? (
              <section aria-label="Review">
                <div className="divide-y divide-border border border-border bg-card">
                  <div className="px-4 py-3.5">
                    <h3 className="text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                      Details
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{form.watch("name")}</span>
                      <Badge variant="secondary">{domain}</Badge>
                    </div>
                    {form.watch("description") ? (
                      <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-muted-foreground">
                        {form.watch("description")}
                      </p>
                    ) : null}
                  </div>
                  <div className="px-4 py-3.5">
                    <h3 className="text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                      End schema · {columns.fields.length} columns
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {columns.fields.slice(0, 10).map((field, index) => (
                        <span
                          key={field.id}
                          className="border border-border px-1.5 py-0.5 font-mono text-[11px]"
                        >
                          {form.watch(`columns.${index}.name`).trim() === ""
                            ? "unnamed"
                            : form.watch(`columns.${index}.name`)}
                        </span>
                      ))}
                      {columns.fields.length > 10 ? (
                        <span className="px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          +{columns.fields.length - 10} more
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="px-4 py-3.5">
                    <h3 className="text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                      Datasets · {datasets.fields.length} feeds
                    </h3>
                    {datasets.fields.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {datasets.fields.map((field, index) => (
                          <li key={field.id} className="font-mono text-[11px] text-muted-foreground">
                            {form.watch(`datasets.${index}.name`)} —{" "}
                            {form.watch(`datasets.${index}.size`)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        No feeds attached. The workflow starts empty and can be fed from its page.
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  When persistence is connected, creating this workflow will store the schema and
                  queue attached datasets for Bronze profiling.
                </p>
              </section>
            ) : null}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                step === 0 ? navigate({ to: "/workflows" }) : setStep((current) => current - 1)
              }
            >
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button size="sm" onClick={goNext}>
                Continue
              </Button>
            ) : (
              <Button size="sm" onClick={form.handleSubmit(onCreate)}>
                Create workflow
              </Button>
            )}
          </div>
        </div>
      </Canvas>
    </div>
  )
}
