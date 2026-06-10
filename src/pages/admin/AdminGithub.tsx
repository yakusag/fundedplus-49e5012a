import { useState } from "react";
import { GitBranch, Upload, CheckCircle2, AlertCircle, Loader2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminGithub() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [output, setOutput] = useState("");

  async function handlePush() {
    setStatus("loading");
    setOutput("");
    try {
      const res = await fetch("/api/push-github", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setOutput(data.output || "Push successful.");
      } else {
        setStatus("error");
        setOutput(data.error || "Unknown error.");
      }
    } catch (e) {
      setStatus("error");
      setOutput("Network error — could not reach server.");
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Github className="h-5 w-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">GitHub Sync</h1>
          <p className="text-sm text-muted-foreground">Push latest code to GitHub repository</p>
        </div>
      </div>

      <div className="mt-8 glass rounded-2xl p-6 space-y-6">
        <div className="flex items-start gap-3">
          <GitBranch className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Target repository</p>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">
              github.com/yakusag/fundedplus
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-5">
          <Button
            onClick={handlePush}
            disabled={status === "loading"}
            className="w-full h-11 gap-2"
            size="lg"
          >
            {status === "loading" ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Pushing to GitHub...</>
            ) : (
              <><Upload className="h-4 w-4" /> Push to GitHub</>
            )}
          </Button>
        </div>

        {status === "success" && (
          <div className="flex items-start gap-3 bg-success/10 border border-success/20 rounded-xl p-4">
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-success">Pushed successfully</p>
              <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap font-mono">{output}</pre>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Push failed</p>
              <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap font-mono">{output}</pre>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Requires <span className="font-mono text-foreground/60">GITHUB_TOKEN</span> secret to be configured.
      </p>
    </div>
  );
}
