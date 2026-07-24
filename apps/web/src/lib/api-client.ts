import { env } from "@oneflow-demo/env/web"

import type {
  CompanyWorkspace,
  WorkflowDetail,
  WorkflowSummary,
} from "./workspace-data"

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(new URL(path, env.VITE_SERVER_URL), { signal })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string
    } | null
    throw new ApiError(body?.message ?? "Unable to load workspace data", response.status)
  }

  return response.json() as Promise<T>
}

export const getCompanyWorkspace = (signal?: AbortSignal) =>
  request<CompanyWorkspace | null>("/api/company", signal)

export const getWorkflows = (signal?: AbortSignal) =>
  request<WorkflowSummary[]>("/api/workflows", signal)

export const getWorkflow = (workflowId: string, signal?: AbortSignal) =>
  request<WorkflowDetail>(`/api/workflows/${encodeURIComponent(workflowId)}`, signal)
