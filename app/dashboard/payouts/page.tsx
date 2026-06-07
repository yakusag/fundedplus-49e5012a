"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function PayoutsPage() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Payout request submitted — contact support to process.");
    setOpen(false); setAmount(""); setMethod(""); setDetails("");
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
            <Button className="bg-gradient-primary text-[hsl(222,47%,11%)]"><Plus className="h-4 w-4 mr-2" />Request payout</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Request a payout</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div><Label>Amount (USD)</Label><Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
              <div><Label>Method</Label><Input value={method} onChange={(e) => setMethod(e.target.value)} placeholder="Bank wire, USDT, etc." required /></div>
              <div><Label>Account details</Label><Input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="IBAN / wallet address" required /></div>
              <Button type="submit" className="w-full bg-gradient-primary text-[hsl(222,47%,11%)]">Submit</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="glass rounded-2xl p-12 mt-8 text-center text-muted-foreground">No payouts yet.</div>
    </div>
  );
}
