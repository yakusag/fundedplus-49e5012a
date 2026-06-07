import { SignUp } from "@clerk/nextjs";
import { SiteLayout } from "@/components/site/SiteLayout";

export const metadata = { title: "Create account — FundedPlus" };

export default function SignUpPage() {
  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "glass rounded-2xl shadow-glow border-0 bg-transparent",
              headerTitle: "text-foreground font-bold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border-border bg-card/50 text-foreground hover:bg-accent",
              formFieldInput: "bg-card/50 border-border text-foreground",
              formButtonPrimary: "bg-gradient-primary text-[hsl(222,47%,11%)] hover:opacity-90",
              footerActionLink: "text-primary",
            },
          }}
        />
      </div>
    </SiteLayout>
  );
}
