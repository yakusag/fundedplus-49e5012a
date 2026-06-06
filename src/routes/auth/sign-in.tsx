import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { isClerkConfigured } from "@/integrations/clerk";

export const Route = createFileRoute("/auth/sign-in")({
  head: () => ({ meta: [{ title: "Sign in — FundedPlus" }] }),
  component: () => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        {isClerkConfigured ? (
          <SignIn routing="hash" signUpUrl="/auth/sign-up" afterSignInUrl="/dashboard" />
        ) : (
          <NotConfigured />
        )}
      </div>
    </SiteLayout>
  ),
});

function NotConfigured() {
  return (
    <div className="glass rounded-2xl p-8 max-w-md text-center">
      <h2 className="text-xl font-semibold">Auth not configured yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">Add your Clerk publishable key to enable sign in.</p>
    </div>
  );
}
