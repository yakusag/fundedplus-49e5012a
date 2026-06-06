import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Route as AdminRoute } from "./route";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/payouts")({
  head: () => ({ meta: [{ title: "Payouts — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PayoutsAdmin,
});

type Payout = { id: string; user_id: string; amount: number; currency: string; method: string | null; status: string; admin_notes: string | null; account_details: any; created_at: string };

function PayoutsAdmin() {
  const { user } = AdminRoute.useRouteContext();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { email: string; full_name: string | null }>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [reviewing, setReviewing] = useState<Payout | null>(null);
  const [notes, setNotes] = useState("");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("payouts").select("*").order("created_at", { ascending: false });
    const list = (data as Payout[]) || [];
    setPayouts(list);
    const ids = [...new Set(list.map((p) => p.user_id))];
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, email, full_name").in("id", ids);
      const map: Record<string, any> = {};
      (profs || []).forEach((p: any) => { map[p.id] = { email: p.email, full_name: p.full_name }; });
      setProfiles(map);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function review(status: "approved" | "rejected" | "paid") {
    if (!reviewing) return;
    const { error } = await supabase.from("payouts").update({
      status: status as any, admin_notes: notes || null, reviewed_by: user.id, reviewed_at: new Date().toISOString(),
    }).eq("id", reviewing.id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`); setReviewing(null); setNotes(""); load();
  }

  async function del(id: string) {
    if (!confirm("Delete this payout request?")) return;
    const { error } = await supabase.from("payouts").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  }

  const filtered = payouts.filter((p) => !search || profiles[p.user_id]?.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Payouts</h1>
        <Input placeholder="Search by email..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="glass rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/40"><tr><th className="text-left p-4">Date</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Amount</th><th className="text-left p-4">Method</th><th className="text-left p-4">Status</th><th className="text-right p-4">Actions</th></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/20">
                  <td className="p-4">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="p-4"><div className="font-medium">{profiles[p.user_id]?.full_name || "—"}</div><div className="text-xs text-muted-foreground">{profiles[p.user_id]?.email}</div></td>
                  <td className="p-4 font-semibold">${p.amount} {p.currency}</td>
                  <td className="p-4">{p.method}</td>
                  <td className="p-4"><Badge variant={p.status === "paid" ? "default" : p.status === "rejected" ? "destructive" : p.status === "approved" ? "default" : "secondary"}>{p.status}</Badge></td>
                  <td className="p-4 text-right space-x-1">
                    <Button size="sm" variant="outline" onClick={() => { setReviewing(p); setNotes(p.admin_notes || ""); }}>Review</Button>
                    <Button size="sm" variant="ghost" onClick={() => del(p.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No payout requests</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!reviewing} onOpenChange={(o) => !o && setReviewing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Review payout</DialogTitle></DialogHeader>
          {reviewing && (
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <div><span className="text-muted-foreground">Customer:</span> {profiles[reviewing.user_id]?.email}</div>
                <div><span className="text-muted-foreground">Amount:</span> ${reviewing.amount} {reviewing.currency}</div>
                <div><span className="text-muted-foreground">Method:</span> {reviewing.method}</div>
                <div><span className="text-muted-foreground">Details:</span> <pre className="text-xs mt-1 p-2 bg-muted/30 rounded">{JSON.stringify(reviewing.account_details, null, 2)}</pre></div>
              </div>
              <div>
                <label className="text-sm font-medium">Admin notes</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => review("approved")} className="flex-1"><Check className="h-4 w-4 mr-2" />Approve</Button>
                <Button onClick={() => review("paid")} className="flex-1 bg-gradient-primary text-primary-foreground">Mark paid</Button>
                <Button onClick={() => review("rejected")} variant="destructive" className="flex-1"><X className="h-4 w-4 mr-2" />Reject</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
