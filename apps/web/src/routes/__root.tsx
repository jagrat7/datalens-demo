import { Toaster } from "@oneflow-demo/ui/components/sonner"
import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { AppNavbar } from "@/components/app-navbar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"

import "../index.css"

export interface RouterAppContext {}

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="6" y1="8" x2="27" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="%232dd4bf"/><stop offset="0.5" stop-color="%235b5bd6"/><stop offset="1" stop-color="%237c3aed"/></linearGradient></defs><rect width="32" height="32" rx="2" fill="%231a1b2e"/><rect x="7" y="8" width="18" height="2.4" rx="1.2" fill="url(%23g)"/><rect x="7" y="12.8" width="13" height="2.4" rx="1.2" fill="url(%23g)"/><rect x="7" y="17.6" width="16" height="2.4" rx="1.2" fill="url(%23g)"/><rect x="7" y="22.4" width="9" height="2.4" rx="1.2" fill="url(%23g)"/></svg>`

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "OneFlow by Datalens",
      },
      {
        name: "description",
        content:
          "OneFlow by Datalens — from raw datasets to validated, schema-conforming outputs in one flow.",
      },
    ],
    links: [
      {
        rel: "icon",
        href: `data:image/svg+xml,${FAVICON_SVG}`,
      },
    ],
  }),
})

function RootComponent() {
  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        storageKey="oneflow-theme"
      >
        <div className="flex h-svh overflow-hidden">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <AppNavbar />
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <Toaster richColors />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  )
}
