import { useState } from "react";
import { Settings, CheckCircle2, AlertCircle, Loader2, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminMetaAPI() {
  const [profileId, setProfileId] = useState("");
  const [server, setServer] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"ok" | "error" | null>(null);
  const [testMsg, setTestMsg] = useState("");

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/metaapi-test", { method: "POST" });
      const data = await res.json() as { ok?: boolean; accounts?: number; error?: string };
      if (data.ok) {
        setTestResult("ok");
        setTestMsg(`Connected! ${data.accounts ?? 0} account(s) found.`);
      } else {
        setTestResult("error");
        setTestMsg(data.error || "Connection failed.");
      }
    } catch {
      setTestResult("error");
      setTestMsg("Network error.");
    }
    setTesting(false);
  }

  const steps = [
    { n: 1, text: "Go to", link: "https://app.metaapi.cloud", label: "app.metaapi.cloud", rest: "and sign in" },
    { n: 2, text: "Go to Provisioning Profiles → click New Profile" },
    { n: 3, text: "Upload your broker's .srv file and save — copy the Profile ID" },
    { n: 4, text: "Add 2 secrets in Replit: METAAPI_PROVISIONING_PROFILE_ID and METAAPI_BROKER_SERVER" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-2xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">MetaAPI Configuration</h1>
          <p className="text-sm text-muted-foreground">Setup MT4/MT5 demo account creation</p>
        </div>
      </div>

      {/* Connection test */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">API Connection</p>
            <p className="text-xs text-muted-foreground mt-0.5">Test if METAAPI_TOKEN is working</p>
          </div>
          <Button onClick={handleTest} disabled={testing} variant="outline" size="sm" className="gap-2">
            {testing ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Testing...</> : "Test Connection"}
          </Button>
        </div>

        {testResult === "ok" && (
          <div className="flex items-center gap-2 bg-success/10 border border-success/20 rounded-xl px-4 py-2.5 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span className="text-success">{testMsg}</span>
          </div>
        )}
        {testResult === "error" && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-2.5 text-sm">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <span className="text-destructive">{testMsg}</span>
          </div>
        )}
      </div>

      {/* Required secrets */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Info className="h-4 w-4 text-primary" />
          <p className="font-semibold">Required Secrets</p>
        </div>
        <p className="text-sm text-muted-foreground">Add these in Replit → Secrets tab:</p>

        {[
          { key: "METAAPI_TOKEN", desc: "Your MetaAPI auth token", status: "✅ Already set" },
          { key: "METAAPI_PROVISIONING_PROFILE_ID", desc: "Profile ID from MetaAPI dashboard", status: "⚠️ Required" },
          { key: "METAAPI_BROKER_SERVER", desc: "Broker server name (e.g. ICMarketsSC-Demo)", status: "⚠️ Required" },
        ].map(({ key, desc, status }) => (
          <div key={key} className="bg-white/3 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-mono text-sm font-medium">{key}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
            <span className="text-xs">{status}</span>
          </div>
        ))}
      </div>

      {/* Setup steps */}
      <div className="glass rounded-2xl p-6 space-y-5">
        <p className="font-semibold">How to get a Provisioning Profile</p>
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.n} className="flex items-start gap-4">
              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {s.n}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.text}{" "}
                {s.link && (
                  <a href={s.link} target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1">
                    {s.label} <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {s.rest && ` ${s.rest}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
