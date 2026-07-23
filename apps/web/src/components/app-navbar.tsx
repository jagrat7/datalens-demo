import { Button } from "@oneflow-demo/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@oneflow-demo/ui/components/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@oneflow-demo/ui/components/sheet"
import { Link } from "@tanstack/react-router"
import {
  Bell,
  CircleHelp,
  KeyRound,
  Keyboard,
  LogOut,
  Menu,
  Monitor,
  Moon,
  PanelLeft,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Sun,
  User,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { SidebarSheetNav } from "@/components/app-sidebar"
import { useTheme } from "@/components/theme-provider"

function demoOnly(feature: string) {
  toast.info(`${feature} is not wired up in this v0 demo`)
}

export function AppNavbar() {
  const { setTheme } = useTheme()
  const [navOpen, setNavOpen] = useState(false)

  return (
    <header className="flex h-13 shrink-0 items-center gap-2 border-b border-border bg-background px-3 lg:px-4">
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={() => setNavOpen(true)}
        >
          <PanelLeft className="size-4" />
        </Button>
        <SheetContent side="left" className="w-64 p-0" aria-label="Navigation">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarSheetNav onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" aria-label="User settings and more" />}
        >
          <Menu className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2.5 py-2">
            <span className="flex size-8 shrink-0 items-center justify-center bg-foreground text-[11px] font-semibold text-background">
              AR
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[13px] font-semibold">Asha Rao</span>
              <span className="block truncate text-[11px] font-normal text-muted-foreground">
                Data Operations · demo seat
              </span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => demoOnly("Profile & account")}>
            <User className="size-3.5" />
            Profile &amp; account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => demoOnly("Preferences")}>
            <Settings2 className="size-3.5" />
            Preferences
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => demoOnly("API tokens")}>
            <KeyRound className="size-3.5" />
            API tokens
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => demoOnly("Keyboard shortcuts")}>
            <Keyboard className="size-3.5" />
            Keyboard shortcuts
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="size-3.5 dark:hidden" />
              <Moon className="hidden size-3.5 dark:block" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="size-3.5" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="size-3.5" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="size-3.5" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => demoOnly("Help & documentation")}>
            <CircleHelp className="size-3.5" />
            Help &amp; docs
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => demoOnly("Release notes")}>
            <Sparkles className="size-3.5" />
            What&apos;s new
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => demoOnly("Sign out")}>
            <LogOut className="size-3.5" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="relative ml-1 hidden w-72 md:block">
        <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search workflows, documents…"
          aria-label="Search"
          className="h-8 w-full border border-input bg-background pr-10 pl-7 text-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring/40"
          onKeyDown={(event) => {
            if (event.key === "Enter") demoOnly("Search")
          }}
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 border border-border bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          onClick={() => demoOnly("Notifications")}
        >
          <Bell className="size-4" />
        </Button>
        <Button
          size="sm"
          className="ml-1"
          render={<Link to="/workflows/new" />}
          nativeButton={false}
        >
          <Plus className="size-3.5" />
          New workflow
        </Button>
      </div>
    </header>
  )
}
