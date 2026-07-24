import { queryOptions } from "@tanstack/react-query"

import {
  getCompanyWorkspace,
  getWorkflow,
  getWorkflows,
} from "./api-client"

export const companyWorkspaceQuery = queryOptions({
  queryKey: ["company-workspace"],
  queryFn: ({ signal }) => getCompanyWorkspace(signal),
})

export const workflowsQuery = queryOptions({
  queryKey: ["workflows"],
  queryFn: ({ signal }) => getWorkflows(signal),
})

export const workflowQuery = (workflowId: string) =>
  queryOptions({
    queryKey: ["workflows", workflowId],
    queryFn: ({ signal }) => getWorkflow(workflowId, signal),
  })
