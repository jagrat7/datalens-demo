import { cn } from "@oneflow-demo/ui/lib/utils"
import { Link } from "@tanstack/react-router"
import { BookOpenText, Home, Plus, Workflow } from "lucide-react"
import type { ReactNode } from "react"

import { WORKFLOWS } from "@/lib/workspace-data"

import { BrandLockup } from "./brand-mark"
import { StatusDot, workflowTone } from "./status-badge"

const navLinkBase =
  "flex h-8 items-center gap-2 px-2 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"

const navLinkActive = "bg-lens-blue/[0.07] font-medium text-foreground"

function NavSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="px-2 pb-1.5 text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

export function AppNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-13 shrink-0 items-center border-b border-sidebar-border px-3">
        <Link to="/" onClick={onNavigate} aria-label="OneFlow home">
          <BrandLockup />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <NavSection label="Overview">
          <Link
            to="/"
            onClick={onNavigate}
            activeOptions={{ exact: true }}
            className={navLinkBase}
            activeProps={{ className: navLinkActive }}
          >
            <Home className="size-3.5" />
            Home
          </Link>
        </NavSection>

        <NavSection label="Portals">
          <Link
            to="/company-data"
            onClick={onNavigate}
            className={navLinkBase}
            activeProps={{ className: navLinkActive }}
          >
            <BookOpenText className="size-3.5" />
            Company Data
          </Link>

          <Link
            to="/workflows"
            onClick={onNavigate}
            activeOptions={{ exact: true }}
            className={navLinkBase}
            activeProps={{ className: navLinkActive }}
          >
            <Workflow className="size-3.5" />
            Workflows
          </Link>

          <div className="mt-0.5 ml-[13px] flex flex-col gap-0.5 border-l border-sidebar-border pl-2.5">
            {WORKFLOWS.map((workflow) => {
              const { tone } = workflowTone(workflow.status)
              return (
                <Link
                  key={workflow.id}
                  to="/workflows/$workflowId"
                  params={{ workflowId: workflow.id }}
                  onClick={onNavigate}
                  className="flex h-7 items-center gap-2 px-2 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                  activeProps={{
                    className: "bg-lens-blue/[0.07] font-medium text-foreground",
                  }}
                >
                  <StatusDot tone={tone} />
                  <span className="truncate">{workflow.name}</span>
                </Link>
              )
            })}
            <Link
              to="/workflows/new"
              onClick={onNavigate}
              className="flex h-7 items-center gap-2 px-2 text-xs font-medium text-lens-blue transition-colors hover:bg-sidebar-accent"
              activeProps={{
                className: "bg-lens-blue/[0.07]",
              }}
            >
              <Plus className="size-3" />
              New workflow
            </Link>
          </div>
        </NavSection>
      </nav>

      <div className="shrink-0 border-t border-sidebar-border px-3 py-2.5">
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Bronze layer · setup in progress
        </p>
      </div>
    </div>
  )
}

export function AppSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
      <AppNav />
    </aside>
  )
}

export function SidebarSheetNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className={cn("h-full bg-sidebar")}>
      <AppNav onNavigate={onNavigate} />
    </div>
  )
}
