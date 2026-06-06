import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CLERK_PUBLISHABLE_KEY, isClerkConfigured } from "../integrations/clerk";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <a href="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-ice">
          Back home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-ice"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-border px-4 py-2 text-sm font-medium">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FundedPlus — Get Funded. Trade Bigger." },
      { name: "description", content: "Pass our trading challenge and trade up to $200K of our capital. Keep up to 90% of profits." },
      { name: "theme-color", content: "#0a1530" },
      { property: "og:title", content: "FundedPlus — Get Funded. Trade Bigger." },
      { property: "og:description", content: "Pass our challenge and trade funded accounts up to $200K. Keep up to 90% of profits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ConfigureClerkBanner() {
  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-sm rounded-lg border border-primary/40 bg-card/95 backdrop-blur p-4 shadow-card">
      <p className="text-sm font-semibold mb-1">Clerk not configured</p>
      <p className="text-xs text-muted-foreground">
        Paste your Clerk publishable key (pk_test_… or pk_live_…) in chat so I can wire up auth.
      </p>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  const content = (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {!isClerkConfigured && <ConfigureClerkBanner />}
    </QueryClientProvider>
  );

  if (!isClerkConfigured) {
    return content;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
      {content}
    </ClerkProvider>
  );
}
