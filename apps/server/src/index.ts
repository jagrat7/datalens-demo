import {
  getCompanyWorkspace,
  getWorkflowDetail,
  getWorkflowSummaries,
} from "@oneflow-demo/db/queries"
import { env } from "@oneflow-demo/env/server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

const app = new Hono()

app.use(logger())
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
)

const routes = app
  .get("/", (c) => c.text("OK"))
  .get("/api/company", async (c) => {
    const workspace = await getCompanyWorkspace()
    return c.json(workspace)
  })
  .get("/api/workflows", async (c) => {
    const workflows = await getWorkflowSummaries()
    return c.json(workflows)
  })
  .get("/api/workflows/:workflowId", async (c) => {
    const workflow = await getWorkflowDetail(c.req.param("workflowId"))

    if (!workflow) {
      return c.json({ message: "Workflow not found" }, 404)
    }

    return c.json(workflow)
  })

app.onError((error, c) => {
  console.error(error)
  return c.json({ message: "Internal server error" }, 500)
})

export type AppType = typeof routes

export default app
