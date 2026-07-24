import { Button } from "@oneflow-demo/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@oneflow-demo/ui/components/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@oneflow-demo/ui/components/sheet"
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

function featurePending(feature: string) {
  toast.info(`${feature} is not connected yet`)
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

      <div className="relative ml-1 hidden w-72 md:block">
        <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search workflows, documents…"
          aria-label="Search"
          className="h-8 w-full border border-input bg-background pr-10 pl-7 text-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring/40"
          onKeyDown={(event) => {
            if (event.key === "Enter") featurePending("Search")
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
          onClick={() => featurePending("Notifications")}
        >
          <Bell className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" aria-label="User settings and more" />}
          >
            <Menu className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2.5 py-2">
                <span className="flex size-8 shrink-0 items-center justify-center bg-foreground text-background">
                  <User className="size-3.5" />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block truncate text-[13px] font-semibold">
                    Workspace account
                  </span>
                  <span className="block truncate text-[11px] font-normal text-muted-foreground">
                    Data Operations
                  </span>
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => featurePending("Profile & account")}>
                <User className="size-3.5" />
                Profile &amp; account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => featurePending("Preferences")}>
                <Settings2 className="size-3.5" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => featurePending("API tokens")}>
                <KeyRound className="size-3.5" />
                API tokens
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => featurePending("Keyboard shortcuts")}>
                <Keyboard className="size-3.5" />
                Keyboard shortcuts
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="size-3.5 dark:hidden" />
                  <Moon className="hidden size-3.5 dark:block" />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
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
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => featurePending("Help & documentation")}>
                <CircleHelp className="size-3.5" />
                Help &amp; docs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => featurePending("Release notes")}>
                <Sparkles className="size-3.5" />
                What&apos;s new
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => featurePending("Sign out")}>
                <LogOut className="size-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
