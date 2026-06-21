import "@fontsource/outfit/400.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "../lib/i18n";
import { Toaster } from "@/components/ui/sonner";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-extrabold text-navy">404</h1>
        <h2 className="mt-4 font-display text-xl font-bold text-navy">Page not found</h2>
        <p className="mt-2 text-sm text-navy/60">
          That route doesn't exist yet. Head back to pick a role.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-coral px-5 py-2.5 text-sm font-bold text-white shadow-coral transition hover:brightness-110"
          >
            Back home
          </Link>
        </div>
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
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-bold text-navy">This page didn't load</h1>
        <p className="mt-2 text-sm text-navy/60">
          Something went wrong on our end. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-muted"
          >
            Go home
          </a>
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
      { title: "Perx — AI-powered Employee Lifestyle OS" },
      {
        name: "description",
        content:
          "Perx connects companies, employees and providers in one ecosystem — AI-personalized growth, wellbeing and experiences.",
      },
      { name: "author", content: "Perx" },
      { property: "og:title", content: "Perx — AI-powered Employee Lifestyle OS" },
      {
        property: "og:description",
        content:
          "Companies fund growth. Employees pursue goals. Providers reach corporate customers. All in one AI-powered ecosystem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Perx — AI-powered Employee Lifestyle OS" },
      { name: "description", content: "Perx is an AI-powered Employee Lifestyle OS connecting companies, employees, and providers." },
      { property: "og:description", content: "Perx is an AI-powered Employee Lifestyle OS connecting companies, employees, and providers." },
      { name: "twitter:description", content: "Perx is an AI-powered Employee Lifestyle OS connecting companies, employees, and providers." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/afe4f571-eefc-4e21-a4b0-b02b05b28e08/id-preview-f54c604d--4e89ac31-2243-4b9c-b72e-9c8006b393b4.lovable.app-1782022366768.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/afe4f571-eefc-4e21-a4b0-b02b05b28e08/id-preview-f54c604d--4e89ac31-2243-4b9c-b72e-9c8006b393b4.lovable.app-1782022366768.png" },
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Outlet />
        <Toaster />
      </I18nProvider>
    </QueryClientProvider>

  );
}
