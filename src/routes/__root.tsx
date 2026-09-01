import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { asset } from "@/lib/utils";
import appCss from "../styles.css?url";

const APP_NAME = "Silent Island Atlas";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0b0d11" },
      {
        name: "description",
        content:
          "Island chart, East Fairfield shore, and a ST roster for the chronicle.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: asset("/favicon.svg") },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: asset("/__grok/manifest.webmanifest") },
      { rel: "apple-touch-icon", href: asset("/__grok/icon-180.png") },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-ink text-paper">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
