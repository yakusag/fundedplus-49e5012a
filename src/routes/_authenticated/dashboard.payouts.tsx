import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Route as AuthRoute } from "./route";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/payouts")({
  head: () => ({ meta: [{ title: "Payouts — FundedPlus" }] }),
  component: PayoutsPage,
});

type Payout = { id: string; amount: number; currency: string; method: string | null; status: string; created_at: string; admin_notes: string | null };

function PayoutsPage() {
  const { user } = AuthRoute.useRouteContext();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState("");

  async function load() {
    const { data } = await supabase.from("payouts").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setPayouts((data as Payout[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [user.id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("payouts").insert({
      user_id: user.id, amount: parseFloat(amount), method, account_details: { details },
    });
    if (error) return toast.error(error.message);
    toast.success("Payout request submitted");
    setOpen(false); setAmount(""); setMethod(""); setDetails(""); load();
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payouts</h1>
          <p className="text-muted-foreground mt-1">Track and request withdrawals.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Request payout</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Request a payout</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div><Label>Amount (USD)</Label><Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
              <div><Label>Method</Label><Input value={method} onChange={(e) => setMethod(e.target.value)} placeholder="Bank wire, USDT, etc." required /></div>
              <div><Label>Account details</Label><Input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="IBAN / wallet address" required /></div>
              <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground">Submit</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <Loader2 className="h-5 w-5 animate-spin mt-8" /> : payouts.length === 0 ? (
        <div className="glass rounded-2xl p-12 mt-8 text-center text-muted-foreground">No payouts yet.</div>
      ) : (
        <div className="glass rounded-2xl mt-8 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border/40"><tr><th className="text-left p-4">Date</th><th className="text-left p-4">Amount</th><th className="text-left p-4">Method</th><th className="text-left p-4">Status</th></tr></thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-b border-border/20">
                  <td className="p-4">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold">${p.amount}</td>
                  <td className="p-4">{p.method}</td>
                  <td className="p-4"><Badge variant={p.status === "paid" ? "default" : p.status === "rejected" ? "destructive" : "secondary"}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
